import { supabase } from '../config/supabaseClient';

/**
 * מבצע רישום משתמש עם fallback אם Supabase מחזיר שגיאת DB על signup.
 */
export const registerAndSetupCompany = async ({ email, password, fullName, companyName }) => {
  if (!supabase) {
    throw new Error('Supabase client is not configured. Check your environment variables.');
  }

  const primaryPayload = {
    email,
    password,
    options: {
      data: {
        company_name: companyName,
        full_name: fullName,
      },
    },
  };

  try {
    const { data, error } = await supabase.auth.signUp(primaryPayload);

    if (!error) {
      const isPendingConfirmation = data.user && data.session === null;
      return {
        user: data.user,
        isPendingConfirmation,
      };
    }

    const message = error.message || 'Signup failed.';

    if (message.includes('Database error saving new user') || message.includes('unexpected_failure')) {
      const { data: fallbackData, error: fallbackError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (fallbackError) {
        throw new Error(fallbackError.message);
      }

      const isPendingConfirmation = fallbackData.user && fallbackData.session === null;
      return {
        user: fallbackData.user,
        isPendingConfirmation,
      };
    }

    throw new Error(message);
  } catch (error) {
    console.error('CRITICAL: Onboarding auth failure:', error);
    throw error;
  }
};