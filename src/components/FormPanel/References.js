import React from 'react';
import { TRANSLATIONS } from '@/lib/translations';

export default function References({ data, onChange, lang }) {
  const referencesList = data.references || [];
  const t = TRANSLATIONS[lang || 'en'];

  const handleUpdate = (updatedList) => {
    onChange({ ...data, references: updatedList });
  };

  const addReference = () => {
    const newEntry = {
      id: Date.now().toString(),
      name: '',
      designation: '',
      company: '',
      phone: '',
      email: ''
    };
    handleUpdate([...referencesList, newEntry]);
  };

  const updateEntryField = (id, field, value) => {
    const list = referencesList.map(entry => {
      if (entry.id === id) {
        return { ...entry, [field]: value };
      }
      return entry;
    });
    handleUpdate(list);
  };

  const removeEntry = (id) => {
    handleUpdate(referencesList.filter(entry => entry.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">5. {t.tabReferences}</h3>
        <button 
          type="button" 
          onClick={addReference}
          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded shadow-sm jelly-btn"
          disabled={referencesList.length >= 2}
          title={referencesList.length >= 2 ? "A typical professional CV should have maximum 2 references" : ""}
        >
          {t.addRef} ({referencesList.length}/2)
        </button>
      </div>

      {referencesList.length === 0 && (
        <p className="text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-900 p-4 rounded text-center border border-slate-100 dark:border-slate-800">
          {t.noReferences}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {referencesList.map((ref) => (
          <div 
            key={ref.id} 
            className="border border-slate-200 dark:border-slate-800 p-4 rounded-lg bg-white dark:bg-slate-900 relative shadow-sm transition-colors duration-300"
          >
            <button
              type="button"
              onClick={() => removeEntry(ref.id)}
              className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 text-xs font-bold"
            >
              Delete
            </button>

            <div className="space-y-2 mt-2">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">{t.refName}</label>
                <input 
                  type="text" 
                  value={ref.name || ''}
                  onChange={(e) => updateEntryField(ref.id, 'name', e.target.value)}
                  className="w-full px-2 py-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded text-xs font-semibold" 
                  placeholder="e.g. Prof. Rohan Silva"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">{t.refDesignation}</label>
                <input 
                  type="text" 
                  value={ref.designation || ''}
                  onChange={(e) => updateEntryField(ref.id, 'designation', e.target.value)}
                  className="w-full px-2 py-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded text-xs" 
                  placeholder="e.g. Senior Lecturer"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">{t.refCompany}</label>
                <input 
                  type="text" 
                  value={ref.company || ''}
                  onChange={(e) => updateEntryField(ref.id, 'company', e.target.value)}
                  className="w-full px-2 py-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded text-xs" 
                  placeholder="e.g. University of Colombo"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">{t.refPhone}</label>
                <input 
                  type="text" 
                  value={ref.phone || ''}
                  onChange={(e) => updateEntryField(ref.id, 'phone', e.target.value)}
                  className="w-full px-2 py-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded text-xs font-mono" 
                  placeholder="e.g. +94 77 987 6543"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">{t.refEmail}</label>
                <input 
                  type="email" 
                  value={ref.email || ''}
                  onChange={(e) => updateEntryField(ref.id, 'email', e.target.value)}
                  className="w-full px-2 py-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded text-xs" 
                  placeholder="e.g. rohan.silva@uoc.lk"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
