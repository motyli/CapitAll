import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-navy-950 font-sans text-white flex flex-col">
      
      {/* 0. הדר וניווט (Navbar) */}
      <header className="border-b border-slate-800 bg-navy-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-wider text-gold-500">CapitAll</span>
          </div>
          <nav className="flex items-center gap-6">
            <button className="text-sm font-medium text-slate-300 hover:text-gold-400 transition-colors">
              אודות
            </button>
            <button className="text-sm font-medium text-slate-300 hover:text-gold-400 transition-colors">
              פיצ'רים
            </button>
            <button 
  onClick={() => navigate('/login')}
  className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-transparent border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-navy-950 transition-all duration-200 shadow-sm"
>
  כניסה כמשתמש
</button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        
        {/* 1. אודות התוכנה וקריאה לפעולה (Hero Section) */}
        <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/10 blur-[120px] rounded-full pointer-events-none"></div>
          
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-gold-500/10 text-gold-500 mb-6 border border-gold-500/20">
            הדור הבא של ניהול המשאבים
          </span>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.15] mb-6">
            אכיפת תקציב חכמה וסנכרון <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">בזמן אמת</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            CapitAll מעניקה למנהלי כספים וראשי מחלקות שליטה מוחלטת על הוצאות הארגון, מניעת חריגות אוטומטית, וסנכרון מלא מול מערכות ה-ERP הארגוניות.
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={() => navigate('/onboarding')} className="px-8 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 hover:from-gold-400 hover:to-gold-500 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg shadow-gold-500/20">
              התחל ניסיון חינם
            </button>
          </div>
        </section>

        {/* 2. דוגמאות לשימוש יומיומי (Use Cases / Features) */}
        <section className="bg-navy-900/40 py-24 border-t border-b border-slate-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">איך זה עובד ביום-יום?</h2>
              <p className="text-slate-400 max-w-xl mx-auto">כלי תפעולי חד שמחליף טבלאות אקסל מיושנות במערכת חוקים אקטיבית.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* כרטיס 1 */}
              <div className="p-8 rounded-2xl bg-navy-900 border border-slate-800 hover:border-gold-500/30 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500 mb-6 group-hover:bg-gold-500 group-hover:text-navy-950 transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-100">בלימת חריגות תקציב</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  עובד מנסה להזין הוצאה שמחלקתו לא הוסמכה לה? המערכת מזהה את החריגה ומקפיצה חסימה מיידית עוד לפני שהכסף יצא.
                </p>
              </div>

              {/* כרטיס 2 */}
              <div className="p-8 rounded-2xl bg-navy-900 border border-slate-800 hover:border-gold-500/30 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500 mb-6 group-hover:bg-gold-500 group-hover:text-navy-950 transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.213 6H16"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-100">סנכרון אוטומטי ל-ERP</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  תנועות פיננסיות שאושרו זורמות ישירות למערכת החשבונאות המרכזית דרך אוטומציות מובנות, ללא צורך בהקלדה ידנית כפולה.
                </p>
              </div>

              {/* כרטיס 3 */}
              <div className="p-8 rounded-2xl bg-navy-900 border border-slate-800 hover:border-gold-500/30 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500 mb-6 group-hover:bg-gold-500 group-hover:text-navy-950 transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-100">תמונת מצב למנהלים</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  צפייה בזמן אמת באחוזי הניצול של כל מחלקה ומחלקה דרך גרפים נקיים, המאפשרים קבלת החלטות מבוססת נתונים קשיחים.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. לקוחות מרוצים (Testimonials) */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">שותפים להצלחה</h2>
            <p className="text-slate-400 max-w-xl mx-auto">חברות ומנהלי כספים שכבר עברו לניהול משאבים חכם.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-8 rounded-2xl bg-gradient-to-b from-navy-900 to-navy-950 border border-slate-800 relative">
              <span className="text-6xl text-gold-500/10 absolute top-4 right-4 font-serif">"</span>
              <p className="text-slate-300 mb-6 italic relative z-10 text-sm leading-relaxed">
                "המעבר ל-CapitAll חסך לנו עשרות שעות עבודה חודשיות על רדיפה אחרי אישורי תקציב. המערכת פשוט לא מאפשרת לחרוג מהיעדים שהגדרנו מראש."
              </p>
              <div>
                <h4 className="font-bold text-gold-400 text-sm">ארנון לוי</h4>
                <span className="text-xs text-slate-300">סמנכ״ל כספים, פינטק ישראל</span>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-b from-navy-900 to-navy-950 border border-slate-800 relative">
              <span className="text-6xl text-gold-500/10 absolute top-4 right-4 font-serif">"</span>
              <p className="text-slate-300 mb-6 italic relative z-10 text-sm leading-relaxed">
                "היכולת לראות בכל רגע נתון כמה כסף נשאר לכל מחלקה פתרה לנו את בעיית הפתעות סוף הרבעון. כלי חובה לכל ארגון בצמיחה."
              </p>
              <div>
                <h4 className="font-bold text-gold-400 text-sm">מיכל כהן</h4>
                <span className="text-xs text-slate-300">מנהלת אופרציה, טק-גלובל</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* 4. פוטר (Footer) */}
      <footer className="border-t border-slate-500 bg-navy-850 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <div>
            &copy; {new Date().getFullYear()} CapitAll. כל הזכויות שמורות.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-500 transition-colors">תנאי שימוש</a>
            <a href="#" className="hover:text-slate-500 transition-colors">מדיניות פרטיות</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;