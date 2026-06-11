'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TRANSLATIONS } from '@/lib/translations';

// Interactive, CSS-animated CV Mockup Component with 3D Tilt Effect
function CvMockup({ lang }) {
  const [hoveredSection, setHoveredSection] = useState(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, shineX: 50, shineY: 50 });

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    
    // Calculate rotation (-10 to 10 degrees)
    const rotateX = -((y - box.height / 2) / (box.height / 2)) * 12;
    const rotateY = ((x - box.width / 2) / (box.width / 2)) * 12;
    
    // Calculate shine position
    const shineX = (x / box.width) * 100;
    const shineY = (y / box.height) * 100;
    
    setTilt({ rotateX, rotateY, shineX, shineY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, shineX: 50, shineY: 50 });
  };

  const t = {
    en: {
      name: "Keshara Ranasinghe",
      title: "Senior Software Engineer",
      email: "keshara@example.com",
      phone: "+94 77 123 4567",
      nic: "199512345678 (Verified NIC)",
      education: "Education (G.C.E. O/L & A/L)",
      ol: "G.C.E. O/L - Royal College",
      al: "G.C.E. A/L - Royal College",
      maths: "Combined Mathematics",
      physics: "Physics",
      chemistry: "Chemistry",
      english: "English",
      science: "Science",
      history: "History",
      experience: "Work Experience",
      exp1: "Tech Lead @ Sysco LABS",
      exp1Desc: "Led team of 5 engineers to build high-scale cloud apps.",
      skills: "Skills",
      skillsList: ["React", "Next.js", "Node.js", "SQL"],
      ref: "References",
      signature: "Applicant's Signature",
      sigLine: "......................................",
      dateLine: "Date: 2026/06/09",
      tooltipHeader: "Professional Details & Profile Picture support",
      tooltipEdu: "Dedicated tables for O/L & A/L results in Sri Lankan format!",
      tooltipExp: "Chronological work history with clear bullet points.",
      tooltipNic: "Civil status, NIC, and local requirements included.",
      tooltipSig: "Signature blocks and date lines for formal applications."
    },
    si: {
      name: "කේෂර රණසිංහ",
      title: "ජ්‍යෙෂ්ඨ මෘදුකාංග ඉංජිනේරු",
      email: "keshara@example.com",
      phone: "+94 77 123 4567",
      nic: "199512345678 (තහවුරු කළ NIC)",
      education: "අධ්‍යාපන සුදුසුකම් (G.C.E. O/L & A/L)",
      ol: "G.C.E. O/L - කොළඹ රාජකීය විද්‍යාලය",
      al: "G.C.E. A/L - කොළඹ රාජකීය විද්‍යාලය",
      maths: "සංයුක්ත ගණිතය",
      physics: "භෞතික විද්‍යාව",
      chemistry: "රසායන විද්‍යාව",
      english: "ඉංග්‍රීසි",
      science: "විද්‍යාව",
      history: "ඉතිහාසය",
      experience: "රැකියා පළපුරුද්ද",
      exp1: "Tech Lead @ Sysco LABS",
      exp1Desc: "මෘදුකාංග ඉංජිනේරුවන් 5 දෙනෙකුගෙන් යුත් කණ්ඩායමක් මෙහෙයවීම.",
      skills: "දක්ෂතා (Skills)",
      skillsList: ["React", "Next.js", "Node.js", "SQL"],
      ref: "නිර්දේශ කරන්නන්",
      signature: "අයදුම්කරුගේ අත්සන",
      sigLine: "......................................",
      dateLine: "දිනය: 2026/06/09",
      tooltipHeader: "වෘත්තීය විස්තර සහ පැහැදිලි ඡායාරූප ඇතුළත් කිරීමේ හැකියාව",
      tooltipEdu: "O/L සහ A/L ප්‍රතිඵල වගු ලංකාවේ ක්‍රමයටම ඇතුළත් කළ හැක!",
      tooltipExp: "රැකියා පළපුරුද්ද පිළිවෙළට සහ පැහැදිලිව සැකසීමේ හැකියාව.",
      tooltipNic: "සිවිල් තත්ත්වය, NIC සහ ලංකාවේ රැකියාවලට අත්‍යවශ්‍ය විස්තර.",
      tooltipSig: "අත්සන තැබීමට විශේෂ ඉඩක් සහ දින සටහන් ඇතුළත් වේ."
    }
  }[lang];

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(1.02)`,
        transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)',
        transformStyle: 'preserve-3d'
      }}
      className="relative group/mockup max-w-md mx-auto w-full cursor-pointer animate-float-jelly"
    >
      {/* Background glow shadow effect */}
      <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500/20 to-emerald-500/25 rounded-3xl blur-2xl opacity-75 group-hover/mockup:opacity-100 transition duration-500"></div>

      {/* Shine overlay */}
      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none z-30 opacity-0 group-hover/mockup:opacity-25 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${tilt.shineX}% ${tilt.shineY}%, rgba(255, 255, 255, 0.85) 0%, transparent 60%)`,
        }}
      />

      {/* CV Sheet Container */}
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-2xl p-6 md:p-7 text-left text-[10px] md:text-[11px] text-slate-700 dark:text-slate-350 transition-colors duration-300">
        {/* Pulsing Live Draft Indicator */}
        <div className="absolute top-4 right-4 z-40 flex items-center gap-1 px-1.5 py-0.5 bg-slate-900/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-[7px] font-extrabold tracking-wider text-slate-500 dark:text-slate-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          {lang === 'si' ? 'සජීවී පෙරදසුන' : 'LIVE PREVIEW'}
        </div>
        
        {/* CV Header */}
        <div 
          onMouseEnter={() => setHoveredSection('header')}
          onMouseLeave={() => setHoveredSection(null)}
          className={`flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800/80 cursor-help transition-all duration-300 rounded-lg p-1 ${hoveredSection === 'header' ? 'bg-indigo-500/5 dark:bg-indigo-500/10 ring-1 ring-indigo-500/30 scale-[1.01]' : ''}`}
        >
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-white text-sm md:text-base font-black shadow-inner">
            KR
          </div>
          <div className="flex-1 space-y-0.5">
            <h4 className="text-[11px] md:text-[12px] font-black text-slate-900 dark:text-white leading-none uppercase tracking-tight">{t.name}</h4>
            <p className="text-[8px] md:text-[9px] text-indigo-600 dark:text-indigo-400 font-extrabold leading-none">{t.title}</p>
            <div className="flex flex-wrap gap-x-2 text-[7px] text-slate-400">
              <span>✉ {t.email}</span>
              <span>📞 {t.phone}</span>
            </div>
          </div>

          {hoveredSection === 'header' && (
            <div className="absolute -top-10 right-0 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold px-2 py-1 rounded-lg shadow-xl text-[8px] md:text-[9px] z-30 animate-fade-in whitespace-nowrap border border-slate-850 dark:border-slate-100">
              💡 {t.tooltipHeader}
            </div>
          )}
        </div>

        {/* NIC & Personal Info */}
        <div 
          onMouseEnter={() => setHoveredSection('nic')}
          onMouseLeave={() => setHoveredSection(null)}
          className={`mt-3 grid grid-cols-2 gap-2 cursor-help transition-all duration-300 rounded-lg p-1 ${hoveredSection === 'nic' ? 'bg-indigo-500/5 dark:bg-indigo-500/10 ring-1 ring-indigo-500/30 scale-[1.01]' : ''}`}
        >
          <div>
            <span className="text-slate-400 dark:text-slate-500 block font-bold uppercase text-[6px]">NIC Number</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200">{t.nic}</span>
          </div>
          <div>
            <span className="text-slate-400 dark:text-slate-500 block font-bold uppercase text-[6px]">Status / Nationality</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200">Single / Sri Lankan</span>
          </div>

          {hoveredSection === 'nic' && (
            <div className="absolute -top-10 right-0 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold px-2 py-1 rounded-lg shadow-xl text-[8px] md:text-[9px] z-30 animate-fade-in whitespace-nowrap border border-slate-850 dark:border-slate-100">
              💡 {t.tooltipNic}
            </div>
          )}
        </div>

        {/* Education (Sri Lankan Table formats) */}
        <div 
          onMouseEnter={() => setHoveredSection('education')}
          onMouseLeave={() => setHoveredSection(null)}
          className={`mt-3 cursor-help transition-all duration-300 rounded-lg p-1 ${hoveredSection === 'education' ? 'bg-indigo-500/5 dark:bg-indigo-500/10 ring-1 ring-indigo-500/30 scale-[1.01]' : ''}`}
        >
          <h5 className="font-black text-slate-900 dark:text-white border-b border-indigo-500/20 pb-0.5 mb-1 uppercase tracking-wider text-[7px] md:text-[8px]">{t.education}</h5>
          
          <div className="space-y-1.5">
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-[8px] leading-tight">{t.al} <span className="text-slate-400 font-normal">(2014)</span></p>
              {/* Table */}
              <table className="w-full mt-1 border-collapse border border-slate-200 dark:border-slate-800">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 text-[6px] text-slate-400 font-bold uppercase text-left">
                    <th className="border border-slate-200 dark:border-slate-800 p-0.5 px-1.5">Subject</th>
                    <th className="border border-slate-200 dark:border-slate-800 p-0.5 text-center w-10">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-slate-600 dark:text-slate-400">
                    <td className="border border-slate-200 dark:border-slate-800 p-0.5 px-1.5">{t.maths}</td>
                    <td className="border border-slate-200 dark:border-slate-800 p-0.5 text-center font-black text-indigo-600 dark:text-indigo-400">A</td>
                  </tr>
                  <tr className="text-slate-600 dark:text-slate-400">
                    <td className="border border-slate-200 dark:border-slate-800 p-0.5 px-1.5">{t.physics}</td>
                    <td className="border border-slate-200 dark:border-slate-800 p-0.5 text-center font-black text-indigo-600 dark:text-indigo-400">A</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-[8px] leading-tight">{t.ol} <span className="text-slate-400 font-normal">(2011)</span></p>
              <div className="flex gap-1.5 mt-0.5">
                <span className="px-1 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-extrabold border border-indigo-150 dark:border-indigo-900/40 rounded text-[7px]">Maths: A</span>
                <span className="px-1 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-extrabold border border-indigo-150 dark:border-indigo-900/40 rounded text-[7px]">Science: A</span>
                <span className="px-1 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-extrabold border border-indigo-150 dark:border-indigo-900/40 rounded text-[7px]">English: A</span>
              </div>
            </div>
          </div>

          {hoveredSection === 'education' && (
            <div className="absolute top-[20%] right-0 bg-emerald-600 text-white font-extrabold px-2 py-1 rounded-lg shadow-xl text-[8px] md:text-[9px] z-30 animate-fade-in whitespace-nowrap">
              💡 {t.tooltipEdu}
            </div>
          )}
        </div>

        {/* Experience */}
        <div 
          onMouseEnter={() => setHoveredSection('experience')}
          onMouseLeave={() => setHoveredSection(null)}
          className={`mt-3 cursor-help transition-all duration-300 rounded-lg p-1 ${hoveredSection === 'experience' ? 'bg-indigo-500/5 dark:bg-indigo-500/10 ring-1 ring-indigo-500/30 scale-[1.01]' : ''}`}
        >
          <h5 className="font-black text-slate-900 dark:text-white border-b border-indigo-500/20 pb-0.5 mb-1 uppercase tracking-wider text-[7px] md:text-[8px]">{t.experience}</h5>
          
          <div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-850 dark:text-slate-200">{t.exp1}</span>
              <span className="text-[6.5px] text-slate-400">2021 - Present</span>
            </div>
            <p className="text-[7.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{t.exp1Desc}</p>
          </div>

          {hoveredSection === 'experience' && (
            <div className="absolute bottom-[20%] right-0 bg-indigo-600 text-white font-extrabold px-2 py-1 rounded-lg shadow-xl text-[8px] md:text-[9px] z-30 animate-fade-in whitespace-nowrap">
              💡 {t.tooltipExp}
            </div>
          )}
        </div>

        {/* Signature Box */}
        <div 
          onMouseEnter={() => setHoveredSection('signature')}
          onMouseLeave={() => setHoveredSection(null)}
          className={`mt-3 pt-2.5 border-t border-dashed border-slate-250 dark:border-slate-800/80 cursor-help transition-all duration-300 rounded-lg p-1 flex justify-between items-end ${hoveredSection === 'signature' ? 'bg-indigo-500/5 dark:bg-indigo-500/10 ring-1 ring-indigo-500/30 scale-[1.01]' : ''}`}
        >
          <div className="space-y-0.5">
            <span className="text-slate-450 dark:text-slate-500 block text-[6px] uppercase font-bold">{t.signature}</span>
            <span className="text-slate-300 dark:text-slate-700 font-mono tracking-widest leading-none block">{t.sigLine}</span>
          </div>
          <div className="text-right leading-none">
            <span className="text-[7.5px] font-bold text-slate-450 dark:text-slate-500">{t.dateLine}</span>
          </div>

          {hoveredSection === 'signature' && (
            <div className="absolute -bottom-6 right-0 bg-emerald-600 text-white font-extrabold px-2 py-1 rounded-lg shadow-xl text-[8px] md:text-[9px] z-30 animate-fade-in whitespace-nowrap">
              💡 {t.tooltipSig}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// Custom Animated Pricing Badge Component
function AnimatedPricingBadge({ t }) {
  return (
    <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-white/70 dark:bg-slate-900/50 backdrop-blur border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 select-none animate-float-subtle">
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[9px] md:text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          {t.specialOffer}
        </span>
      </div>
      
      <div className="h-4 w-px bg-slate-200 dark:bg-slate-800"></div>

      <div className="flex items-center gap-2">
        {/* Slashed original price (dynamically strikes through) */}
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 animate-strike-through">
          {t.originalPrice}
        </span>
        
        <span className="text-[10px] text-slate-400 font-extrabold">➔</span>

        {/* Glow pulsing sale price */}
        <span className="px-2.5 py-1 bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md animate-glow-green border border-emerald-400">
          {t.offerPrice}
        </span>
      </div>

      <span className="hidden sm:inline-block text-[8px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/40 px-2 py-0.5 rounded-lg">
        SAVE 37%
      </span>
    </div>
  );
}

// Interactive Template Card Component
function TemplateCard({ id, name, category, description, defaultColor, lang, onSelect }) {
  return (
    <div 
      onClick={() => onSelect(id)}
      className="group rounded-3xl p-7 shadow-sm hover:shadow-2xl border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/40 dark:hover:border-indigo-400/40 transition-all duration-500 cursor-pointer flex flex-col justify-between h-full hover:-translate-y-2.5 relative overflow-hidden glass-card jelly-card animate-fade-in-up"
    >
      <div className="absolute top-0 left-0 w-full h-2 transition-all duration-500 group-hover:h-3" style={{ backgroundColor: defaultColor }}></div>

      <div>
        <div className="flex items-center justify-between mb-5">
          <span className="text-[10px] font-black uppercase px-3 py-1 bg-slate-100/90 dark:bg-slate-800/90 text-slate-500 dark:text-slate-400 rounded-full border border-slate-200/60 dark:border-slate-700/60">
            {category}
          </span>
          <span className="w-3 h-3 rounded-full animate-pulse shadow-md" style={{ backgroundColor: defaultColor }}></span>
        </div>

        <h4 className="text-base font-black text-slate-900 dark:text-white uppercase group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors">
          {name}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed min-h-[40px]">
          {description}
        </p>

        {/* Premium Layout Schema Representation */}
        <div className="w-full h-32 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl mt-6 p-3.5 flex gap-2.5 relative overflow-hidden transition-all duration-500 group-hover:border-indigo-500/30 group-hover:shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          
          <div className="w-full h-full flex gap-2.5 transition-transform duration-500 group-hover:scale-[1.04]">
            {id === '3' ? (
              /* Sidebar layout style representation */
              <>
                <div className="w-1/3 h-full rounded bg-indigo-500/10 dark:bg-indigo-500/5 border-r border-indigo-500/10 flex flex-col gap-2 p-1.5">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/30 shadow-inner"></div>
                  <div className="w-full h-1.5 bg-indigo-500/20 rounded"></div>
                  <div className="w-4/5 h-1.5 bg-indigo-500/20 rounded"></div>
                  <div className="flex gap-1 mt-1">
                    <div className="w-3 h-2 rounded-sm bg-indigo-500/30"></div>
                    <div className="w-3 h-2 rounded-sm bg-indigo-500/30"></div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-2 p-1.5">
                  <div className="w-2/3 h-2.5 bg-slate-300 dark:bg-slate-700 rounded"></div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  <div className="w-5/6 h-1.5 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  <div className="w-1/2 h-2 bg-slate-350 dark:bg-slate-755 rounded mt-1"></div>
                </div>
              </>
            ) : id === '2' ? (
              /* Government layout style representation */
              <div className="w-full flex flex-col gap-2 justify-between h-full p-1.5">
                <div className="space-y-1.5">
                  <div className="w-1/2 h-3 bg-slate-300 dark:bg-slate-700 rounded mx-auto"></div>
                  <div className="w-full h-0.5 bg-slate-250 dark:bg-slate-800"></div>
                </div>
                <div className="space-y-1.5">
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
                <div className="flex justify-between items-end mt-1">
                  <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  <div className="w-16 h-5 border border-dashed border-slate-300 dark:border-slate-750 rounded flex items-center justify-center text-[6px] font-bold text-slate-400">Signature</div>
                </div>
              </div>
            ) : (
              /* Minimalist standard layout representation */
              <div className="w-full flex flex-col gap-2 p-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs shadow-inner">👤</div>
                  <div className="flex-1 space-y-1.5">
                    <div className="w-1/2 h-2 bg-slate-300 dark:bg-slate-700 rounded"></div>
                    <div className="w-1/3 h-1.5 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  </div>
                </div>
                <div className="w-full h-0.5 bg-slate-200 dark:bg-slate-800 mt-1"></div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="w-3/4 h-1.5 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-850 pt-4">
        <span className="text-xs font-black text-indigo-650 dark:text-indigo-400 uppercase tracking-wider group-hover:translate-x-2 transition-transform flex items-center gap-1">
          {lang === 'si' ? 'මෙම Template එකෙන් හදන්න' : 'Use Template'} ➔
        </span>
      </div>
    </div>
  );
}

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

export default function LandingPage() {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const [darkMode, setDarkMode] = useState(true);

  // Initialize theme & language preferences
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = localStorage.getItem('darkMode') !== 'false';
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

  const selectTemplate = (templateId) => {
    router.push(`/builder?template=${templateId}&lang=${lang}`);
  };

  const t = TRANSLATIONS[lang];

  const getHighlightedHeading = () => {
    if (lang === 'si') {
      return {
        __html: t.heroHeading
          .replace("ලංකාවේ රැකියාවලට", '<span class="bg-gradient-to-r from-indigo-650 via-indigo-500 to-purple-500 dark:from-indigo-400 dark:via-indigo-300 dark:to-indigo-200 bg-clip-text text-transparent">ලංකාවේ රැකියාවලට</span>')
          .replace("වෘත්තීය CV එකක්", '<span class="bg-gradient-to-r from-emerald-600 via-emerald-550 to-indigo-500 dark:from-emerald-400 dark:via-emerald-350 dark:to-indigo-300 bg-clip-text text-transparent font-black">වෘත්තීය CV එකක්</span>')
      };
    } else {
      return {
        __html: t.heroHeading
          .replace("Professional CV", '<span class="bg-gradient-to-r from-indigo-650 via-indigo-550 to-purple-650 dark:from-indigo-400 dark:via-indigo-300 dark:to-indigo-200 bg-clip-text text-transparent">Professional CV</span>')
          .replace("Sri Lankan Jobs", '<span class="bg-gradient-to-r from-emerald-600 via-emerald-550 to-indigo-500 dark:from-emerald-400 dark:via-emerald-350 dark:to-indigo-300 bg-clip-text text-transparent font-black">Sri Lankan Jobs</span>')
      };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 selection:bg-indigo-500/35 relative overflow-hidden bg-grid-pattern">
      
      {/* Background Glowing Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/15 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-rotate-slow"></div>
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none animate-rotate-slow-reverse"></div>
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none animate-rotate-slow"></div>

      {/* Floating Glass Navbar */}
      <div className="sticky top-4 z-50 px-4 w-full max-w-6xl mx-auto animate-fade-in-up">
        <header className="h-16 px-6 glass-nav rounded-2xl flex justify-between items-center shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-indigo-400 dark:from-indigo-400 dark:to-indigo-300 bg-clip-text text-transparent">
              {t.title}
            </span>
            <span className="hidden sm:inline-block text-[9px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100/50 dark:border-indigo-900/40">
              {t.tagline}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-150 dark:border-indigo-900/50 rounded-lg text-xs font-black jelly-btn"
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
              <span className="inline-block transition-transform duration-500 hover:rotate-45">
                {darkMode ? '☀️' : '🌙'}
              </span>
            </button>

            {/* Builder direct button */}
            <button
              type="button"
              onClick={startCv}
              className="hidden sm:block px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-extrabold text-xs rounded-lg shadow-md hover:shadow-lg transition-all jelly-btn"
            >
              {lang === 'si' ? 'CV එකක් සාදන්න ➔' : 'Create CV ➔'}
            </button>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-6 max-w-6xl mx-auto z-10 animate-fade-in-up delay-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6 flex flex-col items-center lg:items-start">
            
            {/* Custom pricing badge */}
            <AnimatedPricingBadge t={t} />

            {/* Title */}
            <h1 
              className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-tight uppercase max-w-3xl"
              dangerouslySetInnerHTML={getHighlightedHeading()}
            />

            {/* Subtitle */}
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              {t.heroSubheading}
            </p>

            {/* CTA Jelly Button */}
            <div className="pt-4 flex flex-wrap gap-4 justify-center lg:justify-start w-full">
              <button
                type="button"
                onClick={startCv}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-black text-sm md:text-base rounded-2xl shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/35 transition-all jelly-btn relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                {t.startBuilding}
              </button>
              
              <a 
                href="#templates"
                className="px-6 py-4 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-extrabold text-sm md:text-base rounded-2xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-850 transition-all jelly-btn flex items-center justify-center"
              >
                {lang === 'si' ? 'Templates බලන්න 👁️' : 'Browse Templates 👁️'}
              </a>
            </div>
          </div>

          {/* Right Interactive Mockup Column */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <CvMockup lang={lang} />
          </div>

        </div>
      </section>

      {/* Template Showcase Section */}
      <section id="templates" className="py-20 px-6 max-w-6xl mx-auto space-y-12 z-10 relative">
        <div className="text-center space-y-4">
          <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-widest bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-full">
            {lang === 'si' ? 'CV ආකෘති' : 'LankaCV Layouts'}
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            {lang === 'si' ? 'ඔබට කැමති Template එකකින් ආරම්භ කරන්න' : 'Start with a Template Built for Success'}
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            {lang === 'si' 
              ? 'අපගේ templates දේශීය HR ප්‍රමිතීන්ට අනුව සකසා ඇත. ඔබට අවශ්‍ය template එක ක්ලික් කර එතැන් සිට CV එක ලිවීම ආරම්භ කරන්න.'
              : 'Choose one of our premium templates styled perfectly for corporate, IT, banking, or government sector applications in Sri Lanka.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          <TemplateCard 
            id="1"
            name={lang === 'si' ? 'Minimalist Standard' : 'Minimalist Standard'}
            category={lang === 'si' ? 'පොදු / Corporate' : 'General / Corporate'}
            description={lang === 'si' ? 'සරල සහ වෘත්තීය නිමාවක්. ඕනෑම රැකියාවකට සුදුසුයි.' : 'Clean, simple, and formal layout suitable for almost any job role.'}
            defaultColor="#1e3a8a"
            lang={lang}
            onSelect={selectTemplate}
          />
          <TemplateCard 
            id="2"
            name={lang === 'si' ? 'රාජ්‍ය අංශයේ නිල ආකෘතිය' : 'Official Government Format'}
            category={lang === 'si' ? 'රාජ්‍ය / සිවිල් අංශ' : 'Government / Banking'}
            description={lang === 'si' ? 'ලංකාවේ රාජ්‍ය අංශයේ ප්‍රමිතිවලට අනුව NIC, Civil Status සහ අත්සන් කිරීමේ කොටස් සහිතයි.' : 'Strict official format featuring signature blocks, NIC details, and civil status required for state sectors.'}
            defaultColor="#0f172a"
            lang={lang}
            onSelect={selectTemplate}
          />
          <TemplateCard 
            id="3"
            name={lang === 'si' ? 'නවීන IT / තාක්ෂණික' : 'Modern IT / Engineering'}
            category={lang === 'si' ? 'IT / Engineering' : 'IT & Engineering'}
            description={lang === 'si' ? 'තාක්ෂණික කුසලතා, sidebar එකක් සහ project විස්තර ලස්සනට පෙන්වීමට සකසන ලද්දකි.' : 'Sleek two-column layout with sidebar and technology tags designed to highlight technical roles.'}
            defaultColor="#4f46e5"
            lang={lang}
            onSelect={selectTemplate}
          />
        </div>
      </section>

      {/* Steps / How It Works Section */}
      <section className="py-20 px-6 bg-white/40 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800/80 transition-colors duration-300 relative z-10">
        <div className="max-w-5xl mx-auto space-y-12">
          <h2 className="text-2xl md:text-4xl font-black text-center uppercase tracking-wider text-slate-800 dark:text-white">
            {t.howItWorks}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-850 p-8 rounded-3xl shadow-sm jelly-card flex flex-col items-center text-center space-y-4 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl font-black group-hover:scale-110 transition-transform">
                ✍️
              </div>
              <h3 className="text-sm md:text-base font-black uppercase tracking-wider text-slate-800 dark:text-white">{t.step1}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{t.step1Desc}</p>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-850 p-8 rounded-3xl shadow-sm jelly-card flex flex-col items-center text-center space-y-4 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl font-black group-hover:scale-110 transition-transform">
                👁️
              </div>
              <h3 className="text-sm md:text-base font-black uppercase tracking-wider text-slate-800 dark:text-white">{t.step2}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{t.step2Desc}</p>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-850 p-8 rounded-3xl shadow-sm jelly-card flex flex-col items-center text-center space-y-4 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl font-black group-hover:scale-110 transition-transform">
                📥
              </div>
              <h3 className="text-sm md:text-base font-black uppercase tracking-wider text-slate-800 dark:text-white">{t.step3}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{t.step3Desc}</p>
            </div>

          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 max-w-5xl mx-auto space-y-12 z-10 relative">
        <h2 className="text-xl md:text-3xl font-black text-center uppercase tracking-wider text-slate-800 dark:text-white">
          {lang === 'si' ? 'විශේෂ පහසුකම්' : 'Key Features'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur border border-slate-200 dark:border-slate-800/80 p-6 rounded-3xl jelly-card">
            <span className="text-3xl block mb-4">📍</span>
            <h4 className="text-xs md:text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white mb-2">{t.feature1Title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">{t.feature1Desc}</p>
          </div>

          <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur border border-slate-200 dark:border-slate-800/80 p-6 rounded-3xl jelly-card">
            <span className="text-3xl block mb-4">🎨</span>
            <h4 className="text-xs md:text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white mb-2">{t.feature2Title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">{t.feature2Desc}</p>
          </div>

          <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur border border-slate-200 dark:border-slate-800/80 p-6 rounded-3xl jelly-card">
            <span className="text-3xl block mb-4">💸</span>
            <h4 className="text-xs md:text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white mb-2">{t.feature3Title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">{t.feature3Desc}</p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 text-center text-[10px] md:text-xs text-slate-500 max-w-5xl mx-auto px-6 space-y-2">
        <p>© {new Date().getFullYear()} {t.title} (Pvt) Ltd. All Rights Reserved. WhatsApp Support: +94 78 923 2752</p>
        <p className="opacity-75">Designed and built specifically for the Sri Lankan job vacancy market.</p>
      </footer>

      {/* Draft Recovery Toast */}
      <DraftRecoveryToast lang={lang} />

    </div>
  );
}
