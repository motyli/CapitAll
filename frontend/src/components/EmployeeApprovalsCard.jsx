import React, { useState } from 'react';
import { approveEmployee, rejectEmployee } from '../services/approvalsService';

function EmployeeApprovalsCard({ pendingEmployees, departments, onChanged }) {
  const [assignments, setAssignments] = useState({});
  const [processingId, setProcessingId] = useState(null);

  function updateAssignment(profileId, field, value) {
    setAssignments((prev) => ({ ...prev, [profileId]: { ...prev[profileId], [field]: value } }));
  }

  async function handleApprove(profileId) {
    const a = assignments[profileId] || {};
    const role = a.role || 'employee';
    if (role === 'employee' && !a.departmentId) {
      alert('יש לבחור מחלקה לעובד לפני אישור');
      return;
    }
    setProcessingId(profileId);
    try {
      await approveEmployee(profileId, {
        role,
        departmentId: a.departmentId || null,
        scopeType: a.departmentId ? 'department' : 'company',
      });
      await onChanged();
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(profileId) {
    setProcessingId(profileId);
    try {
      await rejectEmployee(profileId);
      await onChanged();
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <section>
      <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
        👤 עובדים ממתינים לאישור
        {pendingEmployees.length > 0 && (
          <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {pendingEmployees.length}
          </span>
        )}
      </h2>

      {departments.length === 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm rounded-xl p-4 mb-4">
          ⚠️ עדיין לא הגדרת מחלקות בארגון. יש ליצור לפחות מחלקה אחת לפני אישור עובדים.
        </div>
      )}

      {pendingEmployees.length === 0 ? (
        <div className="text-sm text-slate-500">אין עובדים הממתינים לאישור</div>
      ) : (
        <div className="space-y-3">
          {pendingEmployees.map((p) => (
            <div key={p.id} className="bg-navy-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between gap-4">
              <div>
                <div className="text-white font-medium">{p.full_name}</div>
                <div className="text-xs text-slate-500">נרשם ב-{new Date(p.created_at).toLocaleDateString('he-IL')}</div>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={assignments[p.id]?.role || 'employee'}
                  onChange={(e) => updateAssignment(p.id, 'role', e.target.value)}
                  className="bg-navy-950 border border-slate-800 rounded-lg text-xs px-2 py-1.5 text-slate-200"
                >
                  <option value="employee">עובד</option>
                  <option value="manager">מנהל</option>
                </select>

                <select
                  value={assignments[p.id]?.departmentId || ''}
                  onChange={(e) => updateAssignment(p.id, 'departmentId', e.target.value)}
                  className="bg-navy-950 border border-slate-800 rounded-lg text-xs px-2 py-1.5 text-slate-200"
                >
                  {assignments[p.id]?.role !== 'employee' && <option value="">ללא מחלקה (מנהל כללי)</option>}
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>

                <button
                  disabled={departments.length === 0 || processingId === p.id}
                  onClick={() => handleApprove(p.id)}
                  className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-500/20 disabled:opacity-30"
                >
                  ✓ אשר
                </button>
                <button
                  disabled={processingId === p.id}
                  onClick={() => handleReject(p.id)}
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

export default EmployeeApprovalsCard;