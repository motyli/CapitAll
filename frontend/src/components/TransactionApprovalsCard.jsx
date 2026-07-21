import React, { useState } from 'react';
import { decideTransaction } from '../services/transactionApprovalsService';

function TransactionApprovalsCard({ pendingTransactions, onChanged }) {
  const [processingId, setProcessingId] = useState(null);

  async function handleDecision(id, decision) {
    setProcessingId(id);
    try {
      await decideTransaction(id, decision);
      await onChanged();
    } catch (err) {
      alert('שגיאה: ' + err.message);
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <section>
      <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
        💳 בקשות הוצאה ממתינות
        {pendingTransactions.length > 0 && (
          <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {pendingTransactions.length}
          </span>
        )}
      </h2>

      {pendingTransactions.length === 0 ? (
        <div className="text-sm text-slate-500">אין בקשות הממתינות לאישור</div>
      ) : (
        <div className="space-y-3">
          {pendingTransactions.map((tx) => (
            <div key={tx.id} className="bg-navy-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between gap-4">
              <div>
                <div className="text-white font-medium">₪{Number(tx.amount).toLocaleString()} — {tx.departments?.name}</div>
                <div className="text-xs text-slate-400 mt-1">{tx.description || 'ללא תיאור'}</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  מאת: {tx.profiles?.full_name} · ספק: {tx.suppliers?.name || 'ללא'} · {new Date(tx.created_at).toLocaleDateString('he-IL')}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={processingId === tx.id}
                  onClick={() => handleDecision(tx.id, 'approved')}
                  className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-500/20 disabled:opacity-30"
                >
                  ✓ אשר
                </button>
                <button
                  disabled={processingId === tx.id}
                  onClick={() => handleDecision(tx.id, 'rejected')}
                  className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-500/20 disabled:opacity-30"
                >
                  ✕ דחה
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default TransactionApprovalsCard;