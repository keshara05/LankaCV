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
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState('all');
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [updating, setUpdating]         = useState(null); // txId being updated

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/transactions');
      const data = await res.json();
      if (!data.error) setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

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
    // Modal overlay using min-height trick (no position:fixed)
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

  // ─── Render ───────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={s.loadingWrap}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
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
        <button style={s.refreshBtn} onClick={fetchTransactions}>
          ↺ Refresh
        </button>
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