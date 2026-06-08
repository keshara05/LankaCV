import React, { useState } from 'react';
import PersonalInfo from './PersonalInfo';
import Education from './Education';
import Experience from './Experience';
import Skills from './Skills';
import References from './References';
import { TRANSLATIONS } from '@/lib/translations';

export default function FormContainer({ cvData, onChange, lang }) {
  const [activeTab, setActiveTab] = useState('personal');
  const t = TRANSLATIONS[lang || 'en'];

  const tabs = [
    { id: 'personal', name: t.tabPersonal },
    { id: 'education', name: t.tabEducation },
    { id: 'experience', name: t.tabExperience },
    { id: 'skills', name: t.tabSkills },
    { id: 'references', name: t.tabReferences }
  ];

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalInfo data={cvData} onChange={onChange} lang={lang} />;
      case 'education':
        return <Education data={cvData} onChange={onChange} lang={lang} />;
      case 'experience':
        return <Experience data={cvData} onChange={onChange} lang={lang} />;
      case 'skills':
        return <Skills data={cvData} onChange={onChange} lang={lang} />;
      case 'references':
        return <References data={cvData} onChange={onChange} lang={lang} />;
      default:
        return null;
    }
  };

  const getTabIndex = (tabId) => tabs.findIndex(t => t.id === tabId);

  const handleNext = () => {
    const currentIndex = getTabIndex(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    const currentIndex = getTabIndex(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Tabs list */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto scrollbar-none sticky top-0 z-10 px-4 py-2 gap-1 transition-colors duration-300">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Dynamic Form Content */}
      <div className="flex-1 p-5 overflow-y-auto max-w-3xl mx-auto w-full">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm transition-colors duration-300">
          {renderActiveTabContent()}
        </div>
      </div>

      {/* Nav Buttons Footer */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex justify-between items-center sticky bottom-0 z-10 transition-colors duration-300">
        <button
          type="button"
          onClick={handlePrev}
          disabled={activeTab === tabs[0].id}
          className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-50 disabled:cursor-not-allowed jelly-btn"
        >
          {t.prev}
        </button>
        
        <span className="text-[10px] font-semibold text-slate-400">
          {t.step} {getTabIndex(activeTab) + 1} {t.of} {tabs.length}
        </span>

        {activeTab !== tabs[tabs.length - 1].id ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold jelly-btn"
          >
            {t.next}
          </button>
        ) : (
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/40 px-3 py-2 rounded-lg border border-indigo-150 dark:border-indigo-900">
            {t.finishMessage}
          </span>
        )}
      </div>
    </div>
  );
}
