'use client';

import React, { useState, useEffect, useCallback } from 'react';

const STATUS_CONFIG = {
  pending:  { label: 'Pending',  bg: 'rgba(250, 238, 218, 0.4)', color: '#854F0B', dot: '#BA7517' },
  approved: { label: 'Approved', bg: 'rgba(225, 245, 238, 0.4)', color: '#085041', dot: '#0F6E56' },
  rejected: { label: 'Rejected', bg: 'rgba(252, 235, 235, 0.4)', color: '#791F1F', dot: '#A32D2D' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span 
      className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border text-xs capitalize tracking-wide select-none"
      style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.dot }}
    >
      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

export default function AdminPage() {
  // Authentication States
  const [authChecking, setAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Transactions States
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState('all');
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [updating, setUpdating]         = useState(null); // txId being updated

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/transactions');
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      const data = await res.json();
      if (!data.error) {
        setTransactions(data);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setAuthChecking(false);
    }
  }, []);

  // Check initial authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch('/api/admin/check');
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          await fetchTransactions();
        } else {
          setIsAuthenticated(false);
          setLoading(false);
          setAuthChecking(false);
        }
      } catch (err) {
        console.error(err);
        setIsAuthenticated(false);
        setLoading(false);
        setAuthChecking(false);
      }
    };
    checkAuthStatus();
  }, [fetchTransactions]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setUsername('');
        setPassword('');
        await fetchTransactions();
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginError('Something went wrong. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' });
      if (res.ok) {
        setIsAuthenticated(false);
        setTransactions([]);
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleStatusUpdate = async (txId, nextStatus) => {
    setUpdating(txId);
    try {
      const res = await fetch('/api/transactions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txId, status: nextStatus }),
      });
      if (res.ok) await fetchTransactions();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const handleExportPDF = (cvId, name) => {
    const filename = `${name.replace(/\s+/g, '_')}_CV.pdf`;
    window.open(`/api/export-pdf?cvId=${cvId}&filename=${encodeURIComponent(filename)}`, '_blank');
  };

  const filtered = filter === 'all'
    ? transactions
    : transactions.filter(tx => tx.status === filter);

  const counts = {
    all:      transactions.length,
    pending:  transactions.filter(t => t.status === 'pending').length,
    approved: transactions.filter(t => t.status === 'approved').length,
    rejected: transactions.filter(t => t.status === 'rejected').length,
  };

  // ─── Render Authentication Checking ───────────────────────────────────────────
  if (authChecking) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-55 dark:bg-slate-950 text-slate-500">
        <svg className="animate-spin text-2xl mb-4" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <circle cx="12" cy="12" r="10" strokeDasharray="30 30" strokeLinecap="round" />
        </svg>
        <span className="text-xs font-medium tracking-widest uppercase text-slate-405">Verifying administrator session…</span>
      </div>
    );
  }

  // ─── Render Login Screen ───────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 bg-grid-pattern relative overflow-hidden select-none">
        {/* Glow backgrounds */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md glass-card border border-slate-805 rounded-3xl p-8 shadow-2xl flex flex-col items-center z-10 animate-fade-in-up relative">
          <div className="w-14 h-14 rounded-2xl bg-indigo-950/40 border border-indigo-900/40 flex items-center justify-center mb-5 text-2xl font-black">
            🔑
          </div>
          <h1 className="text-xl font-black text-white mb-1 tracking-tight text-center uppercase">Secure Admin Portal</h1>
          <p className="text-xs text-slate-400 mb-6 text-center">Please sign in to manage transactions</p>

          {loginError && (
            <div className="w-full bg-rose-950/20 border border-rose-900/40 rounded-xl p-3 text-rose-450 flex items-center gap-2 mb-4 animate-pulse">
              <span className="text-xs font-bold">⚠️ {loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="w-full space-y-4">
            <div className="space-y-1 text-left">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full px-3 py-2 border border-slate-800 bg-slate-955 text-white rounded-xl text-xs outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="block text-[10px] font-bold text-slate-505 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter security password"
                className="w-full px-3 py-2 border border-slate-800 bg-slate-955 text-white rounded-xl text-xs outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all jelly-btn disabled:opacity-50 mt-2"
            >
              {loginLoading ? 'Verifying credentials…' : 'Access Dashboard →'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Render Dashboard ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-55 dark:bg-slate-950 text-slate-500">
        <svg className="animate-spin text-2xl mb-4" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <circle cx="12" cy="12" r="10" strokeDasharray="30 30" strokeLinecap="round" />
        </svg>
        <span className="text-xs font-medium tracking-widest uppercase text-slate-400">Loading admin portal…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-55 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 bg-grid-pattern relative pb-12">
      
      {/* Top Navbar */}
      <div className="sticky top-4 z-40 px-4 w-full max-w-7xl mx-auto pt-4 animate-fade-in-up">
        <header className="h-16 px-6 glass-nav rounded-2xl flex justify-between items-center shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/20">
              🛡️
            </div>
            <div>
              <div className="text-xs font-black tracking-tight text-slate-800 dark:text-white uppercase leading-none">LankaCV Admin</div>
              <div className="text-[9px] text-slate-450 dark:text-slate-500 mt-1 uppercase font-bold leading-none">Manage transfers · Export clean PDFs</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="px-3 py-1.5 bg-slate-105 dark:bg-slate-800 text-slate-700 dark:text-slate-350 border border-slate-200 dark:border-slate-700/60 rounded-xl text-xs font-bold jelly-btn"
              onClick={fetchTransactions}
            >
              ↺ Refresh
            </button>
            <button
              className="px-3 py-1.5 bg-rose-50 dark:bg-rose-955/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900 rounded-xl text-xs font-black jelly-btn"
              onClick={handleLogout}
            >
              🔒 Logout
            </button>
          </div>
        </header>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 animate-fade-in-up delay-100">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm jelly-card">
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Total Transactions</div>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{counts.all}</div>
          </div>
          <div className="glass-card border border-slate-205 dark:border-slate-800 p-5 rounded-2xl shadow-sm jelly-card">
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Pending Review</div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{counts.pending}</div>
          </div>
          <div className="glass-card border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm jelly-card">
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Approved</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-450">{counts.approved}</div>
          </div>
          <div className="glass-card border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm jelly-card">
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Rejected</div>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-455">{counts.rejected}</div>
          </div>
        </div>

        {/* Transactions Table Card */}
        <div className="glass-card border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800/80 flex flex-wrap justify-between items-center gap-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-350">Payment Transactions</h2>
            
            {/* Filter Tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/50 dark:border-slate-850">
              {['all', 'pending', 'approved', 'rejected'].map(f => {
                const isActive = filter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3.5 py-1 text-[10px] font-bold uppercase rounded-lg transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-white dark:bg-slate-850 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                    }`}
                  >
                    {f} ({counts[f]})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-wider text-slate-400">Tx ID</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-wider text-slate-400">User details</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-wider text-slate-400">Payment info</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-wider text-slate-400">Receipt</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-wider text-slate-400">Status</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-wider text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 bg-white/30 dark:bg-slate-900/10">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400 font-semibold text-xs">
                      No transactions found.
                    </td>
                  </tr>
                ) : filtered.map((tx) => (
                  <tr
                    key={tx.id}
                    className={`transition-colors duration-200 hover:bg-slate-50/40 dark:hover:bg-slate-900/30 ${
                      updating === tx.id ? 'opacity-60 bg-slate-50/20' : ''
                    }`}
                  >
                    {/* Tx ID */}
                    <td className="px-6 py-4 align-middle">
                      <span className="font-mono font-bold text-xs text-indigo-650 dark:text-indigo-400">#{tx.id}</span>
                    </td>

                    {/* User Details */}
                    <td className="px-6 py-4 align-middle">
                      <div className="text-xs font-black text-slate-850 dark:text-slate-200">{tx.full_name}</div>
                      <div className="text-[10px] text-slate-450 dark:text-slate-450 mt-0.5">{tx.email}</div>
                      <div className="inline-block mt-1.5 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-[8px] font-bold font-mono text-slate-550">
                        CV: {tx.cv_id}
                      </div>
                    </td>

                    {/* Payment Info */}
                    <td className="px-6 py-4 align-middle">
                      <div className="text-xs font-bold text-slate-705 dark:text-slate-350">{tx.bank_name}</div>
                      {tx.whatsapp_number && (
                        <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">WhatsApp: {tx.whatsapp_number}</div>
                      )}
                      <div className="text-[9px] text-slate-400 mt-1 font-semibold">
                        {new Date(tx.created_at).toLocaleString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </div>
                    </td>

                    {/* Slip */}
                    <td className="px-6 py-4 align-middle">
                      {tx.payment_slip ? (
                        <button 
                          onClick={() => setSelectedSlip(tx.payment_slip)}
                          className="px-3 py-1.5 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-[10px] font-bold jelly-btn hover:border-indigo-500"
                        >
                          🧾 View slip
                        </button>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-700">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 align-middle">
                      <StatusBadge status={tx.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-2">
                        {tx.status === 'pending' && (
                          <>
                            <button
                              disabled={updating === tx.id}
                              onClick={() => handleStatusUpdate(tx.id, 'approved')}
                              className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold text-sm flex items-center justify-center jelly-btn"
                              title="Approve"
                            >✓</button>
                            <button
                              disabled={updating === tx.id}
                              onClick={() => handleStatusUpdate(tx.id, 'rejected')}
                              className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-955/20 border border-rose-250 hover:bg-rose-105 dark:hover:bg-rose-955/40 text-rose-700 dark:text-rose-455 font-bold text-sm flex items-center justify-center jelly-btn"
                              title="Reject"
                            >✕</button>
                          </>
                        )}
                        <button
                          onClick={() => handleExportPDF(tx.cv_id, tx.full_name)}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[10px] rounded-xl shadow shadow-indigo-650/10 hover:shadow-lg transition-all jelly-btn"
                        >
                          ↓ Export PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Slip Modal */}
      {selectedSlip && (
        <div 
          onClick={() => setSelectedSlip(null)} 
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-up"
          >
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <span className="text-xs font-black uppercase text-slate-800 dark:text-white">Payment receipt</span>
              <button 
                onClick={() => setSelectedSlip(null)} 
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 flex items-center justify-center text-slate-550 border border-slate-200/50 dark:border-slate-700/50 text-sm jelly-btn"
              >×</button>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-955/60 border-b border-slate-200 dark:border-slate-800 flex justify-center items-center min-h-[300px]">
              {selectedSlip.startsWith('data:application/pdf') ? (
                <div className="text-slate-400 font-bold text-xs">
                  📄 PDF receipt uploaded.
                </div>
              ) : (
                <img
                  src={selectedSlip}
                  alt="Payment receipt"
                  className="max-w-full max-h-[50vh] object-contain rounded-2xl shadow-lg border border-slate-200/40"
                />
              )}
            </div>
            <div className="px-6 py-4 flex justify-end gap-2">
              <a
                href={selectedSlip}
                download="payment_slip"
                className="px-4 py-2 border border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-350 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-850 transition jelly-btn"
              >
                ↓ Download
              </a>
              <button
                onClick={() => setSelectedSlip(null)}
                className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-black jelly-btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}