import React, { useState } from 'react';
import { TRANSLATIONS } from '@/lib/translations';

const SUGGESTED_SKILLS = [
  'JavaScript', 'React', 'Next.js', 'Node.js', 'Tailwind CSS', 'SQL', 'Git',
  'Microsoft Office', 'Communication', 'Teamwork', 'Problem Solving', 'Data Entry',
  'Financial Analysis', 'Accounting', 'Customer Service', 'Report Writing'
];

export default function Skills({ data, onChange, lang }) {
  const skillsList = data.skills || [];
  const [inputValue, setInputValue] = useState('');
  const t = TRANSLATIONS[lang || 'en'];

  const handleUpdate = (updatedList) => {
    onChange({ ...data, skills: updatedList });
  };

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !skillsList.includes(trimmed)) {
      handleUpdate([...skillsList, trimmed]);
    }
    setInputValue('');
  };

  const removeSkill = (skillToRemove) => {
    handleUpdate(skillsList.filter(s => s !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(inputValue);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">4. {t.tabSkills}</h3>
      
      <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-lg bg-white dark:bg-slate-900 shadow-sm space-y-4 transition-colors duration-300">
        {/* Input box */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 mb-1">{t.addSkill}</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded text-xs outline-none focus:ring-1 focus:ring-indigo-500" 
              placeholder={t.skillPlaceholder}
            />
            <button
              type="button"
              onClick={() => addSkill(inputValue)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded jelly-btn"
            >
              {t.addBtn}
            </button>
          </div>
        </div>

        {/* Selected skills list */}
        {skillsList.length > 0 ? (
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase">{t.mySkills} ({skillsList.length})</label>
            <div className="flex flex-wrap gap-2">
              {skillsList.map((skill, idx) => (
                <span 
                  key={idx} 
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-755 dark:text-indigo-300 border border-indigo-150 dark:border-indigo-900 rounded-lg text-xs font-medium"
                >
                  {skill}
                  <button 
                    type="button" 
                    onClick={() => removeSkill(skill)}
                    className="text-indigo-400 hover:text-rose-500 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-[10px] text-slate-400 italic">No skills added yet.</p>
        )}

        {/* Suggestions list */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">{t.suggestions}</label>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_SKILLS.filter(s => !skillsList.includes(s)).map((skill, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => addSkill(skill)}
                className="px-2 py-0.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-650 dark:text-slate-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:border-indigo-200 rounded text-[10px] transition-colors jelly-btn"
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
