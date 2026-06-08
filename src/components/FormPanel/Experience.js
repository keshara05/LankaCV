import React from 'react';
import { TRANSLATIONS } from '@/lib/translations';

export default function Experience({ data, onChange, lang }) {
  const experienceList = data.experience || [];
  const t = TRANSLATIONS[lang || 'en'];

  const handleUpdate = (updatedList) => {
    onChange({ ...data, experience: updatedList });
  };

  const addExperience = () => {
    const newEntry = {
      id: Date.now().toString(),
      company: '',
      role: '',
      duration: '',
      description: ''
    };
    handleUpdate([...experienceList, newEntry]);
  };

  const updateEntryField = (id, field, value) => {
    const list = experienceList.map(entry => {
      if (entry.id === id) {
        return { ...entry, [field]: value };
      }
      return entry;
    });
    handleUpdate(list);
  };

  const removeEntry = (id) => {
    handleUpdate(experienceList.filter(entry => entry.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">3. {t.tabExperience}</h3>
        <button 
          type="button" 
          onClick={addExperience}
          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded shadow-sm jelly-btn"
        >
          {t.addExp}
        </button>
      </div>

      {experienceList.length === 0 && (
        <p className="text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-900 p-4 rounded text-center border border-slate-100 dark:border-slate-800">
          {t.noExperience}
        </p>
      )}

      <div className="space-y-4">
        {experienceList.map((exp) => (
          <div 
            key={exp.id} 
            className="border border-slate-200 dark:border-slate-800 p-4 rounded-lg bg-white dark:bg-slate-900 relative shadow-sm transition-colors duration-300"
          >
            <button
              type="button"
              onClick={() => removeEntry(exp.id)}
              className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 text-xs font-bold"
            >
              Delete
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">{t.company}</label>
                <input 
                  type="text" 
                  value={exp.company || ''}
                  onChange={(e) => updateEntryField(exp.id, 'company', e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded text-xs font-semibold" 
                  placeholder="e.g. John Keells Holdings"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">{t.role}</label>
                <input 
                  type="text" 
                  value={exp.role || ''}
                  onChange={(e) => updateEntryField(exp.id, 'role', e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded text-xs" 
                  placeholder="e.g. Associate Software Engineer"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">{t.duration}</label>
                <input 
                  type="text" 
                  value={exp.duration || ''}
                  onChange={(e) => updateEntryField(exp.id, 'duration', e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded text-xs font-mono" 
                  placeholder="e.g. Jan 2024 - Present"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">{t.achievements}</label>
                <textarea 
                  value={exp.description || ''}
                  onChange={(e) => updateEntryField(exp.id, 'description', e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded text-xs h-20 resize-none" 
                  placeholder="Describe your responsibilities, achievements..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
