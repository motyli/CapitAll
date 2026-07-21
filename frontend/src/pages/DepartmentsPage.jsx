import React, { useEffect, useState } from 'react';
import { fetchDepartments, createDepartment, updateDepartment, deleteDepartment } from '../services/departmentsService';

function DepartmentsPage({ profile }) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', allocatedBudget: '' });
  const [showNewForm, setShowNewForm] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchDepartments();
      setDepartments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function startEdit(dept) {
    setEditingId(dept.id);
    setForm({ name: dept.name, allocatedBudget: dept.allocated_budget });
    setShowNewForm(false);
  }

  function startNew() {
    setEditingId(null);
    setForm({ name: '', allocatedBudget: '' });
    setShowNewForm(true);
  }

  async function handleSave() {
    if (!form.name.trim() || form.allocatedBudget === '') {
      alert('יש למלא שם ותקציב');
      return;
    }
    try {
      if (editingId) {
        await updateDepartment(editingId, { name: form.name, allocatedBudget: Number(form.allocatedBudget) });
      } else {
        await createDepartment({ name: form.name, allocatedBudget: Number(form.allocatedBudget) , companyId: profile.company_id  });
      }
      setEditingId(null);
      setShowNewForm(false);
      setForm({ name: '', allocatedBudget: '' });
      await load();
    } catch (err) {
      alert('שגיאה בשמירה: ' + err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('למחוק את המחלקה? פעולה זו לא ניתנת לביטול.')) return;
    try {
      await deleteDepartment(id);
      await load();
    } catch (err) {
      alert('לא ניתן למחוק מחלקה שיש לה תנועות או עובדים משויכים.');
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setShowNewForm(false);
  }

  if (loading) return <div className="p-8 text-slate-400" dir="rtl">טוען...</div>;
  if (error) return <div className="p-8 text-red-400" dir="rtl">שגיאה: {error}</div>;

  return (
    <div className="p-8 bg-navy-950 min-h-screen" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">ניהול מחלקות</h1>
        {!showNewForm && (
          <button
            onClick={startNew}
            className="bg-gold-500 hover:bg-gold-600 text-navy-950 text-xs font-bold px-4 py-2 rounded-xl"
          >
            + מחלקה חדשה
          </button>
        )}
      </div>

      {showNewForm && (
        <div className="bg-navy-900 border border-gold-500/30 rounded-xl p-5 mb-6 flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-xs text-slate-400 mb-1.5">שם מחלקה</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-navy-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
          </div>
          <div className="w-40">
            <label className="block text-xs text-slate-400 mb-1.5">תקציב מוקצה</label>
            <input
              type="number"
              value={form.allocatedBudget}
              onChange={(e) => setForm({ ...form, allocatedBudget: e.target.value })}
              className="w-full bg-navy-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
          </div>
          <button onClick={handleSave} className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-4 py-2 rounded-lg">שמור</button>
          <button onClick={cancelEdit} className="text-slate-500 text-xs px-3 py-2">ביטול</button>
        </div>
      )}

      <div className="bg-navy-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="text-slate-500 border-b border-slate-800 text-xs">
              <th className="p-4 font-medium">שם</th>
              <th className="p-4 font-medium">תקציב מוקצה</th>
              <th className="p-4 font-medium">ניצול נוכחי</th>
              <th className="p-4 font-medium">יתרה</th>
              <th className="p-4 font-medium text-center">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {departments.map((dept) => (
              <tr key={dept.id} className="text-slate-300">
                {editingId === dept.id ? (
                  <>
                    <td className="p-4">
                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="bg-navy-950 border border-slate-800 rounded-lg px-2 py-1 text-sm text-slate-100 w-full"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        value={form.allocatedBudget}
                        onChange={(e) => setForm({ ...form, allocatedBudget: e.target.value })}
                        className="bg-navy-950 border border-slate-800 rounded-lg px-2 py-1 text-sm text-slate-100 w-32"
                      />
                    </td>
                    <td className="p-4 text-slate-500">₪{Number(dept.current_spent).toLocaleString()}</td>
                    <td className="p-4">—</td>
                    <td className="p-4 text-center space-x-2 space-x-reverse">
                      <button onClick={handleSave} className="text-emerald-400 text-xs font-bold">שמור</button>
                      <button onClick={cancelEdit} className="text-slate-500 text-xs">ביטול</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4 font-medium text-white">{dept.name}</td>
                    <td className="p-4">₪{Number(dept.allocated_budget).toLocaleString()}</td>
                    <td className="p-4">₪{Number(dept.current_spent).toLocaleString()}</td>
                    <td className="p-4">₪{(Number(dept.allocated_budget) - Number(dept.current_spent)).toLocaleString()}</td>
                    <td className="p-4 text-center space-x-2 space-x-reverse">
                      <button onClick={() => startEdit(dept)} className="text-gold-400 text-xs font-bold">ערוך</button>
                      <button onClick={() => handleDelete(dept.id)} className="text-red-400 text-xs font-bold">מחק</button>
                    </td>
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

export default DepartmentsPage;