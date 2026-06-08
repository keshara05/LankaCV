'use client';

import React, { useState, useEffect } from 'react';

export default function AdminPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlip, setSelectedSlip] = useState(null); // Modal view for slip image

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/transactions');
      const data = await res.json();
      if (!data.error) {
        setTransactions(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleStatusUpdate = async (txId, nextStatus) => {
    try {
      const res = await fetch('/api/transactions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txId, status: nextStatus })
      });
      if (res.ok) {
        fetchTransactions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportPDF = (cvId, name) => {
    // Open the server-side PDF generator API endpoint in a new tab or trigger a download
    const cleanFilename = `${name.replace(/\s+/g, '_')}_CV.pdf`;
    window.open(`/api/export-pdf?cvId=${cvId}&filename=${encodeURIComponent(cleanFilename)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900 text-slate-500">
        <span className="animate-spin mr-2">⏳</span> Loading admin portal...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      
      {/* Top Header */}
      <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-black tracking-tight text-white uppercase">LankaCV Admin</h1>
          <p className="text-xs text-slate-500">Manage bank transfers and export pixel-perfect, watermark-free PDFs.</p>
        </div>
        <button
          onClick={fetchTransactions}
          className="px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-xs font-bold rounded-lg border border-slate-700 transition"
        >
          🔄 Refresh
        </button>
      </header>

      {/* Transactions Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Tx ID</th>
                <th className="py-3.5 px-4">User Details</th>
                <th className="py-3.5 px-4">Payment Info</th>
                <th className="py-3.5 px-4">Receipt Slip</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-slate-500 italic">
                    No transactions or payment slips uploaded yet.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-4 px-4 font-mono text-indigo-400 font-bold">{tx.id}</td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-200">{tx.full_name}</div>
                      <div className="text-[10px] text-slate-500">{tx.email}</div>
                      <div className="text-[10px] text-indigo-300 font-mono mt-0.5">CV: {tx.cv_id}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-300">{tx.bank_name}</div>
                      {tx.whatsapp_number && (
                        <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                          WhatsApp: {tx.whatsapp_number}
                        </div>
                      )}
                      <div className="text-[9px] text-slate-500 mt-0.5">
                        Date: {new Date(tx.created_at).toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {tx.payment_slip ? (
                        <button
                          type="button"
                          onClick={() => setSelectedSlip(tx.payment_slip)}
                          className="px-2.5 py-1 bg-indigo-950 text-indigo-300 hover:bg-indigo-900 border border-indigo-850 rounded text-[10px] font-bold transition"
                        >
                          👁️ View Slip
                        </button>
                      ) : (
                        <span className="text-slate-600 italic">No file</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        tx.status === 'approved' 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' 
                          : tx.status === 'rejected'
                          ? 'bg-rose-950 text-rose-400 border border-rose-900'
                          : 'bg-amber-950 text-amber-400 border border-amber-900'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center items-center gap-2">
                        {tx.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleStatusUpdate(tx.id, 'approved')}
                              className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded font-bold text-[10px] transition"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusUpdate(tx.id, 'rejected')}
                              className="px-2 py-1 bg-rose-700 hover:bg-rose-600 text-white rounded font-bold text-[10px] transition"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => handleExportPDF(tx.cv_id, tx.full_name)}
                          className="px-2.5 py-1 bg-blue-700 hover:bg-blue-600 text-white font-extrabold rounded text-[10px] transition flex items-center gap-1 shadow-md"
                        >
                          📥 Export Clean PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Slip View Modal */}
      {selectedSlip && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 transition-opacity">
          <div className="bg-slate-900 border border-slate-800 max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setSelectedSlip(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/80 text-white font-bold hover:bg-slate-800 flex items-center justify-center border border-slate-800 transition"
            >
              ×
            </button>
            <div className="p-4 bg-slate-950 border-b border-slate-850">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">Payment Slip Receipt</h3>
            </div>
            <div className="p-4 flex justify-center bg-slate-950">
              {selectedSlip.startsWith('data:application/pdf') ? (
                <div className="p-10 text-center text-xs text-slate-400 font-medium">
                  📄 PDF Receipt Uploaded. Select Actions or click download.
                </div>
              ) : (
                <img 
                  src={selectedSlip} 
                  alt="Receipt slip" 
                  className="max-h-[70vh] object-contain border border-slate-800 rounded" 
                />
              )}
            </div>
            <div className="p-4 border-t border-slate-850 flex justify-end gap-2">
              <a 
                href={selectedSlip} 
                download="payment_slip" 
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-xs font-bold rounded-lg text-slate-200"
              >
                💾 Download Original
              </a>
              <button 
                onClick={() => setSelectedSlip(null)} 
                className="px-3 py-1.5 bg-indigo-650 hover:bg-indigo-600 text-xs font-bold rounded-lg text-white"
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
