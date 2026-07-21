import { createClient } from '@supabase/supabase-js';

export const withSupabaseAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized: Missing Authorization Token' });
  }

  // יצירת קליינט מבודד לטווח הבקשה הנוכחית (Request-scoped) עם ה-JWT של היוזר
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      global: { headers: { Authorization: authHeader } }
    }
  );

  // הזרקת הקליינט לאובייקט ה-request כדי שכל הקונטרולרים הבאים ייגשו אליו
  req.supabase = supabase;
  
  next();
};
