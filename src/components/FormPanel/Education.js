import React from 'react';
import { TRANSLATIONS } from '@/lib/translations';

const COMMON_OL_SUBJECTS = [
  'Mathematics', 'Science', 'English', 'Sinhala', 'History', 'Religion', 'Commerce', 'ICT', 'Art/Music/Drama'
];

const COMMON_AL_STREAMS = [
  'Physical Science (Combined Maths)',
  'Biological Science',
  'Commerce',
  'Arts',
  'Technology (ET/BST)'
];

const GRADES = ['A', 'B', 'C', 'S', 'W', 'F'];

export default function Education({ data, onChange, lang }) {
  const educationList = data.education || [];
  const t = TRANSLATIONS[lang || 'en'];

  const handleUpdate = (updatedList) => {
    onChange({ ...data, education: updatedList });
  };

  const addHigherEducation = () => {
    const newEntry = {
      id: Date.now().toString(),
      type: 'higher',
      degree: '',
      institution: '',
      year: '',
      grade: ''
    };
    handleUpdate([...educationList, newEntry]);
  };

  const addOLRecord = () => {
    const newEntry = {
      id: Date.now().toString(),
      type: 'ol',
      school: '',
      year: '',
      indexNumber: '',
      results: COMMON_OL_SUBJECTS.map(subj => ({ subject: subj, grade: 'A' }))
    };
    handleUpdate([...educationList, newEntry]);
  };

  const addALRecord = () => {
    const newEntry = {
      id: Date.now().toString(),
      type: 'al',
      school: '',
      year: '',
      indexNumber: '',
      stream: 'Physical Science (Combined Maths)',
      results: [
        { subject: 'Combined Mathematics', grade: 'A' },
        { subject: 'Physics', grade: 'A' },
        { subject: 'Chemistry', grade: 'A' },
        { subject: 'General English', grade: 'A' },
        { subject: 'Common General Test', grade: 'A' }
      ]
    };
    handleUpdate([...educationList, newEntry]);
  };

  const updateEntryField = (id, field, value) => {
    const list = educationList.map(entry => {
      if (entry.id === id) {
        return { ...entry, [field]: value };
      }
      return entry;
    });
    handleUpdate(list);
  };

  const updateResult = (id, resIdx, field, value) => {
    const list = educationList.map(entry => {
      if (entry.id === id) {
        const results = [...entry.results];
        results[resIdx] = { ...results[resIdx], [field]: value };
        return { ...entry, results };
      }
      return entry;
    });
    handleUpdate(list);
  };

  const addCustomResultRow = (id) => {
    const list = educationList.map(entry => {
      if (entry.id === id) {
        const results = [...(entry.results || []), { subject: '', grade: 'A' }];
        return { ...entry, results };
      }
      return entry;
    });
    handleUpdate(list);
  };

  const removeEntry = (id) => {
    handleUpdate(educationList.filter(entry => entry.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">2. {t.tabEducation}</h3>
        <div className="flex flex-wrap gap-1.5">
          <button 
            type="button" 
            onClick={addOLRecord}
            className="px-2 py-1 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold rounded shadow-sm border border-indigo-200 dark:border-indigo-900 jelly-btn"
          >
            {t.addOL}
          </button>
          <button 
            type="button" 
            onClick={addALRecord}
            className="px-2 py-1 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold rounded shadow-sm border border-indigo-200 dark:border-indigo-900 jelly-btn"
          >
            {t.addAL}
          </button>
          <button 
            type="button" 
            onClick={addHigherEducation}
            className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded shadow-sm jelly-btn"
          >
            {t.addDegree}
          </button>
        </div>
      </div>

      {educationList.length === 0 && (
        <p className="text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-900 p-4 rounded text-center border border-slate-100 dark:border-slate-800">
          {t.noEducation}
        </p>
      )}

      <div className="space-y-4">
        {educationList.map((edu) => {
          const isOL = edu.type === 'ol';
          const isAL = edu.type === 'al';
          const isExam = isOL || isAL;

          return (
            <div 
              key={edu.id} 
              className="border border-slate-200 dark:border-slate-800 p-4 rounded-lg bg-white dark:bg-slate-900 relative shadow-sm transition-colors duration-300"
            >
              <button
                type="button"
                onClick={() => removeEntry(edu.id)}
                className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 text-xs font-bold"
              >
                Delete
              </button>

              <div className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                {isOL ? 'G.C.E. Ordinary Level (O/L)' : isAL ? 'G.C.E. Advanced Level (A/L)' : 'Higher Education / Diploma'}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {isExam ? (
                  <>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">{t.schoolName}</label>
                      <input 
                        type="text" 
                        value={edu.school || ''}
                        onChange={(e) => updateEntryField(edu.id, 'school', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded text-xs" 
                        placeholder="e.g. Royal College, Colombo"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">{t.examYear}</label>
                      <input 
                        type="text" 
                        value={edu.year || ''}
                        onChange={(e) => updateEntryField(edu.id, 'year', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded text-xs font-mono" 
                        placeholder="e.g. 2018"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">{t.indexNumber}</label>
                      <input 
                        type="text" 
                        value={edu.indexNumber || ''}
                        onChange={(e) => updateEntryField(edu.id, 'indexNumber', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded text-xs font-mono" 
                        placeholder="e.g. 81234567"
                      />
                    </div>
                    {isAL && (
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1">{t.examStream}</label>
                        <select 
                          value={edu.stream || 'Physical Science (Combined Maths)'}
                          onChange={(e) => updateEntryField(edu.id, 'stream', e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded text-xs"
                        >
                          {COMMON_AL_STREAMS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">{t.degreeTitle}</label>
                      <input 
                        type="text" 
                        value={edu.degree || ''}
                        onChange={(e) => updateEntryField(edu.id, 'degree', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded text-xs font-semibold" 
                        placeholder="e.g. B.Sc. (Hons) in Computer Science"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">{t.gradYear}</label>
                      <input 
                        type="text" 
                        value={edu.year || ''}
                        onChange={(e) => updateEntryField(edu.id, 'year', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded text-xs font-mono" 
                        placeholder="e.g. 2023"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">{t.institution}</label>
                      <input 
                        type="text" 
                        value={edu.institution || ''}
                        onChange={(e) => updateEntryField(edu.id, 'institution', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded text-xs" 
                        placeholder="e.g. University of Moratuwa"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">{t.gpa}</label>
                      <input 
                        type="text" 
                        value={edu.grade || ''}
                        onChange={(e) => updateEntryField(edu.id, 'grade', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded text-xs" 
                        placeholder="e.g. First Class / GPA 3.75"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Subject Result Editor for O/L and A/L */}
              {isExam && edu.results && (
                <div className="mt-4 border-t border-slate-100 dark:border-slate-850 pt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{t.resultsTitle}</span>
                    <button
                      type="button"
                      onClick={() => addCustomResultRow(edu.id)}
                      className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                    >
                      {t.addSubject}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {edu.results.map((res, rIdx) => (
                      <div key={rIdx} className="flex gap-2 items-center bg-slate-50 dark:bg-slate-950 p-1.5 rounded border border-slate-100 dark:border-slate-900">
                        <input 
                          type="text" 
                          value={res.subject}
                          onChange={(e) => updateResult(edu.id, rIdx, 'subject', e.target.value)}
                          className="flex-1 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded text-[10px]"
                          placeholder="Subject Name"
                        />
                        <select 
                          value={res.grade}
                          onChange={(e) => updateResult(edu.id, rIdx, 'grade', e.target.value)}
                          className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded text-[10px] font-bold"
                        >
                          {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const newResults = edu.results.filter((_, idx) => idx !== rIdx);
                            updateEntryField(edu.id, 'results', newResults);
                          }}
                          className="text-rose-500 hover:text-rose-700 text-[9px] font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
