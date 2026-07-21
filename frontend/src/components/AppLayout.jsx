import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../services/authService';

function AppLayout({ profile, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = profile?.role === 'admin';
  const isManager = profile?.role === 'manager';

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  function isActive(path) {
    return location.pathname === path;
  }

  const navItem = (path, icon, label, visible = true) =>
    visible && (
      <button
        onClick={() => navigate(path)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
          isActive(path)
            ? 'text-gold-400 bg-navy-800/60 border-r-2 border-gold-500'
            : 'text-slate-400 hover:bg-navy-800/40 hover:text-slate-200'
        }`}
      >
        <span>{icon}</span> {label}
      </button>
    );

  return (
    <div className="flex min-h-screen bg-navy-950 text-slate-100 font-sans" dir="rtl">
      <aside className="w-64 bg-navy-900 border-l border-slate-800 flex flex-col justify-between py-6 hidden md:flex">
        <div>
          <div className="px-6 pb-6 border-b border-slate-800 mb-6">
            <div className="text-xl font-black tracking-wider text-gold-500">CapitAll</div>
            <div className="text-xs text-slate-400 mt-1">{profile?.full_name}</div>
          </div>

          <nav className="space-y-1 px-3">
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">ראשי</span>
            {navItem('/dashboard', '📊', 'דשבורד')}
            {navItem('/transactions', '📜', 'תנועות')}
            {navItem('/reports', '📈', 'דוחות')}

            {(isAdmin || isManager) && (
              <>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 pt-6 mb-2">ניהול</span>
                {navItem('/approvals', '🛡️', 'אישורים')}
                {navItem('/suppliers', '🏭', 'ספקים')}
                {isAdmin && navItem('/departments', '🏢', 'מחלקות')}
                {isAdmin && navItem('/settings', '⚙️', 'הגדרות')}
              </>
            )}
          </nav>
        </div>

        <div className="px-4">
          <button onClick={handleLogout} className="text-xs text-slate-500 hover:text-red-400 px-3 py-2">
            🚪 התנתקות
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Top navbar - קבוע בראש כל דף */}
        <header className="h-16 border-b border-slate-800 bg-navy-900/50 flex items-center justify-between px-6">
          <div className="text-sm text-slate-400">
            {profile?.role === 'admin' && '👑 מנהל מערכת'}
            {profile?.role === 'manager' && '🧑‍💼 מנהל מחלקה'}
            {profile?.role === 'employee' && '👤 עובד'}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 text-xs font-bold">
              {profile?.full_name?.[0] || '?'}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;