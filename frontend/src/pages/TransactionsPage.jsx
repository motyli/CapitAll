import React, { useEffect, useState } from 'react';
import { fetchTransactionsPage } from '../services/transactionsService';
import TransactionQuickAddModal from '../components/TransactionQuickAddModal';
import { uploadReceipt, getReceiptSignedUrl } from '../services/storageService';
import { updateTransactionReceiptUrl } from '../services/transactionsService';


const PAGE_SIZE = 20;

const STATUS_LABELS = {
  pending: { text: 'ממתין', className: 'bg-amber-500/10 text-amber-400' },
  approved: { text: 'אושר', className: 'bg-emerald-500/10 text-emerald-400' },
  rejected: { text: 'נדחה', className: 'bg-red-500/10 text-red-400' },
};
const PAYMENT_METHOD_LABELS = {
  reimbursement: '💳 החזר לעובד',
  direct_supplier_payment: '🏢 תשלום ישיר',
};

function TransactionsPage({ profile }) {
  const [transactions, setTransactions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);


  async function load(reset = true) {
    setLoading(true);
    try {
      const offset = reset ? 0 : transactions.length;
      const { data, count } = await fetchTransactionsPage({
        status: statusFilter || null,
        offset,
        limit: PAGE_SIZE,
      });
      setTransactions(reset ? data : [...transactions, ...data]);
      setTotalCount(count);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(true); /* eslint-disable-next-line */ }, [statusFilter]);

  const hasMore = transactions.length < totalCount;

async function handleAttachReceipt(tx, file) {
  if (!file) return;
  setUploadingId(tx.id);
  try {
    const filePath = await uploadReceipt(file, profile.company_id, tx.id);
    await updateTransactionReceiptUrl(tx.id, filePath);
    await load(true);
  } catch (err) {
    alert('שגיאה בהעלאת הקובץ: ' + err.message);
  } finally {
    setUploadingId(null);
  }
}

async function handleViewReceipt(filePath) {
  try {
    const url = await getReceiptSignedUrl(filePath);
    window.open(url, '_blank');
  } catch (err) {
    alert('שגיאה בפתיחת הקובץ');
  }
}

  return (
    <div className="p-8 bg-navy-950 min-h-screen" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">תנועות</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gold-500 hover:bg-gold-600 text-navy-950 text-xs font-bold px-4 py-2 rounded-xl"
        >
          + הוצאה חדשה
        </button>
      </div>

      <div className="flex gap-2 mb-5">
        {['', 'pending', 'approved', 'rejected'].map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setStatusFilter(s)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border ${
              statusFilter === s
                ? 'bg-gold-500/10 border-gold-500/40 text-gold-400'
                : 'bg-navy-900 border-slate-800 text-slate-400'
            }`}
          >
            {s === '' ? 'הכל' : STATUS_LABELS[s].text}
          </button>
        ))}
      </div>

      <div className="bg-navy-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="text-slate-500 border-b border-slate-800 text-xs">
              <th className="p-4 font-medium">תאריך</th>
              <th className="p-4 font-medium">מחלקה</th>
              <th className="p-4 font-medium">ספק</th>
              <th className="p-4 font-medium">סכום</th>
              <th className="p-4 font-medium">אופן תשלום</th>
              <th className="p-4 font-medium">קובץ מצורף</th>
              <th className="p-4 font-medium">תיאור</th>
              {profile?.role !== 'employee' && <th className="p-4 font-medium">הוגש ע"י</th>}
              <th className="p-4 font-medium text-center">סטטוס</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {transactions.map((tx) => {
              const badge = STATUS_LABELS[tx.status] || { text: tx.status, className: 'bg-slate-500/10 text-slate-400' };
              return (
                <tr key={tx.id} className="text-slate-300">
                  <td className="p-4">{new Date(tx.created_at).toLocaleDateString('he-IL')}</td>
                  <td className="p-4 font-medium text-white">{tx.departments?.name || '—'}</td>
                  <td className="p-4 text-slate-400">{tx.suppliers?.name || '—'}</td>
                  <td className="p-4">₪{Number(tx.amount).toLocaleString()}</td>
                  <td className="p-4 text-slate-400 text-xs"> {PAYMENT_METHOD_LABELS[tx.payment_method] || '—'} </td>
                  <td className="p-4">
  {tx.receipt_url ? (
    <button onClick={() => handleViewReceipt(tx.receipt_url)} className="text-gold-400 text-xs underline">
      📎 צפה
    </button>
  ) : tx.profile_id === profile.id ? (
    <label className="text-xs text-slate-500 hover:text-gold-400 cursor-pointer underline">
      {uploadingId === tx.id ? 'מעלה...' : '+ צרף קובץ'}
      <input
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={(e) => handleAttachReceipt(tx, e.target.files?.[0])}
        className="hidden"
        disabled={uploadingId === tx.id}
      />
    </label>
  ) : (
    <span className="text-slate-600 text-xs">—</span>
  )}
</td>
                  <td className="p-4 text-slate-400">{tx.description || '—'}</td>
                  {profile?.role !== 'employee' && (
                    <td className="p-4 text-slate-400">{tx.profiles?.full_name || '—'}</td>
                  )}
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${badge.className}`}>
                      {badge.text}
                    </span>
                  </td>
                </tr>
              );
            })}

            {transactions.length === 0 && !loading && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500 text-sm">אין תנועות להצגה</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="text-center mt-5">
          <button
            onClick={() => load(false)}
            disabled={loading}
            className="text-xs text-slate-400 hover:text-gold-400 border border-slate-800 rounded-lg px-4 py-2"
          >
            {loading ? 'טוען...' : 'טען עוד'}
          </button>
        </div>
      )}

      <TransactionQuickAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        profile={profile}
        onCreated={() => load(true)}
      />
    </div>
  );
}

export default TransactionsPage;