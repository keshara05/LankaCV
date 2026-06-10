'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { TRANSLATIONS } from '@/lib/translations';
import { getTemplateHtml } from '@/components/PreviewPanel/templates';

function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cvId = searchParams.get('id');

  const [cvData, setCvData] = useState(null);
  const [bankName, setBankName] = useState('Bank of Ceylon (BOC)');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [slipBase64, setSlipBase64] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'acc') {
      setCopiedAcc(true);
      setTimeout(() => setCopiedAcc(false), 2000);
    } else {
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  // Fetch CV data to confirm it exists
  useEffect(() => {
    if (cvId) {
      fetch(`/api/cv?id=${cvId}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setCvData(data);
          } else {
            setErrorMsg('Invalid CV reference. Please construct your CV first.');
          }
        })
        .catch(() => setErrorMsg('Failed to fetch CV details.'));
    }
  }, [cvId]);

  const handleSlipUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File is too large. Maximum slip file size is 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!slipBase64) {
      alert(lang === 'si' ? 'කරුණාකර ඉදිරියට යාමට පෙර ඔබගේ රිසිට්පත ඇතුළත් කරන්න.' : 'Please upload your payment slip receipt before proceeding.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvId,
          bankName,
          paymentSlip: slipBase64,
          whatsappNumber
        })
      });

      if (response.ok) {
        router.push(`/status?id=${cvId}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to submit payment slip. Please check your connection.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppLink = () => {
    const adminPhone = '94789232752'; // Admin WhatsApp number: 0789232752
    const text = encodeURIComponent(
      `Hi Admin! I have made the bank transfer for my CV.\n\n*Reference ID:* ${cvId}\n*Name:* ${cvData?.fullName || ''}\n*Email:* ${cvData?.email || ''}\n\nI am sending my transfer slip receipt. Please verify and send my clean high-res PDF CV.`
    );
    return `https://api.whatsapp.com/send?phone=${adminPhone}&text=${text}`;
  };

  const lang = cvData?.language || 'en';
  const t = TRANSLATIONS[lang];

  if (errorMsg) {
    return (
      <div className="max-w-md mx-auto my-20 p-6 bg-slate-905/65 backdrop-blur-xl border border-slate-800 rounded-2xl text-center shadow-2xl animate-fade-in-up">
        <h2 className="text-xl font-bold text-rose-500 mb-2">Error</h2>
        <p className="text-slate-400 mb-6">{errorMsg}</p>
        <button 
          onClick={() => router.push('/')} 
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold jelly-btn"
        >
          Return to Builder
        </button>
      </div>
    );
  }

  if (!cvData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-950 text-slate-500">
        <span className="animate-spin text-2xl mb-4">⌛</span>
        <span className="text-xs font-medium tracking-widest uppercase text-slate-400">Loading secure checkout...</span>
      </div>
    );
  }

  // Generate the A4 preview HTML string
  const blurredCvHtml = getTemplateHtml(cvData.templateId || '1', cvData);

  return (
    <div className="min-h-screen bg-slate-55 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 selection:bg-indigo-500/30 transition-colors duration-300 bg-grid-pattern relative">
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10 animate-fade-in-up">
        
        {/* Page Header */}
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-150 dark:border-indigo-900 px-3 py-1 rounded-full">
            LankaCV Checkout
          </span>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-800 dark:text-white uppercase">
            {t.checkoutTitle}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            {lang === 'si' 
              ? 'ඔබේ CV පත්‍රිකාව සාර්ථකව සුරකින ලදී. පිරිසිදු, watermark රහිත high-res PDF එක ලබා ගැනීමට ගෙවීම් සිදුකරන්න.'
              : 'Your CV is successfully saved! Complete the payment and upload the slip to download the watermark-free high-res PDF.'
            }
          </p>
        </div>

        {/* 3-Column Workspace Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Column 1: Bank Transfer Details */}
          <div className="glass-card border border-slate-200 dark:border-slate-800/80 p-6 rounded-3xl shadow-xl flex flex-col justify-between jelly-card transition-colors duration-300">
            <div className="space-y-5">
              <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-350">{t.checkoutTitle}</h2>
                  <p className="text-[9px] text-slate-500 mt-0.5">{t.checkoutSub}</p>
                </div>
                {/* Special Price Badge */}
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 line-through block">{t.originalPrice}</span>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-150 dark:border-emerald-900/50 px-2 py-0.5 rounded-md block mt-0.5 animate-pulse">
                    {t.offerPrice}
                  </span>
                  <span className="text-[8px] text-emerald-600 dark:text-emerald-400 font-bold tracking-wider uppercase block mt-0.5">{t.specialOffer}</span>
                </div>
              </div>

              {/* Account Details Box */}
              <div className="space-y-3.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-850 p-4.5 rounded-2xl text-xs font-medium transition-colors duration-300">
                <div className="grid grid-cols-3 items-center">
                  <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 col-span-1">{t.bank}</span>
                  <span className="text-slate-800 dark:text-slate-200 col-span-2 font-bold">Bank of Ceylon (BOC)</span>
                </div>
                <div className="grid grid-cols-3 items-center">
                  <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 col-span-1">{t.branch}</span>
                  <span className="text-slate-800 dark:text-slate-200 col-span-2 font-bold">Dehiattakandiya</span>
                </div>
                <div className="grid grid-cols-3 items-center">
                  <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 col-span-1">{t.accName}</span>
                  <span className="text-slate-800 dark:text-slate-200 col-span-2 font-bold">M R K M Rathnayaka</span>
                </div>
                
                {/* Account Number with copy button and pop confirmation */}
                <div className="grid grid-cols-3 items-center cursor-pointer relative group" onClick={() => copyToClipboard('94360792', 'acc')}>
                  <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 col-span-1">{t.accNo}</span>
                  <span className="text-indigo-650 dark:text-indigo-400 col-span-2 font-bold font-mono tracking-wider text-[13px] hover:underline flex items-center gap-1.5 transition-colors">
                    94360792 <span className="text-[10px] opacity-60">📋</span>
                  </span>
                  {copiedAcc && (
                    <span className="absolute -top-7 right-4 bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded-lg shadow-md text-[9px] animate-fade-in z-50">
                      ✓ Copied
                    </span>
                  )}
                </div>
                
                <div className="pt-3 border-t border-slate-200 dark:border-slate-850 space-y-1">
                  <span className="block text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">{t.refId}</span>
                  <div 
                    onClick={() => copyToClipboard(cvId, 'ref')}
                    className="flex justify-between items-center bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-150 dark:border-indigo-900/40 p-2 rounded-lg cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition relative"
                  >
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tracking-widest text-xs flex items-center gap-1.5">
                      {cvId} <span className="text-[10px] opacity-60">📋</span>
                    </span>
                    {copiedRef && (
                      <span className="absolute -top-8 right-2 bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded-lg shadow-md text-[9px] animate-fade-in z-50">
                        ✓ Copied
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Note box */}
            <div className="p-3 bg-amber-50 dark:bg-amber-955/20 border border-amber-250 dark:border-amber-900/40 rounded-xl text-[9px] text-amber-700 dark:text-amber-300 mt-4 leading-relaxed">
              ⚠️ {t.checkoutWarning}
            </div>
          </div>

          {/* Column 2: Upload Slip Form */}
          <div className="glass-card border border-slate-200 dark:border-slate-800/80 p-6 rounded-3xl shadow-xl flex flex-col justify-between jelly-card transition-colors duration-300">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-350 border-b border-slate-200 dark:border-slate-800 pb-3">
                {t.uploadSlip}
              </h2>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{t.uploadChannel}</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 transition"
                >
                  <option value="Bank of Ceylon (BOC)">Bank of Ceylon (BOC)</option>
                  <option value="Commercial Bank">Commercial Bank</option>
                  <option value="Sampath Bank">Sampath Bank</option>
                  <option value="HNB">HNB</option>
                  <option value="People's Bank">People's Bank</option>
                  <option value="LankaPay / Online App">LankaPay / Online App</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{t.uploadPhone}</label>
                <input 
                  type="text"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-mono rounded-xl text-xs outline-none focus:border-indigo-500 transition"
                  placeholder="e.g. 0789232752"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{t.uploadFile}</label>
                <div className="border border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500/60 bg-slate-50 dark:bg-slate-950/60 rounded-xl p-3 text-center cursor-pointer transition">
                  <input 
                    type="file"
                    required
                    accept="image/*,application/pdf"
                    onChange={handleSlipUpload}
                    className="block w-full text-xs text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-[9px] file:font-extrabold file:bg-indigo-50 dark:file:bg-indigo-950 file:text-indigo-700 dark:file:text-indigo-300 hover:file:bg-indigo-100 transition"
                  />
                </div>
              </div>

              {slipBase64 && (
                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-150 dark:border-emerald-900/40 p-2 rounded-xl flex items-center justify-between text-[9px] text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
                  <span>{t.slipSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all jelly-btn disabled:opacity-50"
              >
                {isSubmitting ? t.saving : t.btnSubmitSlip}
              </button>
            </form>

            {/* Premium WhatsApp Button */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-3 mt-4 flex flex-col items-center">
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">{t.whatsappOr}</span>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/15 hover:shadow-emerald-600/35 transition-all jelly-btn-emerald relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                💬 {t.whatsappBtn}
              </a>
            </div>
          </div>

          {/* Column 3: Blurred Locked CV Sheet Preview */}
          <div className="glass-card border border-slate-200 dark:border-slate-800/80 p-6 rounded-3xl shadow-xl flex flex-col items-center relative overflow-hidden jelly-card transition-colors duration-300">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-350 border-b border-slate-200 dark:border-slate-800 pb-3 w-full text-center">
              {lang === 'si' ? 'CV පෙරදසුන (අගුළු දමා ඇත)' : 'CV Preview (Locked)'}
            </h2>

            {/* Locked Content Warning overlay */}
            <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-[7px] z-30 flex flex-col items-center justify-center p-6 text-center select-none">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-500 animate-bobbing shadow-lg shadow-amber-500/10 text-xl">
                🔒
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider text-white bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg shadow">
                {lang === 'si' ? 'ගෙවීම් තහවුරු වන තෙක් අගුළු දමා ඇත' : 'Locked - Payment Pending'}
              </h3>
              <p className="text-[9px] text-slate-300 mt-2 max-w-[180px] leading-relaxed drop-shadow">
                {lang === 'si' 
                  ? 'ගෙවීම් රිසිට්පත තහවුරු කිරීමෙන් පසු අගුළු හැර පිරිසිදු high-res PDF එක ඔබට ලැබෙනු ඇත.'
                  : 'Once the admin verifies the transfer slip, you will receive the clean, unlocked PDF.'
                }
              </p>
            </div>

            {/* Scale A4 sheet to fit inside checkout box */}
            <div className="w-full mt-4 flex justify-center items-start origin-top scale-[0.6] md:scale-[0.55] lg:scale-[0.6] opacity-60">
              <div 
                className="relative w-[210mm] min-h-[297mm] bg-white text-slate-800 border border-slate-200 shadow-lg pointer-events-none select-none overflow-hidden"
                dangerouslySetInnerHTML={{ __html: blurredCvHtml }}
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col justify-center items-center h-screen bg-slate-950 text-slate-500">
        <span className="animate-spin text-2xl mb-4">⌛</span>
        <span className="text-xs font-medium tracking-widest uppercase text-slate-400">Loading secure checkout...</span>
      </div>
    }>
      <CheckoutForm />
    </Suspense>
  );
}
