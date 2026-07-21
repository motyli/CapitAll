import React from 'react';
import { logout } from '../services/authService';
import { useNavigate } from 'react-router-dom';

function PendingApprovalPage() {
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-950 text-center px-6" dir="rtl">
      <div>
        <div className="text-2xl mb-4">⏳</div>
        <h1 className="text-lg font-bold text-slate-100 mb-2">החשבון שלך ממתין לאישור</h1>
        <p className="text-sm text-slate-400 mb-6">מנהל המערכת בארגון שלך צריך לאשר את הצטרפותך לפני שתוכל להיכנס.</p>
        <button
          onClick={handleLogout}
          className="text-xs text-slate-500 underline hover:text-slate-300"
        >
          התנתקות
        </button>
      </div>
    </div>
  );
}

export default PendingApprovalPage;