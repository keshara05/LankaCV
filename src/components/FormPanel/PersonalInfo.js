import React from 'react';
import { TRANSLATIONS } from '@/lib/translations';

export default function PersonalInfo({ data, onChange, lang }) {
  const t = TRANSLATIONS[lang || 'en'];

  const handleFieldChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleFieldChange('profilePhoto', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">1. {t.tabPersonal}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t.fullName}</label>
          <input 
            type="text" 
            value={data.fullName || ''}
            onChange={(e) => handleFieldChange('fullName', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-xs" 
            placeholder="e.g. Kamal Perera"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t.nicNumber}</label>
          <input 
            type="text" 
            value={data.nicNumber || ''}
            onChange={(e) => handleFieldChange('nicNumber', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-xs" 
            placeholder="e.g. 199512345678 or 951234567V"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t.email}</label>
          <input 
            type="email" 
            value={data.email || ''}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-xs" 
            placeholder="e.g. kamal@gmail.com"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t.phone}</label>
          <input 
            type="text" 
            value={data.phone || ''}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-mono" 
            placeholder="e.g. +94 77 123 4567"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t.dob}</label>
          <input 
            type="date" 
            value={data.dob || ''}
            onChange={(e) => handleFieldChange('dob', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-mono" 
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t.gender}</label>
          <select 
            value={data.gender || 'Male'}
            onChange={(e) => handleFieldChange('gender', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-xs"
          >
            <option value="Male">{t.male}</option>
            <option value="Female">{t.female}</option>
            <option value="Other">{t.other}</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t.civilStatus}</label>
          <select 
            value={data.civilStatus || 'Single'}
            onChange={(e) => handleFieldChange('civilStatus', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-xs"
          >
            <option value="Single">{t.single}</option>
            <option value="Married">{t.married}</option>
            <option value="Divorced">{t.divorced}</option>
            <option value="Widowed">{t.widowed}</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t.nationality}</label>
          <input 
            type="text" 
            value={data.nationality || 'Sri Lankan'}
            onChange={(e) => handleFieldChange('nationality', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-xs" 
            placeholder="e.g. Sri Lankan"
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t.address}</label>
          <textarea 
            value={data.address || ''}
            onChange={(e) => handleFieldChange('address', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-xs h-16 resize-none" 
            placeholder="e.g. 123, Galle Road, Colombo 03"
          />
        </div>

        <div className="col-span-1 md:col-span-2 grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t.linkedin}</label>
            <input 
              type="text" 
              value={data.linkedinUrl || ''}
              onChange={(e) => handleFieldChange('linkedinUrl', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-xs" 
              placeholder="linkedin.com/in/..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t.github}</label>
            <input 
              type="text" 
              value={data.githubUrl || ''}
              onChange={(e) => handleFieldChange('githubUrl', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-xs" 
              placeholder="github.com/..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t.website}</label>
            <input 
              type="text" 
              value={data.websiteUrl || ''}
              onChange={(e) => handleFieldChange('websiteUrl', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-xs" 
              placeholder="mywebsite.com"
            />
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t.photo}</label>
          <div className="flex items-center gap-4">
            {data.profilePhoto && (
              <img src={data.profilePhoto} alt="Profile preview" className="w-12 h-12 object-cover rounded-lg border border-slate-350 dark:border-slate-700 shadow-sm" />
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={handlePhotoUpload}
              className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-950 file:text-indigo-700 dark:file:text-indigo-300 hover:file:bg-indigo-100"
            />
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t.summary}</label>
          <textarea 
            value={data.summary || ''}
            onChange={(e) => handleFieldChange('summary', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-xs h-20" 
            placeholder="Briefly state your career objectives and background..."
          />
        </div>
      </div>
    </div>
  );
}
