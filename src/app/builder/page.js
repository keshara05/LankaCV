'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FormContainer from '@/components/FormPanel/FormContainer';
import PreviewContainer from '@/components/PreviewPanel/PreviewContainer';
import { INITIAL_CV_DATA } from '@/lib/initialData';
import { TEMPLATES } from '@/components/PreviewPanel/templates';
import { TRANSLATIONS } from '@/lib/translations';

const THEME_COLORS = [
  { name: 'Navy', hex: '#1e3a8a' },
  { name: 'Indigo', hex: '#4f46e5' },
  { name: 'Teal', hex: '#0d9488' },
  { name: 'Slate', hex: '#334155' },
  { name: 'Gold', hex: '#b45309' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Rose', hex: '#be123c' }
];

function BuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialLang = searchParams.get('lang') === 'si' ? 'si' : 'en';
  const initialTemplateId = searchParams.get('template');

  const [cvData, setCvData] = useState(() => {
    if (initialTemplateId) {
      const template = TEMPLATES.find(t => t.id === initialTemplateId);
      if (template) {
        return {
          ...INITIAL_CV_DATA,
          templateId: initialTemplateId,
          themeColor: template.defaultColor
        };
      }
    }
    return INITIAL_CV_DATA;
  });
  const [mobileTab, setMobileTab] = useState('edit'); // 'edit' or 'preview'
  const [isSaving, setIsSaving] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [lang, setLang] = useState(initialLang);

  // Initialize Dark Mode & Lang based on localstorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = localStorage.getItem('darkMode') !== 'false'; // Dark default
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      const storedLang = localStorage.getItem('lang');
      if (storedLang === 'si' || storedLang === 'en') {
        setLang(storedLang);
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    localStorage.setItem('darkMode', String(nextDark));
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'si' : 'en';
    setLang(nextLang);
    localStorage.setItem('lang', nextLang);
  };

  // Sync default template color when template changes
  const handleTemplateChange = (templateId) => {
    const template = TEMPLATES.find(t => t.id === templateId);
    setCvData(prev => ({
      ...prev,
      templateId,
      themeColor: template ? template.defaultColor : prev.themeColor
    }));
  };

  const handleSaveAndCheckout = async () => {
    setIsSaving(true);
    try {
      const cvId = 'cv-' + Math.random().toString(36).substring(2, 11);
      
      const response = await fetch('/api/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cvId, cvData: { ...cvData, language: lang } })
      });

      if (response.ok) {
        router.push(`/checkout?id=${cvId}`);
      } else {
        alert(t.saveError || 'Failed to save CV details.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const t = TRANSLATIONS[lang];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Top Navbar */}
      <header className="h-16 px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center z-20 shadow-sm sticky top-0 transition-colors duration-300">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
          <span className="text-lg font-black tracking-tight text-indigo-600 dark:text-indigo-400 hover:scale-105 transition-transform">
            {t.title}
          </span>
          <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            {t.tagline}
          </span>
        </div>

        {/* Builder Toolbar Options */}
        <div className="flex items-center gap-4">
          
          {/* Template Selector */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Template:</span>
            <select
              value={cvData.templateId}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="px-2 py-1.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs font-bold focus:ring-1 focus:ring-indigo-500 outline-none"
            >
              {TEMPLATES.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Color Customizer */}
          <div className="hidden lg:flex items-center gap-1.5">
            {THEME_COLORS.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => setCvData({ ...cvData, themeColor: color.hex })}
                className={`w-5 h-5 rounded-full border transition-transform ${cvData.themeColor === color.hex ? 'scale-125 border-slate-900 dark:border-white' : 'border-transparent hover:scale-110'}`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>

          {/* Language Selector Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 rounded-lg text-xs font-extrabold jelly-btn"
          >
            🌐 {t.langToggle}
          </button>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-bold jelly-btn"
            title="Toggle Light/Dark Mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* Checkout Button */}
          <button
            type="button"
            onClick={handleSaveAndCheckout}
            disabled={isSaving}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-1 jelly-btn"
          >
            {isSaving ? t.saving : t.finishBtn}
          </button>
        </div>
      </header>

      {/* Mobile Toolbar Option Bar */}
      <div className="md:hidden flex justify-between items-center px-4 py-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-500">Template:</span>
          <select
            value={cvData.templateId}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="px-2 py-1 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg text-[10px] font-bold"
          >
            {TEMPLATES.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1">
          {THEME_COLORS.slice(0, 5).map((color) => (
            <button
              key={color.name}
              type="button"
              onClick={() => setCvData({ ...cvData, themeColor: color.hex })}
              className={`w-4 h-4 rounded-full border ${cvData.themeColor === color.hex ? 'border-slate-950 dark:border-white scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>

      {/* Mobile Screen Switch Tabs */}
      <div className="sm:hidden flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300">
        <button
          onClick={() => setMobileTab('edit')}
          className={`flex-1 py-3 text-center text-xs font-extrabold tracking-wider uppercase transition-colors ${
            mobileTab === 'edit' 
              ? 'border-b-2 border-indigo-600 text-indigo-600 bg-slate-50/50 dark:bg-slate-950/20' 
              : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-950/20'
          }`}
        >
          ✍️ {lang === 'si' ? 'විස්තර ලියන්න' : 'Edit details'}
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-3 text-center text-xs font-extrabold tracking-wider uppercase transition-colors ${
            mobileTab === 'preview' 
              ? 'border-b-2 border-indigo-600 text-indigo-600 bg-slate-50/50 dark:bg-slate-950/20' 
              : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-950/20'
          }`}
        >
          👁️ {lang === 'si' ? 'පෙරදසුන' : 'Live Preview'}
        </button>
      </div>

      {/* Split-Screen Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Form Panel */}
        <div className={`w-full sm:w-1/2 flex flex-col h-full border-r border-slate-200 dark:border-slate-800 ${mobileTab === 'edit' ? 'flex' : 'hidden sm:flex'}`}>
          <FormContainer cvData={cvData} onChange={setCvData} lang={lang} />
        </div>

        {/* Right Preview Panel */}
        <div className={`w-full sm:w-1/2 h-full overflow-y-auto ${mobileTab === 'preview' ? 'block' : 'hidden sm:block'}`}>
          <PreviewContainer cvData={{ ...cvData, language: lang }} />
        </div>
      </div>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col justify-center items-center h-screen bg-slate-950 text-slate-500">
        <span className="animate-spin text-2xl mb-4">⌛</span>
        <span className="text-xs font-medium tracking-widest uppercase text-slate-400">Loading CV Builder...</span>
      </div>
    }>
      <BuilderContent />
    </Suspense>
  );
}
