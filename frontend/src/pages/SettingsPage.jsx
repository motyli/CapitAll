import React, { useEffect, useState } from 'react';
import { getCompanyInviteCode } from '../services/companyService';

function SettingsPage({ profile }) {
  const [inviteCode, setInviteCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (profile?.company_id) {
      getCompanyInviteCode(profile.company_id)
        .then(setInviteCode)
        .finally(() => setLoading(false));
    }
  }, [profile]);

  function handleCopy() {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="p-8 bg-navy-950 min-h-screen" dir="rtl">
      <h1 className="text-xl font-bold text-white mb-6">הגדרות ארגון</h1>

      <div className="bg-navy-900 border border-slate-800 rounded-2xl p-6 max-w-lg">
        <h2 className="text-sm font-bold text-slate-200 mb-2">קוד הזמנה לעובדים</h2>
        <p className="text-xs text-slate-500 mb-4">
          שתף קוד זה עם עובדים שברצונך להזמין לארגון. הם יזינו אותו במסך ההרשמה.
        </p>

        {loading ? (
          <div className="text-sm text-slate-500">טוען...</div>
        ) : (
          <div className="flex items-center gap-3">
            <code className="bg-navy-950 border border-slate-800 rounded-lg px-4 py-2.5 text-gold-400 font-mono text-lg tracking-widest flex-1 text-center">
              {inviteCode}
            </code>
            <button
              onClick={handleCopy}
              className="bg-gold-500 hover:bg-gold-600 text-navy-950 text-xs font-bold px-4 py-2.5 rounded-lg whitespace-nowrap"
            >
              {copied ? '✓ הועתק' : 'העתק'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SettingsPage;