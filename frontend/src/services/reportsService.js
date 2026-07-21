import { supabase } from '../config/supabaseClient';

export async function fetchSpendingByDepartment() {
  const { data, error } = await supabase
    .from('transactions')
    .select('amount, department_id, departments(name)')
    .eq('status', 'approved')
    .eq('type', 'expense');
  if (error) throw error;

  const grouped = {};
  for (const tx of data) {
    const key = tx.department_id;
    if (!grouped[key]) {
      grouped[key] = { departmentId: key, name: tx.departments?.name || 'לא ידוע', total: 0 };
    }
    grouped[key].total += Number(tx.amount);
  }
  return Object.values(grouped).sort((a, b) => b.total - a.total);
}

export async function fetchSpendingBySupplier() {
  const { data, error } = await supabase
    .from('transactions')
    .select('amount, supplier_id, suppliers(name)')
    .eq('status', 'approved')
    .eq('type', 'expense')
    .not('supplier_id', 'is', null);
  if (error) throw error;

  const grouped = {};
  for (const tx of data) {
    const key = tx.supplier_id;
    if (!grouped[key]) {
      grouped[key] = { supplierId: key, name: tx.suppliers?.name || 'לא ידוע', total: 0 };
    }
    grouped[key].total += Number(tx.amount);
  }
  return Object.values(grouped).sort((a, b) => b.total - a.total);
}

export async function fetchSpendingOverTime() {
  const { data, error } = await supabase
    .from('transactions')
    .select('amount, created_at')
    .eq('status', 'approved')
    .eq('type', 'expense')
    .order('created_at', { ascending: true });
  if (error) throw error;

  const grouped = {};
  for (const tx of data) {
    const monthKey = tx.created_at.slice(0, 7); // 'YYYY-MM'
    grouped[monthKey] = (grouped[monthKey] || 0) + Number(tx.amount);
  }
  return Object.entries(grouped).map(([month, total]) => ({ month, total }));
}