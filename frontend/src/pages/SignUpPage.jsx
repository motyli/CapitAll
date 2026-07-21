import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';

function SignUpPage() {
  const [form, setForm] = useState({ email: '', password: '', fullName: '', companyCode: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.fullName,
            company_code: form.companyCode.trim().toUpperCase(),
          },
        },
      });
      if (error) throw error;
      navigate('/pending-approval');
    } catch (err) {
      setError(err.message?.includes('Invalid company invite code')
        ? 'קוד הארגון שהוזן אינו תקין'
        : 'אירעה שגיאה בהרשמה, נסה שוב');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-950" dir="rtl">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-navy-900 border border-slate-800 rounded-2xl p-8 space-y-5">
        <div className="text-center mb-6">
          <div className="text-2xl font-black tracking-wider text-gold-500">CapitAll</div>
          <div className="text-xs text-slate-400 mt-1">הצטרפות לארגון קיים</div>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl p-3">{error}</div>}

        <input placeholder="שם מלא" required value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          className="w-full bg-navy-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100" />

        <input type="email" placeholder="אימייל" required value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full bg-navy-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100" />

        <input type="password" placeholder="סיסמה" required value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full bg-navy-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100" />

        <input placeholder="קוד ארגון" required value={form.companyCode}
          onChange={(e) => setForm({ ...form, companyCode: e.target.value })}
          className="w-full bg-navy-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 uppercase" />

        <button type="submit" disabled={loading}
          className="w-full bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-navy-950 font-bold text-sm rounded-xl py-2.5">
          {loading ? 'נרשם...' : 'הרשמה'}
        </button>
      </form>
    </div>
  );
}

export default SignUpPage;