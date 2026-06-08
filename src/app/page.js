'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TRANSLATIONS } from '@/lib/translations';

export default function LandingPage() {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const [darkMode, setDarkMode] = useState(true);

  // Initialize theme & language preferences
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = localStorage.getItem('darkMode') !== 'false'; // Dark mode default
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

  const startCv = () => {
    router.push(`/builder?lang=${lang}`);
  };

  const t = TRANSLATIONS[lang];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 selection:bg-indigo-500/35 relative overflow-hidden">
      
      {/* Background Glowing Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Navbar */}
      <header className="h-16 px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex justify-between items-center z-20 shadow-sm sticky top-0 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">
            {t.title}
          </span>
          <span className="hidden sm:inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-150 dark:border-indigo-900">
            {t.tagline}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-150 dark:border-indigo-900 rounded-lg text-xs font-extrabold jelly-btn"
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

          {/* Builder direct button */}
          <button
            type="button"
            onClick={startCv}
            className="hidden sm:block px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-lg shadow-md hover:shadow-lg transition-all jelly-btn"
          >
            {lang === 'si' ? 'CV එකක් සාදන්න ➔' : 'Create CV ➔'}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6 max-w-5xl mx-auto text-center space-y-8">
        
        {/* Special Pricing Badge overlay */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-950/30 border border-emerald-900/40 rounded-full text-xs font-bold text-emerald-400 shadow-sm animate-bounce mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{t.specialOffer}: </span>
          <span className="line-through text-slate-500 mr-1">{t.originalPrice}</span>
          <span className="text-emerald-300 font-black">{t.offerPrice}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight uppercase max-w-4xl mx-auto">
          {t.heroHeading}
        </h1>

        {/* Subtitle */}
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {t.heroSubheading}
        </p>

        {/* CTA Jelly Button */}
        <div className="pt-4 flex justify-center">
          <button
            type="button"
            onClick={startCv}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm md:text-base rounded-2xl shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/35 transition-all jelly-btn relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            {t.startBuilding}
          </button>
        </div>
      </section>

      {/* Steps / How It Works Section */}
      <section className="py-16 px-6 bg-white/40 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800 transition-colors duration-300 relative">
        <div className="max-w-5xl mx-auto space-y-12">
          <h2 className="text-xl md:text-2xl font-black text-center uppercase tracking-wider text-slate-800 dark:text-white">
            {t.howItWorks}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            {/* Step 1 */}
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-850 p-6 rounded-2xl shadow-sm jelly-card flex flex-col justify-between items-center space-y-4">
              <span className="text-3xl">✍️</span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-white">{t.step1}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{t.step1Desc}</p>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-850 p-6 rounded-2xl shadow-sm jelly-card flex flex-col justify-between items-center space-y-4">
              <span className="text-3xl">👁️</span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-white">{t.step2}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{t.step2Desc}</p>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-850 p-6 rounded-2xl shadow-sm jelly-card flex flex-col justify-between items-center space-y-4">
              <span className="text-3xl">📥</span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-white">{t.step3}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{t.step3Desc}</p>
            </div>

          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 max-w-5xl mx-auto space-y-12">
        <h2 className="text-xl md:text-2xl font-black text-center uppercase tracking-wider text-slate-800 dark:text-white">
          {lang === 'si' ? 'විශේෂ පහසුකම්' : 'Key Features'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur border border-slate-200 dark:border-slate-800 p-5 rounded-2xl jelly-card">
            <span className="text-2xl block mb-3">📍</span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white mb-2">{t.feature1Title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">{t.feature1Desc}</p>
          </div>

          <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur border border-slate-200 dark:border-slate-800 p-5 rounded-2xl jelly-card">
            <span className="text-2xl block mb-3">🎨</span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white mb-2">{t.feature2Title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">{t.feature2Desc}</p>
          </div>

          <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur border border-slate-200 dark:border-slate-800 p-5 rounded-2xl jelly-card">
            <span className="text-2xl block mb-3">💸</span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white mb-2">{t.feature3Title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">{t.feature3Desc}</p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-slate-200 dark:border-slate-800 text-center text-[10px] text-slate-500 max-w-5xl mx-auto">
        <p>© {new Date().getFullYear()} {t.title} (Pvt) Ltd. All Rights Reserved. WhatsApp Support: +94 78 923 2752</p>
        <p className="mt-1 opacity-70">Designed and built specifically for the Sri Lankan job vacancy market.</p>
      </footer>

    </div>
  );
}
