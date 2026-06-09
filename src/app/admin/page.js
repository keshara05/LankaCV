'use client';

import React, { useState, useEffect, useCallback } from 'react';

const STATUS_CONFIG = {
  pending:  { label: 'Pending',  bg: '#FAEEDA', color: '#854F0B', dot: '#BA7517' },
  approved: { label: 'Approved', bg: '#E1F5EE', color: '#085041', dot: '#0F6E56' },
  rejected: { label: 'Rejected', bg: '#FCEBEB', color: '#791F1F', dot: '#A32D2D' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 10, fontWeight: 600, padding: '3px 9px',
      borderRadius: 20, background: cfg.bg, color: cfg.color,
      border: `0.5px solid ${cfg.dot}`, textTransform: 'capitalize',
      letterSpacing: '0.03em',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: '#F8F9FB', borderRadius: 10, padding: '14px 16px',
      border: '0.5px solid #E5E7EB', flex: 1, minWidth: 0,
    }}>
      <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600, color }}>{value}</div>
    </div>
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
      const res  = await fetch('/api/transactions');
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

  // ─── Styles ──────────────────────────────────────────────────────────────────

  const s = {
    // Auth Styles
    loginPage: {
      minHeight: '100vh',
      background: 'radial-gradient(circle at top right, #1e293b, #0f172a, #020617)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    loginBgPattern: {
      position: 'absolute',
      width: '600px',
      height: '600px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(30, 58, 138, 0) 70%)',
      top: '-150px',
      right: '-150px',
      pointerEvents: 'none',
      zIndex: 1,
    },
    loginCard: {
      background: 'rgba(30, 41, 59, 0.45)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: 24,
      width: '100%',
      maxWidth: 400,
      padding: '40px 32px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    loginLogoContainer: {
      width: 56,
      height: 56,
      borderRadius: 16,
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(30, 58, 138, 0.15) 100%)',
      border: '1px solid rgba(59, 130, 246, 0.25)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    loginLogo: {
      width: 40,
      height: 40,
      borderRadius: 12,
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)',
    },
    loginTitle: {
      fontSize: 20,
      fontWeight: 700,
      color: '#fff',
      margin: '0 0 6px 0',
      textAlign: 'center',
      letterSpacing: '-0.01em',
    },
    loginSubtitle: {
      fontSize: 13,
      color: '#94a3b8',
      margin: '0 0 28px 0',
      textAlign: 'center',
    },
    loginErrorCard: {
      width: '100%',
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.25)',
      borderRadius: 12,
      padding: '10px 14px',
      color: '#fca5a5',
      marginBottom: 20,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    },
    loginForm: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
    },
    inputLabel: {
      fontSize: 11,
      fontWeight: 600,
      color: '#94a3b8',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    loginInput: {
      width: '100%',
      background: 'rgba(15, 23, 42, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 10,
      padding: '11px 14px',
      color: '#fff',
      fontSize: 13,
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      fontFamily: 'inherit',
    },
    loginSubmitBtn: {
      width: '100%',
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: 10,
      padding: '12px',
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      marginTop: 6,
      textAlign: 'center',
      fontFamily: 'inherit',
    },

    // Dashboard Styles
    page: {
      minHeight: '100vh',
      background: '#F3F4F6',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#111827',
    },
    topBar: {
      background: '#fff',
      borderBottom: '0.5px solid #E5E7EB',
      padding: '0 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 56,
    },
    brand: { display: 'flex', alignItems: 'center', gap: 10 },
    brandIcon: {
      width: 32, height: 32, borderRadius: 8,
      background: '#185FA5', display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    brandTitle: { fontSize: 14, fontWeight: 700, color: '#111827', letterSpacing: '-0.01em' },
    brandSub: { fontSize: 11, color: '#9CA3AF' },
    refreshBtn: {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 12, padding: '6px 14px', borderRadius: 8,
      border: '0.5px solid #D1D5DB', background: '#fff', color: '#374151',
      cursor: 'pointer', fontWeight: 500,
    },
    logoutBtn: {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 12, padding: '6px 14px', borderRadius: 8,
      border: '0.5px solid #F3F4F6', background: '#FCEBEB', color: '#A32D2D',
      cursor: 'pointer', fontWeight: 600, transition: 'background 0.15s',
    },
    content: { padding: '24px 28px', maxWidth: 1200, margin: '0 auto' },
    statsRow: { display: 'flex', gap: 10, marginBottom: 20 },
    tableCard: {
      background: '#fff',
      border: '0.5px solid #E5E7EB',
      borderRadius: 12,
      overflow: 'hidden',
    },
    tableHeader: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 20px', borderBottom: '0.5px solid #E5E7EB',
    },
    tableTitle: { fontSize: 13, fontWeight: 600, color: '#111827' },
    filterTabs: { display: 'flex', gap: 4 },
    thead: { background: '#F9FAFB', borderBottom: '0.5px solid #E5E7EB' },
    th: {
      padding: '10px 16px', fontSize: 10, fontWeight: 700,
      color: '#6B7280', textAlign: 'left', letterSpacing: '0.05em',
      textTransform: 'uppercase', whiteSpace: 'nowrap',
    },
    td: { padding: '12px 16px', fontSize: 12, verticalAlign: 'middle' },
    mono: { fontFamily: '"SF Mono", "Fira Code", monospace', fontSize: 11, color: '#185FA5', fontWeight: 600 },
    userName: { fontSize: 12, fontWeight: 600, color: '#111827' },
    userEmail: { fontSize: 11, color: '#6B7280', marginTop: 1 },
    cvBadge: { fontSize: 10, color: '#9CA3AF', fontFamily: 'monospace', marginTop: 2 },
    bankName: { fontSize: 12, fontWeight: 600, color: '#374151' },
    waNum: { fontSize: 11, color: '#059669', marginTop: 2 },
    txDate: { fontSize: 10, color: '#9CA3AF', marginTop: 2 },
    iconBtn: (variant) => ({
      width: 28, height: 28, borderRadius: 7,
      border: '0.5px solid',
      borderColor: variant === 'approve' ? '#9FE1CB' : variant === 'reject' ? '#F7C1C1' : '#D1D5DB',
      background: variant === 'approve' ? '#E1F5EE' : variant === 'reject' ? '#FCEBEB' : '#fff',
      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 13,
      color: variant === 'approve' ? '#0F6E56' : variant === 'reject' ? '#A32D2D' : '#6B7280',
    }),
    exportBtn: {
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11, padding: '5px 11px', borderRadius: 7,
      border: '0.5px solid #185FA5', background: '#185FA5', color: '#fff',
      cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap',
    },
    slipBtn: {
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11, padding: '5px 10px', borderRadius: 7,
      border: '0.5px solid #E5E7EB', background: '#F9FAFB', color: '#374151',
      cursor: 'pointer', fontWeight: 500,
    },
    actionsCell: { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
    emptyRow: { textAlign: 'center', padding: '3rem', color: '#9CA3AF', fontSize: 13 },
    modalOverlay: {
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    },
    modalBox: {
      background: '#fff', borderRadius: 14, width: '100%', maxWidth: 440,
      overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
    },
    modalHead: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 18px', borderBottom: '0.5px solid #E5E7EB',
    },
    modalBody: {
      padding: 16, background: '#F9FAFB',
      display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 220,
    },
    modalFoot: {
      padding: '12px 16px', borderTop: '0.5px solid #E5E7EB',
      display: 'flex', justifyContent: 'flex-end', gap: 8,
    },
    closeBtn: {
      width: 28, height: 28, borderRadius: 7, border: '0.5px solid #E5E7EB',
      background: '#F3F4F6', cursor: 'pointer', display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: 16, color: '#6B7280', lineHeight: 1,
    },
    loadingWrap: {
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: '#F3F4F6', color: '#6B7280', fontSize: 14, gap: 10,
    },
  };

  const filterTabStyle = (val) => ({
    fontSize: 11, padding: '4px 11px', borderRadius: 7, cursor: 'pointer', fontWeight: 500,
    border: '0.5px solid',
    borderColor: filter === val ? '#185FA5' : '#E5E7EB',
    background: filter === val ? '#EBF4FF' : '#fff',
    color: filter === val ? '#185FA5' : '#6B7280',
  });

  // ─── Render Authentication Checking ───────────────────────────────────────────
  if (authChecking) {
    return (
      <div style={s.loadingWrap}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
          <circle cx="12" cy="12" r="10" strokeDasharray="30 30" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
          </circle>
        </svg>
        Verifying administrator session…
      </div>
    );
  }

  // ─── Render Login Screen ───────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div style={s.loginPage}>
        <div style={s.loginBgPattern} />
        <div style={s.loginCard}>
          <div style={s.loginLogoContainer}>
            <div style={s.loginLogo}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
          </div>
          <h1 style={s.loginTitle}>Secure Admin Portal</h1>
          <p style={s.loginSubtitle}>Please sign in to manage transactions</p>

          {loginError && (
            <div style={s.loginErrorCard}>
              <span style={{ fontSize: 14 }}>⚠️</span>
              <div style={{ fontSize: 12, fontWeight: 500 }}>{loginError}</div>
            </div>
          )}

          <form onSubmit={handleLogin} style={s.loginForm}>
            <div style={s.inputGroup}>
              <label style={s.inputLabel}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField('')}
                placeholder="Enter admin username"
                style={{
                  ...s.loginInput,
                  borderColor: focusedField === 'username' ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                  boxShadow: focusedField === 'username' ? '0 0 0 2px rgba(59, 130, 246, 0.25)' : 'none'
                }}
                required
              />
            </div>

            <div style={s.inputGroup}>
              <label style={s.inputLabel}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('')}
                placeholder="Enter security password"
                style={{
                  ...s.loginInput,
                  borderColor: focusedField === 'password' ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                  boxShadow: focusedField === 'password' ? '0 0 0 2px rgba(59, 130, 246, 0.25)' : 'none'
                }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              style={loginLoading ? { ...s.loginSubmitBtn, opacity: 0.7, cursor: 'not-allowed' } : s.loginSubmitBtn}
              onMouseEnter={(e) => {
                if (!loginLoading) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loginLoading) {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
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
      <div style={s.loadingWrap}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
          <circle cx="12" cy="12" r="10" strokeDasharray="30 30" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
          </circle>
        </svg>
        Loading admin portal…
      </div>
    );
  }

  return (
    <div style={s.page}>

      {/* Top bar */}
      <div style={s.topBar}>
        <div style={s.brand}>
          <div style={s.brandIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="8" y1="13" x2="16" y2="13"/>
              <line x1="8" y1="17" x2="16" y2="17"/>
            </svg>
          </div>
          <div>
            <div style={s.brandTitle}>LankaCV Admin</div>
            <div style={s.brandSub}>Manage transfers · Export clean PDFs</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button style={s.refreshBtn} onClick={fetchTransactions}>
            ↺ Refresh
          </button>
          <button
            style={s.logoutBtn}
            onClick={handleLogout}
            onMouseEnter={e => e.currentTarget.style.background = '#FADBD8'}
            onMouseLeave={e => e.currentTarget.style.background = '#FCEBEB'}
          >
            🔒 Logout
          </button>
        </div>
      </div>

      <div style={s.content}>

        {/* Stats */}
        <div style={s.statsRow}>
          <StatCard label="Total transactions" value={counts.all}      color="#185FA5" />
          <StatCard label="Pending review"     value={counts.pending}  color="#BA7517" />
          <StatCard label="Approved"           value={counts.approved} color="#0F6E56" />
          <StatCard label="Rejected"           value={counts.rejected} color="#A32D2D" />
        </div>

        {/* Table card */}
        <div style={s.tableCard}>
          <div style={s.tableHeader}>
            <span style={s.tableTitle}>Payment transactions</span>
            <div style={s.filterTabs}>
              {['all', 'pending', 'approved', 'rejected'].map(f => (
                <button key={f} style={filterTabStyle(f)} onClick={() => setFilter(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  {' '}
                  <span style={{ opacity: 0.65 }}>({counts[f]})</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={s.thead}>
                <tr>
                  {['Tx ID', 'User details', 'Payment info', 'Receipt', 'Status', 'Actions'].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={s.emptyRow}>
                      No transactions found.
                    </td>
                  </tr>
                ) : filtered.map((tx, i) => (
                  <tr
                    key={tx.id}
                    style={{
                      borderBottom: i < filtered.length - 1 ? '0.5px solid #F3F4F6' : 'none',
                      background: updating === tx.id ? '#F9FAFB' : '#fff',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { if (updating !== tx.id) e.currentTarget.style.background = '#F9FAFB'; }}
                    onMouseLeave={e => { if (updating !== tx.id) e.currentTarget.style.background = '#fff'; }}
                  >
                    {/* Tx ID */}
                    <td style={s.td}>
                      <span style={s.mono}>#{tx.id}</span>
                    </td>

                    {/* User details */}
                    <td style={s.td}>
                      <div style={s.userName}>{tx.full_name}</div>
                      <div style={s.userEmail}>{tx.email}</div>
                      <div style={s.cvBadge}>CV: {tx.cv_id}</div>
                    </td>

                    {/* Payment info */}
                    <td style={s.td}>
                      <div style={s.bankName}>{tx.bank_name}</div>
                      {tx.whatsapp_number && (
                        <div style={s.waNum}>WhatsApp: {tx.whatsapp_number}</div>
                      )}
                      <div style={s.txDate}>
                        {new Date(tx.created_at).toLocaleString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </div>
                    </td>

                    {/* Receipt slip */}
                    <td style={s.td}>
                      {tx.payment_slip ? (
                        <button style={s.slipBtn} onClick={() => setSelectedSlip(tx.payment_slip)}>
                          🧾 View slip
                        </button>
                      ) : (
                        <span style={{ fontSize: 11, color: '#D1D5DB' }}>—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td style={s.td}>
                      <StatusBadge status={tx.status} />
                    </td>

                    {/* Actions */}
                    <td style={s.td}>
                      <div style={s.actionsCell}>
                        {tx.status === 'pending' && (
                          <>
                            <button
                              style={s.iconBtn('approve')}
                              title="Approve"
                              disabled={updating === tx.id}
                              onClick={() => handleStatusUpdate(tx.id, 'approved')}
                            >✓</button>
                            <button
                              style={s.iconBtn('reject')}
                              title="Reject"
                              disabled={updating === tx.id}
                              onClick={() => handleStatusUpdate(tx.id, 'rejected')}
                            >✕</button>
                          </>
                        )}
                        <button
                          style={s.exportBtn}
                          onClick={() => handleExportPDF(tx.cv_id, tx.full_name)}
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

      {/* Receipt slip modal */}
      {selectedSlip && (
        <div style={s.modalOverlay} onClick={() => setSelectedSlip(null)}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            <div style={s.modalHead}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Payment slip</span>
              <button style={s.closeBtn} onClick={() => setSelectedSlip(null)}>×</button>
            </div>
            <div style={s.modalBody}>
              {selectedSlip.startsWith('data:application/pdf') ? (
                <div style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
                  📄 PDF receipt uploaded.
                </div>
              ) : (
                <img
                  src={selectedSlip}
                  alt="Payment receipt"
                  style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain', borderRadius: 8 }}
                />
              )}
            </div>
            <div style={s.modalFoot}>
              <a
                href={selectedSlip}
                download="payment_slip"
                style={{ ...s.slipBtn, textDecoration: 'none' }}
              >
                ↓ Download
              </a>
              <button
                style={{ ...s.exportBtn, background: '#374151', borderColor: '#374151' }}
                onClick={() => setSelectedSlip(null)}
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