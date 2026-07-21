import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { fetchSpendingByDepartment, fetchSpendingBySupplier, fetchSpendingOverTime } from '../services/reportsService';

function ReportsPage({ profile }) {
  const [byDepartment, setByDepartment] = useState([]);
  const [bySupplier, setBySupplier] = useState([]);
  const [overTime, setOverTime] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [dept, supplier, time] = await Promise.all([
        fetchSpendingByDepartment(),
        fetchSpendingBySupplier(),
        fetchSpendingOverTime(),
      ]);
      setByDepartment(dept);
      setBySupplier(supplier);
      setOverTime(time);
      setLoading(false);
    }
    load();
  }, []);

  const title = profile?.role === 'employee' ? 'ההוצאות שלי' : 'דוחות ואנליטיקה';

  if (loading) return <div className="p-8 text-slate-400" dir="rtl">טוען...</div>;

  return (
    <div className="p-8 bg-navy-950 min-h-screen space-y-8" dir="rtl">
      <h1 className="text-xl font-bold text-white">{title}</h1>

      <div className="bg-navy-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-sm font-bold text-slate-200 mb-4">💰 הוצאות לפי מחלקה</h2>
        {byDepartment.length === 0 ? (
          <div className="text-sm text-slate-500">אין נתונים להצגה</div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byDepartment}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }}
                formatter={(value) => [`₪${Number(value).toLocaleString()}`, 'סה"כ']}
              />
              <Bar dataKey="total" fill="#eab308" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-navy-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-sm font-bold text-slate-200 mb-4">🏭 הוצאות לפי ספק</h2>
        {bySupplier.length === 0 ? (
          <div className="text-sm text-slate-500">אין נתונים להצגה</div>
        ) : (
          <div className="space-y-3">
            {bySupplier.map((s) => (
              <div key={s.supplierId} className="flex items-center justify-between text-sm">
                <span className="text-slate-300">{s.name}</span>
                <span className="text-white font-medium">₪{s.total.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-navy-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-sm font-bold text-slate-200 mb-4">📈 מגמת הוצאות לאורך זמן</h2>
        {overTime.length === 0 ? (
          <div className="text-sm text-slate-500">אין נתונים להצגה</div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={overTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }}
                formatter={(value) => [`₪${Number(value).toLocaleString()}`, 'סה"כ']}
              />
              <Line type="monotone" dataKey="total" stroke="#eab308" strokeWidth={2} dot={{ fill: '#eab308' }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default ReportsPage;