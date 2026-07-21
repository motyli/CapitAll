import React, { useEffect, useState } from 'react';
import { fetchSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../services/suppliersService';

const emptyForm = { name: '', taxId: '', phone: '', email: '', address: '' };

function SuppliersPage({ profile }) {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const canManage = profile?.role === 'admin' || profile?.role === 'manager';

  async function load() {
    setLoading(true);
    try {
      setSuppliers(await fetchSuppliers());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function startEdit(s) {
    setEditingId(s.id);
    setForm({ name: s.name, taxId: s.tax_id || '', phone: s.phone || '', email: s.email || '', address: s.address || '' });
    setShowNewForm(false);
  }

  function startNew() {
    setEditingId(null);
    setForm(emptyForm);
    setShowNewForm(true);
  }

  function cancelEdit() {
    setEditingId(null);
    setShowNewForm(false);
    setForm(emptyForm);
  }

  async function handleSave() {
    if (!form.name.trim()) {
      alert('יש למלא שם ספק');
      return;
    }
    try {
      if (editingId) {
        await updateSupplier(editingId, form);
      } else {
        await createSupplier({ ...form, companyId: profile.company_id });
      }
      cancelEdit();
      await load();
    } catch (err) {
      alert('שגיאה בשמירה: ' + err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('למחוק את הספק? פעולה זו לא ניתנת לביטול.')) return;
    try {
      await deleteSupplier(id);
      await load();
    } catch (err) {
      alert('לא ניתן למחוק ספק שמשויך לתנועות קיימות.');
    }
  }

  if (loading) return <div className="p-8 text-slate-400" dir="rtl">טוען...</div>;
  if (error) return <div className="p-8 text-red-400" dir="rtl">שגיאה: {error}</div>;

  return (
    <div className="p-8 bg-navy-950 min-h-screen" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">ניהול ספקים</h1>
        {canManage && !showNewForm && (
          <button onClick={startNew} className="bg-gold-500 hover:bg-gold-600 text-navy-950 text-xs font-bold px-4 py-2 rounded-xl">
            + ספק חדש
          </button>
        )}
      </div>

      {canManage && showNewForm && (
        <div className="bg-navy-900 border border-gold-500/30 rounded-xl p-5 mb-6 grid grid-cols-2 gap-3">
          <input placeholder="שם ספק" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-navy-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100" />
          <input placeholder="ח.פ / ע.מ" value={form.taxId} onChange={(e) => setForm({ ...form, taxId: e.target.value })}
            className="bg-navy-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100" />
          <input placeholder="טלפון" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="bg-navy-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100" />
          <input placeholder="אימייל" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="bg-navy-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100" />
          <input placeholder="כתובת" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="col-span-2 bg-navy-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100" />
          <div className="col-span-2 flex gap-2">
            <button onClick={handleSave} className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-4 py-2 rounded-lg">שמור</button>
            <button onClick={cancelEdit} className="text-slate-500 text-xs px-3 py-2">ביטול</button>
          </div>
        </div>
      )}

      <div className="bg-navy-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="text-slate-500 border-b border-slate-800 text-xs">
              <th className="p-4 font-medium">שם</th>
              <th className="p-4 font-medium">ח.פ</th>
              <th className="p-4 font-medium">טלפון</th>
              <th className="p-4 font-medium">אימייל</th>
              {canManage && <th className="p-4 font-medium text-center">פעולות</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {suppliers.map((s) => (
              <tr key={s.id} className="text-slate-300">
                {canManage && editingId === s.id ? (
                  <>
                    <td className="p-4"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-navy-950 border border-slate-800 rounded-lg px-2 py-1 text-sm w-full" /></td>
                    <td className="p-4"><input value={form.taxId} onChange={(e) => setForm({ ...form, taxId: e.target.value })} className="bg-navy-950 border border-slate-800 rounded-lg px-2 py-1 text-sm w-full" /></td>
                    <td className="p-4"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-navy-950 border border-slate-800 rounded-lg px-2 py-1 text-sm w-full" /></td>
                    <td className="p-4"><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-navy-950 border border-slate-800 rounded-lg px-2 py-1 text-sm w-full" /></td>
                    <td className="p-4 text-center space-x-2 space-x-reverse">
                      <button onClick={handleSave} className="text-emerald-400 text-xs font-bold">שמור</button>
                      <button onClick={cancelEdit} className="text-slate-500 text-xs">ביטול</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4 font-medium text-white">{s.name}</td>
                    <td className="p-4 text-slate-400">{s.tax_id || '—'}</td>
                    <td className="p-4 text-slate-400">{s.phone || '—'}</td>
                    <td className="p-4 text-slate-400">{s.email || '—'}</td>
                    {canManage && (
                      <td className="p-4 text-center space-x-2 space-x-reverse">
                        <button onClick={() => startEdit(s)} className="text-gold-400 text-xs font-bold">ערוך</button>
                        <button onClick={() => handleDelete(s.id)} className="text-red-400 text-xs font-bold">מחק</button>
                      </td>
                    )}
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SuppliersPage;