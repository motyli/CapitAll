import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { fetchDepartments } from '../services/departmentsService';
import { fetchSuppliers } from '../services/suppliersService';
import { createTransaction } from '../services/transactionsService';
import { uploadReceipt, getReceiptSignedUrl } from '../services/storageService';
import { updateTransactionReceiptUrl } from '../services/transactionsService';

const emptyForm = { departmentId: '', supplierId: '', amount: '', description: '', paymentMethod: '' };

function TransactionQuickAddModal({ isOpen, onClose, profile, onCreated }) {
  const [form, setForm] = useState(emptyForm);
  const [departments, setDepartments] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loadingLists, setLoadingLists] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);


  useEffect(() => {
    if (!isOpen) return;

    async function loadLists() {
      setLoadingLists(true);
      try {
        const [deptData, supplierData] = await Promise.all([
          fetchDepartments(),
          fetchSuppliers(),
        ]);
        setDepartments(deptData);
        setSuppliers(supplierData);

        // עובד: אם משויך למחלקה אחת - נבחר אותה אוטומטית ונמנע ממנו לבחור אחרת
        if (profile?.role === 'employee' && profile.department_id) {
          setForm((f) => ({ ...f, departmentId: profile.department_id }));
        }
      } catch (err) {
        setError('שגיאה בטעינת נתונים: ' + err.message);
      } finally {
        setLoadingLists(false);
      }
    }

    loadLists();
  }, [isOpen, profile]);

  function handleClose() {
    setForm(emptyForm);
    setFile(null);
    setError(null);
    onClose();
  }

 async function handleSubmit(e) {
  e.preventDefault();
  setError(null);

  if (!form.departmentId) {
    setError('יש לבחור מחלקה');
    return;
  }
  if (!form.amount || Number(form.amount) <= 0) {
    setError('יש להזין סכום תקין');
    return;
  }
  if (!form.paymentMethod) {
  setError('יש לבחור אופן תשלום');
  return;
}

  setSaving(true);
  try {
    const newTx = await createTransaction({
     companyId: profile.company_id,
     departmentId: form.departmentId,
     profileId: profile.id,
     amount: Number(form.amount),
     type: 'expense',
     description: form.description,
     supplierId: form.supplierId || null,
     paymentMethod: form.paymentMethod,
});
const successMessage = newTx.status === 'approved'
  ? 'ההוצאה נרשמה ואושרה'
  : 'ההוצאה נשלחה לאישור מנהל';
    onCreated?.(newTx, successMessage);
    if (file) {
  try {
    const filePath = await uploadReceipt(file, profile.company_id, newTx.id);
    await updateTransactionReceiptUrl(newTx.id, filePath);
  } catch (uploadErr) {
    console.error('Receipt upload failed:', uploadErr);
    // התנועה כבר נוצרה בהצלחה - כישלון העלאה לא מבטל אותה, רק מדלגים על הקובץ
  }
}
    handleClose();
  } catch (err) {
    if (err.message?.includes('Budget Exceeded')) {
      setError('חריגה מהתקציב הזמין במחלקה — הבקשה נחסמה ותועדה.');
    } else if (err.message?.includes('Security Integrity Violation')) {
      setError('שגיאת הרשאה: המחלקה שנבחרה אינה שייכת לארגון שלך.');
    } else {
      setError('שגיאה ביצירת ההוצאה: ' + err.message);
    }
  } finally {
    setSaving(false);
  }
}

  // עובד רואה רק את המחלקה שלו כאופציה נעולה; admin/manager בוחרים חופשי מתוך הרשימה שה-RLS מחזיר להם
  const isDepartmentLocked = profile?.role === 'employee';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="הוספת הוצאה חדשה">
      {loadingLists ? (
        <div className="text-sm text-slate-400 py-6 text-center">טוען נתונים...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg p-2.5">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">מחלקה *</label>
            <select
              value={form.departmentId}
              onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
              disabled={isDepartmentLocked}
              className="w-full bg-navy-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 disabled:opacity-60"
            >
              <option value="">בחר מחלקה</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">ספק</label>
            <select
              value={form.supplierId}
              onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
              className="w-full bg-navy-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100"
            >
              <option value="">ללא ספק</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">סכום (₪) *</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full bg-navy-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
          </div>

<div>
  <label className="block text-xs text-slate-400 mb-1.5">אופן תשלום *</label>
  <select
    value={form.paymentMethod}
    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
    className="w-full bg-navy-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100"
  >
    <option value="">בחר אופן תשלום</option>
    <option value="reimbursement">החזר לעובד (שילמתי בעצמי)</option>
    <option value="direct_supplier_payment">תשלום ישיר לספק ע"י הארגון</option>
  </select>
</div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">תיאור</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full bg-navy-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 resize-none"
            />
          </div>
<div>
  <label className="block text-xs text-slate-400 mb-1.5">קובץ מצורף (אופציונלי — אפשר גם אחר כך)</label>
  <input
    type="file"
    accept=".pdf,.png,.jpg,.jpeg"
    onChange={(e) => setFile(e.target.files?.[0] || null)}
    className="w-full text-xs text-slate-400 file:bg-navy-800 file:border-0 file:text-gold-400 file:rounded-lg file:px-3 file:py-1.5 file:ml-3"
  />
</div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-navy-950 font-bold text-sm rounded-xl py-2.5"
            >
              {saving ? 'שולח...' : 'שלח בקשה'}
            </button>
            <button type="button" onClick={handleClose} className="text-slate-500 text-sm px-4">
              ביטול
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

export default TransactionQuickAddModal;