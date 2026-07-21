import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerAndSetupCompany } from '../services/onboardingService';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    companyName: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    // ולידציה בסיסית צד לקוח
    if (!formData.email || !formData.password || !formData.fullName || !formData.companyName) {
      setErrorMessage('כל השדות חובה לצורך הקמת החשבון והחברה.');
      setLoading(false);
      return;
    }

    try {
      const result = await registerAndSetupCompany(formData);

      if (result?.isPendingConfirmation) {
        setErrorMessage('החשבון נוצר בהצלחה. אנא אמת את כתובת האימייל שלך לפני הכניסה לדשבורד.');
        return;
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Onboarding error:', err);
      setErrorMessage(err instanceof Error ? err.message : 'התרחשה שגיאה בתהליך ההקמה.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans" dir="rtl">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">התחל את תקופת הניסיון שלך</h2>
        <p className="mt-2 text-center text-sm text-gray-600">הקם את הארגון שלך בתוך פחות מדקה</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {errorMessage && (
            <div className="mb-4 bg-red-50 border-r-4 border-red-400 p-4 rounded text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* חלק א': פרטי המשתמש */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-md font-medium text-gray-700 mb-3">1. פרטי מנהל המערכת</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">שם מלא</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-right"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm  font-medium text-gray-700">כתובת אימייל</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-left"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">סיסמה</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 block w-full text-gray-700 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-left"
                    required
                  />
                </div>
              </div>
            </div>

            {/* חלק ב': פרטי החברה */}
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-3">2. פרטי החברה / הארגון</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">שם החברה</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-right"
                  placeholder="לדוגמה: קפיטול בע''מ"
                  required
                />
              </div>
            </div>

            {/* לחצן שליחה */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'מקים מערכת...' : 'צור חשבון וכנס לדשבורד'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}