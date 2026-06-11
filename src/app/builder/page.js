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

function DraftRecoveryToast({ lang }) {
  const [visible, setVisible] = useState(false);
  const [recentId, setRecentId] = useState('');
  const [recentName, setRecentName] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem('recentCvId');
      const storedName = localStorage.getItem('recentCvName');
      const dismissed = localStorage.getItem('recentCvDismissed') === 'true';
      
      if (storedId && !dismissed) {
        setRecentId(storedId);
        setRecentName(storedName || 'Guest');
        setVisible(true);
      }
    }
  }, []);

  const handleDismiss = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('recentCvDismissed', 'true');
    }
    setVisible(false);
  };

  const copyRefId = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(recentId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!visible) return null;

  const t = TRANSLATIONS[lang || 'en'];
  const descText = t.recoveryDesc.replace('{name}', recentName);

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl border border-indigo-500/30 dark:border-indigo-500/20 rounded-2xl shadow-2xl p-4.5 animate-fade-in-up flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
            {t.recoveryTitle}
          </h4>
        </div>
        <button 
          onClick={handleDismiss}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
        >
          ✕
        </button>
      </div>

      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
        {descText}
      </p>

      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-850 p-2 rounded-xl text-[10px] font-mono tracking-wider font-bold">
        <span className="text-slate-400 dark:text-slate-500 text-[8px] uppercase font-sans">Ref ID:</span>
        <div className="flex items-center gap-1.5 cursor-pointer relative" onClick={copyRefId}>
          <span className="text-indigo-650 dark:text-indigo-400">{recentId}</span>
          <span className="text-[10px] opacity-60">📋</span>
          {copied && (
            <span className="absolute -top-7 right-0 bg-emerald-600 text-white font-extrabold px-1.5 py-0.5 rounded text-[8px] whitespace-nowrap animate-fade-in">
              ✓ Copied
            </span>
          )}
        </div>
      </div>

      <a
        href={`/checkout?id=${recentId}`}
        className="w-full inline-flex items-center justify-center gap-1.5 py-2 bg-indigo-650 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all text-center jelly-btn"
      >
        {t.recoveryAction}
      </a>
    </div>
  );
}

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
        if (typeof window !== 'undefined') {
          localStorage.setItem('recentCvId', cvId);
          localStorage.setItem('recentCvName', cvData.fullName || 'Guest');
          localStorage.removeItem('recentCvDismissed');
        }
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
      
      {/* Floating Glass Navbar */}
      <div className="sticky top-0 z-50 px-4 pt-4 w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <header className="h-16 px-6 glass-nav rounded-2xl flex justify-between items-center shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
            <span className="text-lg font-black tracking-tight text-indigo-600 dark:text-indigo-400 hover:scale-[1.03] transition-transform">
              {t.title}
            </span>
            <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100/30 dark:border-indigo-900/40">
              {t.tagline}
            </span>
          </div>

          {/* Builder Toolbar Options */}
          <div className="flex items-center gap-3">
            
            {/* Template Selector */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Template:</span>
              <select
                value={cvData.templateId}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="px-2 py-1.5 border border-slate-200 dark:border-slate-805 bg-white dark:bg-slate-900 rounded-lg text-xs font-bold focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              >
                {TEMPLATES.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Color Customizer */}
            <div className="hidden lg:flex items-center gap-2 px-2 py-1 bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/80 rounded-xl">
              {THEME_COLORS.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setCvData({ ...cvData, themeColor: color.hex })}
                  className={`w-4 h-4 rounded-full border transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-75 ${cvData.themeColor === color.hex ? 'scale-125 border-slate-900 dark:border-white shadow-md' : 'border-transparent hover:scale-110'}`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>

            {/* Language Selector Button */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-900 rounded-lg text-xs font-extrabold jelly-btn"
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
              <span className="inline-block transition-transform duration-550 hover:rotate-45">
                {darkMode ? '☀️' : '🌙'}
              </span>
            </button>

            {/* Checkout Button */}
            <button
              type="button"
              onClick={handleSaveAndCheckout}
              disabled={isSaving}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-1 jelly-btn-emerald"
            >
              {isSaving ? t.saving : t.finishBtn}
            </button>
          </div>
        </header>
      </div>

      {/* Mobile Toolbar Option Bar */}
      <div className="md:hidden flex justify-between items-center px-6 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300 mt-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400">Template:</span>
          <select
            value={cvData.templateId}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="px-2 py-1 border border-slate-250 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg text-[10px] font-bold"
          >
            {TEMPLATES.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          {THEME_COLORS.slice(0, 5).map((color) => (
            <button
              key={color.name}
              type="button"
              onClick={() => setCvData({ ...cvData, themeColor: color.hex })}
              className={`w-4 h-4 rounded-full border transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-75 ${cvData.themeColor === color.hex ? 'border-slate-950 dark:border-white scale-125 shadow-sm' : 'border-transparent hover:scale-110'}`}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>

      {/* Mobile Screen Switch Tabs */}
      <div className="sm:hidden flex border-b border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 transition-colors duration-300">
        <button
          onClick={() => setMobileTab('edit')}
          className={`flex-1 py-3 text-center text-xs font-extrabold tracking-wider uppercase transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            mobileTab === 'edit' 
              ? 'border-b-3 border-indigo-600 text-indigo-600 bg-slate-50/50 dark:bg-slate-950/20' 
              : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-950/20'
          }`}
        >
          ✍️ {lang === 'si' ? 'විස්තර ලියන්න' : 'Edit details'}
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-3 text-center text-xs font-extrabold tracking-wider uppercase transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            mobileTab === 'preview' 
              ? 'border-b-3 border-indigo-600 text-indigo-600 bg-slate-50/50 dark:bg-slate-950/20' 
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

      {/* Draft Recovery Toast */}
      <DraftRecoveryToast lang={lang} />
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
