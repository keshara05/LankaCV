'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { TRANSLATIONS } from '@/lib/translations';

function StatusChecker() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cvId = searchParams.get('id');

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchStatus = () => {
    if (!cvId) return;
    
    // Fetch all transactions and find the one matching cvId
    fetch('/api/transactions')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const match = data.find(tx => tx.cv_id === cvId);
          if (match) {
            setTransaction(match);
          } else {
            setErrorMsg('No payment transaction records found for this CV ID.');
          }
        } else {
          setErrorMsg('Failed to fetch transaction records.');
        }
      })
      .catch(() => setErrorMsg('Failed to check order status.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStatus();
    // Poll every 10 seconds for real-time status update
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, [cvId]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50 dark:bg-slate-950 text-slate-500">
        <span className="animate-spin text-2xl mb-4">⌛</span>
        <span className="text-xs font-medium tracking-widest uppercase text-slate-400">Loading status...</span>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="max-w-md mx-auto my-20 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center shadow-lg">
        <h2 className="text-xl font-bold text-rose-500 mb-2">Error</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">{errorMsg}</p>
        <button onClick={() => router.push('/')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold jelly-btn">
          Return to Builder
        </button>
      </div>
    );
  }

  const lang = transaction?.language || 'en';
  const t = TRANSLATIONS[lang];

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-250';
      case 'rejected': return 'text-rose-600 bg-rose-50 dark:bg-rose-950/20 border-rose-250';
      default: return 'text-amber-600 bg-amber-50 dark:bg-amber-950/20 border-amber-250';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return t.statusApproved;
      case 'rejected': return t.statusRejected;
      default: return t.statusPending;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-10 px-4 transition-colors duration-300">
      <div className="max-w-md w-full mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-md space-y-6 text-center jelly-card transition-colors duration-300">
        <div>
          <span className="text-3xl">🎉</span>
          <h1 className="text-lg font-black tracking-tight text-slate-800 dark:text-white uppercase mt-2">
            {t.statusTitle}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.statusSub}
          </p>
        </div>

        {/* Status indicator */}
        <div className={`p-4 rounded-xl border text-xs font-bold ${getStatusColor(transaction.status)}`}>
          {t.orderStatus}: {getStatusText(transaction.status)}
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-900 p-4 rounded-xl space-y-2 text-xs text-left transition-colors duration-300">
          <div className="flex justify-between">
            <span className="text-slate-400">{lang === 'si' ? 'CV හැඳුනුම් අංකය' : 'CV ID'}:</span>
            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{cvId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{lang === 'si' ? 'ගණුදෙනු අංකය' : 'Transaction ID'}:</span>
            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{transaction.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{lang === 'si' ? 'WhatsApp අංකය' : 'WhatsApp Contact'}:</span>
            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{transaction.whatsapp_number || 'Not provided'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{lang === 'si' ? 'ගෙවීම් ක්‍රමය' : 'Channel'}:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{transaction.bank_name}</span>
          </div>
        </div>

        {transaction.status === 'pending' && (
          <p className="text-[10px] text-slate-400 leading-relaxed">
            {t.statusHelper}
          </p>
        )}

        {transaction.status === 'approved' && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 rounded-lg text-emerald-800 dark:text-emerald-300 text-[10px] space-y-1">
            <p>{t.statusApprovedHelper}</p>
          </div>
        )}

        <button
          type="button"
          onClick={() => router.push('/')}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg transition-all jelly-btn"
        >
          {t.btnAnother}
        </button>
      </div>
    </div>
  );
}

export default function StatusPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col justify-center items-center h-screen bg-slate-950 text-slate-500">
        <span className="animate-spin text-2xl mb-4">⌛</span>
        <span className="text-xs font-medium tracking-widest uppercase text-slate-400">Loading status page...</span>
      </div>
    }>
      <StatusChecker />
    </Suspense>
  );
}
