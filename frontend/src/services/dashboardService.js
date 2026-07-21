import { supabase } from '../config/supabaseClient';

export async function fetchDashboardData(profile) {
  const [
    { data: departments, error: deptError },
    { data: recentTransactions, error: txError },
    { data: blockedAttempts, error: blockedError },
  ] = await Promise.all([
    supabase.from('departments').select('id, name, allocated_budget, current_spent'),
    supabase
      .from('transactions')
      .select('id, amount, description, status, created_at, department_id, departments(name)')
      .order('created_at', { ascending: false })
      .limit(10),
    // הערה: audit_logs מוגבל כרגע ב-RLS ל-admin בלבד.
    // עבור manager/employee השאילתה תחזור ריקה (לא שגיאה) - זה תקין, לא באג.
    supabase
      .from('audit_logs')
      .select('id, details, created_at')
      .eq('action', 'BLOCKED_ATTEMPT')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  if (deptError) throw deptError;
  if (txError) throw txError;
  // לא זורקים שגיאה על blockedError אם היא נובעת מחוסר הרשאה (RLS) - זה מצב תקין למי שאינו admin
  if (blockedError && blockedError.code !== 'PGRST301' && blockedError.code !== '42501') {
    throw blockedError;
  }

  const safeBlockedAttempts = blockedAttempts || [];

  const totalBudget = departments.reduce((sum, d) => sum + Number(d.allocated_budget), 0);
  const totalSpent = departments.reduce((sum, d) => sum + Number(d.current_spent), 0);

  const deptNameById = Object.fromEntries(departments.map((d) => [d.id, d.name]));

  const topOffenders = safeBlockedAttempts.map((log) => ({
    id: log.id,
    departmentName: deptNameById[log.details?.department_id] || 'לא ידוע',
    amount: log.details?.requested_amount,
    blockedReason: log.details?.reason,
    description: 'ניסיון חריגה נחסם',
  }));

  // קביעת תיאור ה-scope לצורך תצוגה בממשק (לא לצורך אבטחה - זו כבר אחריות ה-RLS)
  let viewScope = 'company'; // admin
  let viewScopeLabel = 'ניתוח כללי לכל החברה';

  if (profile?.role === 'manager') {
    if (profile.scope_type === 'department' && profile.department_id) {
      viewScope = 'department';
      viewScopeLabel = `ניתוח למחלקת ${deptNameById[profile.department_id] || ''}`;
    } else if (profile.scope_type === 'company') {
      viewScope = 'company';
      viewScopeLabel = 'ניתוח כללי לכל החברה (מנהל כללי)';
    }
  } else if (profile?.role === 'employee') {
    viewScope = 'self';
    viewScopeLabel = 'התנועות שלי בלבד';
  }

  return {
    summary: {
      totalBudget,
      totalSpent,
      blockedAmount: topOffenders.reduce((sum, o) => sum + (o.amount || 0), 0),
      blockedCount: topOffenders.length,
      burnRateDaysRemaining: null,
      daysTotalRemaining: null,
    },
    departments: departments.map((d) => ({
      id: d.id,
      name: d.name,
      spent: Number(d.current_spent),
      allocated: Number(d.allocated_budget),
    })),
    topOffenders,
    transactions: recentTransactions.map((tx) => ({
      id: tx.id,
      createdAt: tx.created_at,
      departmentName: tx.departments?.name || 'לא ידוע',
      amount: Number(tx.amount),
      description: tx.description,
      status: tx.status,
    })),
    viewScope,
    viewScopeLabel,
  };
}