import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDashboardData } from '../services/dashboardService';
import TransactionQuickAddModal from '../components/TransactionQuickAddModal';

function DashboardPage({ profile }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showTxModal, setShowTxModal] = useState(false);
  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        const result = await fetchDashboardData(profile);
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'שגיאה בטעינת נתוני הדשבורד');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [profile]);

  const getDepartmentStatusColor = (spent, allocated) => {
    const pct = (spent / allocated) * 100;
    if (pct >= 90) return { text: 'text-red-400', bar: 'bg-red-500 animate-pulse' };
    if (pct >= 70) return { text: 'text-amber-400', bar: 'bg-amber-500' };
    return { text: 'text-emerald-400', bar: 'bg-emerald-500' };
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950 text-slate-300" dir="rtl">
        טוען נתוני דשבורד...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950 text-red-400" dir="rtl">
        שגיאה: {error}
      </div>
    );
  }

  const { summary, departments, topOffenders, transactions } = data;
  const sortedOffenders = [...topOffenders].sort((a, b) => (b.amount || 0) - (a.amount || 0));

  return (
      <main className="flex-grow p-6 md:p-8 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">דשבורד תקציב</h1>
          <p className="text-sm text-slate-400 mt-1">נתונים מעודכנים בזמן אמת</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          <div className="bg-navy-900 border border-slate-800 p-5 rounded-2xl">
            <div className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">💰 תקציב מאושר</div>
            <div className="text-2xl font-bold text-slate-100">₪{summary.totalBudget.toLocaleString()}</div>
            <div className="text-[11px] text-slate-500 mt-1">מסגרת כוללת מאושרת</div>
          </div>

          <div className="bg-navy-900 border border-slate-800 p-5 rounded-2xl">
            <div className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">📉 ניצול בפועל</div>
            <div className="text-2xl font-bold text-slate-100">₪{summary.totalSpent.toLocaleString()}</div>
            <div className="text-[11px] text-slate-500 mt-1">
              {summary.totalBudget > 0 ? Math.round((summary.totalSpent / summary.totalBudget) * 100) : 0}% מתוך הסך הכולל
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl">
            <div className="text-xs text-amber-400 font-medium mb-2 flex items-center gap-1.5">🔥 Burn Rate</div>
            <div className="text-2xl font-bold text-amber-400">
              {summary.burnRateDaysRemaining ?? '—'}
            </div>
            <div className="text-[11px] text-amber-500/80 mt-1">
              {summary.burnRateDaysRemaining ? 'ימים עד אזילת התקציב' : 'טרם נאסף מספיק היסטוריה'}
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 p-5 rounded-2xl">
            <div className="text-xs text-red-400 font-medium mb-2 flex items-center gap-1.5">🛡️ חסימות אקטיביות</div>
            <div className="text-2xl font-bold text-red-400">₪{summary.blockedAmount.toLocaleString()}</div>
            <div className="text-[11px] text-red-500/80 mt-1">{summary.blockedCount} ניסיונות חריגה נבלמו</div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-6">

            <div className="bg-navy-900 border border-slate-800 p-6 rounded-2xl">
              <h2 className="text-sm font-bold text-slate-200 mb-6 flex items-center gap-2">🏢 ניצול תקציב מחלקתי</h2>
              <div className="space-y-5">
                {departments.map((dept) => {
                  const pct = dept.allocated > 0 ? Math.round((dept.spent / dept.allocated) * 100) : 0;
                  const colors = getDepartmentStatusColor(dept.spent, dept.allocated);

                  return (
                    <div key={dept.id} className="space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-300">{dept.name}</span>
                        <span className={colors.text}>{pct}%</span>
                         <button onClick={() => setShowTxModal(true)} className="bg-gold-500 hover:bg-gold-600 text-white font-medium py-1 px-2 rounded-lg transition-colors">
                        + הוצאה חדשה
                      </button>
                      </div>
      {showTxModal && 
      <TransactionQuickAddModal
        isOpen={showTxModal}
        onClose={() => setShowTxModal(false)}
        profile={profile}
        onCreated={(tx) => {
          console.log('נוצרה תנועה:', tx);
          // אפשר לרענן רשימה, להראות toast הצלחה וכו'
        }}
      />}
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>₪{dept.spent.toLocaleString()} / ₪{dept.allocated.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-2 bg-navy-950 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${colors.bar}`} style={{ width: `${Math.min(pct, 100)}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-navy-900 border border-slate-800 p-6 rounded-2xl overflow-x-auto">
              <h2 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">📜 לוג תנועות אחרונות</h2>
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-800">
                    <th className="pb-3 font-medium">תאריך</th>
                    <th className="pb-3 font-medium">מחלקה</th>
                    <th className="pb-3 font-medium">סכום</th>
                    <th className="pb-3 font-medium">תיאור</th>
                    <th className="pb-3 font-medium text-center">סטטוס</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="text-slate-300">
                      <td className="py-3.5">{new Date(tx.createdAt).toLocaleDateString('he-IL', { month: '2-digit', day: '2-digit' })}</td>
                      <td className="py-3.5 font-medium text-white">{tx.departmentName}</td>
                      <td className="py-3.5">₪{tx.amount.toLocaleString()}</td>
                      <td className="py-3.5 text-slate-400">{tx.description}</td>
                      <td className="py-3.5 text-center">
                        {tx.status === 'approved' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                            ✓ אושר
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400">
                            {tx.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          <div className="space-y-6">
            <div className="bg-navy-900 border border-slate-800 p-6 rounded-2xl">
              <h2 className="text-sm font-bold text-red-400 mb-4 flex items-center gap-2">⚠️ חסימות גדולות</h2>
              <div className="space-y-3">
                {sortedOffenders.length === 0 && (
                  <div className="text-xs text-slate-500">אין ניסיונות חסימה עדיין</div>
                )}
                {sortedOffenders.map((offender) => (
                  <div key={offender.id} className="bg-navy-950 border border-slate-800/80 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs font-bold text-white">{offender.departmentName}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{offender.description}</div>
                      </div>
                      <div className="text-sm font-bold text-red-400">₪{(offender.amount || 0).toLocaleString()}</div>
                    </div>
                    <div className="text-[11px] text-slate-400 bg-navy-900 px-2.5 py-1.5 rounded-lg border border-slate-800/40 flex items-center gap-1.5">
                      <span>ℹ️</span> {offender.blockedReason}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </main>
  );
}

export default DashboardPage;






// import React from 'react';
// import { dashboardMockData } from '../api/mockData';

// function DashboardPage() {
//   const { summary, departments, topOffenders, transactions } = dashboardMockData;

//   // פונקציית עזר לקביעת צבע הסטטוס של מחלקה לפי אחוז הניצול שלה
//   const getDepartmentStatusColor = (spent, allocated) => {
//     const pct = (spent / allocated) * 105; // חישוב אחוזים
//     if (pct >= 90) return { text: 'text-red-400', bar: 'bg-red-500 animate-pulse' };
//     if (pct >= 70) return { text: 'text-amber-400', bar: 'bg-amber-500' };
//     return { text: 'text-emerald-400', bar: 'bg-emerald-500' };
//   };

//   // מיון ה-Top Offenders מהגבוה לנמוך באופן דינמי למניעת באגים לוגיים
//   const sortedOffenders = [...topOffenders].sort((a, b) => b.amount - a.amount);

//   return (
//     <div className="flex min-h-screen bg-navy-950 text-slate-100 font-sans" dir="rtl">
      
//       {/* 1. תפריט צדדי קבוע (Sidebar) */}
//       <aside className="w-64 bg-navy-900 border-l border-slate-800 flex flex-col justify-between py-6 hidden md:flex">
//         <div>
//           <div className="px-6 pb-6 border-b border-slate-800 mb-6">
//             <div className="text-xl font-black tracking-wider text-gold-500">CapitAll</div>
//             <div className="text-xs text-slate-400 mt-1">ניהול תקציב ארגוני</div>
//           </div>
          
//           <nav className="space-y-1 px-3">
//             <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">ראשי</span>
//             <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl text-gold-400 bg-navy-800/60 border-r-2 border-gold-500 transition-all">
//               <span>📊</span> דשבורד
//             </button>
//             <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl text-slate-400 hover:bg-navy-800/40 hover:text-slate-200 transition-all">
//               <span>🏢</span> מחלקות
//             </button>
//             <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl text-slate-400 hover:bg-navy-800/40 hover:text-slate-200 transition-all">
//               <span>📜</span> תנועות
//             </button>
            
//             <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 pt-6 mb-2">ניהול</span>
//             <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl text-slate-400 hover:bg-navy-800/40 hover:text-slate-200 transition-all">
//               <span>🛡️</span> אישורים
//             </button>
//             <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl text-slate-400 hover:bg-navy-800/40 hover:text-slate-200 transition-all">
//               <span>📈</span> דוחות
//             </button>
//             <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl text-slate-400 hover:bg-navy-800/40 hover:text-slate-200 transition-all">
//               <span>⚙️</span> הגדרות
//             </button>
//           </nav>
//         </div>

//         {/* סטטוס סנכרון ERP בתחתית */}
//         <div className="mx-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
//           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
//           <div className="text-xs text-emerald-400 leading-tight">
//             ERP מסונכרן <br />
//             <span className="text-[10px] text-slate-400">לפני 4 דקות</span>
//           </div>
//         </div>
//       </aside>

//       {/* 2. אזור התוכן המרכזי */}
//       <main className="flex-grow p-6 md:p-8 overflow-y-auto">
        
//         {/* כותרת העמוד */}
//         <div className="mb-8">
//           <h1 className="text-2xl font-bold text-white">דשבורד תקציב — רבעון 2, 2026</h1>
//           <p className="text-sm text-slate-400 mt-1">נתונים מעודכנים בזמן אמת</p>
//         </div>

//         {/* 3. רשת כרטיסי מדדים (KPI Grid) */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
//           <div className="bg-navy-900 border border-slate-800 p-5 rounded-2xl">
//             <div className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">💰 תקציב מאושר</div>
//             <div className="text-2xl font-bold text-slate-100">₪{summary.totalBudget.toLocaleString()}</div>
//             <div className="text-[11px] text-slate-500 mt-1">מסגרת רבעונית מאושרת</div>
//           </div>

//           <div className="bg-navy-900 border border-slate-800 p-5 rounded-2xl">
//             <div className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">📉 ניצול בפועל</div>
//             <div className="text-2xl font-bold text-slate-100">₪{summary.totalSpent.toLocaleString()}</div>
//             <div className="text-[11px] text-slate-500 mt-1">
//               {Math.round((summary.totalSpent / summary.totalBudget) * 100)}% מתוך הסך הכולל
//             </div>
//           </div>

//           {/* כרטיס אזהרה מלא - Burn Rate */}
//           <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl">
//             <div className="text-xs text-amber-400 font-medium mb-2 flex items-center gap-1.5">🔥 Burn Rate</div>
//             <div className="text-2xl font-bold text-amber-400">{summary.burnRateDaysRemaining} ימים</div>
//             <div className="text-[11px] text-amber-500/80 mt-1">עד אזילת התקציב ({summary.daysTotalRemaining} נותרו)</div>
//           </div>

//           {/* כרטיס התראה מלא - חסימות נזק */}
//           <div className="bg-red-500/10 border border-red-500/30 p-5 rounded-2xl">
//             <div className="text-xs text-red-400 font-medium mb-2 flex items-center gap-1.5">🛡️ חסימות אקטיביות</div>
//             <div className="text-2xl font-bold text-red-400">₪{summary.blockedAmount.toLocaleString()}</div>
//             <div className="text-[11px] text-red-500/80 mt-1">{summary.blockedCount} ניסיונות חריגה נבלמו</div>
//           </div>

//         </div>

//         {/* 4. הגוף המרכזי ברשת דינמית (Responsive Body Grid) */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
//           {/* הטור הימני הרחב (מחלקות ולוג תנועות) - תופס 2 טורים במסך גדול */}
//           <div className="lg:col-span-2 space-y-6">
            
//             {/* טבלת ניצול תקציב מחלקתי */}
//             <div className="bg-navy-900 border border-slate-800 p-6 rounded-2xl">
//               <h2 className="text-sm font-bold text-slate-200 mb-6 flex items-center gap-2">🏢 ניצול תקציב מחלקתי</h2>
//               <div className="space-y-5">
//                 {departments.map((dept) => {
//                   const pct = Math.round((dept.spent / dept.allocated) * 100);
//                   const colors = getDepartmentStatusColor(dept.spent, dept.allocated);
                  
//                   return (
//                     <div key={dept.id} className="space-y-2">
//                       <div className="flex justify-between text-xs font-medium">
//                         <span className="text-slate-300">{dept.name}</span>
//                         <span className={colors.text}>{pct}%</span>
//                       </div>
//                       <div className="flex justify-between text-[11px] text-slate-500">
//                         <span>₪{dept.spent.toLocaleString()} / ₪{dept.allocated.toLocaleString()}</span>
//                       </div>
//                       <div className="w-full h-2 bg-navy-950 rounded-full overflow-hidden">
//                         <div className={`h-full rounded-full transition-all duration-500 ${colors.bar}`} style={{ width: `${pct}%` }}></div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* לוג תנועות אחרונות */}
//             <div className="bg-navy-900 border border-slate-800 p-6 rounded-2xl overflow-x-auto">
//               <h2 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">📜 לוג תנועות אחרונות (Real-time)</h2>
//               <table className="w-full text-right text-xs">
//                 <thead>
//                   <tr className="text-slate-500 border-b border-slate-800">
//                     <th className="pb-3 font-medium">תאריך</th>
//                     <th className="pb-3 font-medium">מחלקה</th>
//                     <th className="pb-3 font-medium">סכום</th>
//                     <th className="pb-3 font-medium">תיאור</th>
//                     <th className="pb-3 font-medium text-center">סטטוס</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-800/50">
//                   {transactions.map((tx) => (
//                     <tr key={tx.id} className="text-slate-300">
//                       <td className="py-3.5">{new Date(tx.createdAt).toLocaleDateString('he-IL', {month: '2-digit', day: '2-digit'})}</td>
//                       <td className="py-3.5 font-medium text-white">{tx.departmentName}</td>
//                       <td className="py-3.5">₪{tx.amount.toLocaleString()}</td>
//                       <td className="py-3.5 text-slate-400">{tx.description}</td>
//                       <td className="py-3.5 text-center">
//                         {tx.status === 'approved' ? (
//                           <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
//                             ✓ אושר
//                           </span>
//                         ) : (
//                           <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400">
//                             ✕ נחסם
//                           </span>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//           </div>

//           {/* הטור השמאלי (Top Offenders) - תופס טור 1 */}
//           <div className="space-y-6">
//             <div className="bg-navy-900 border border-slate-800 p-6 rounded-2xl">
//               <h2 className="text-sm font-bold text-red-400 mb-4 flex items-center gap-2">⚠️ חסימות גדולות (Top Offenders)</h2>
//               <div className="space-y-3">
//                 {sortedOffenders.map((offender) => (
//                   <div key={offender.id} className="bg-navy-950 border border-slate-800/80 p-4 rounded-xl space-y-2">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <div className="text-xs font-bold text-white">{offender.departmentName}</div>
//                         <div className="text-[10px] text-slate-500 mt-0.5">{offender.description}</div>
//                       </div>
//                     <div className="text-sm font-bold text-red-400">₪{(offender.amount || 0).toLocaleString()}</div>                
//                 </div>
//                     <div className="text-[11px] text-slate-400 bg-navy-900 px-2.5 py-1.5 rounded-lg border border-slate-800/40 flex items-center gap-1.5">
//                       <span>ℹ️</span> {offender.blockedReason}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//         </div>

//       </main>
//     </div>
//   );
// }

// export default DashboardPage;