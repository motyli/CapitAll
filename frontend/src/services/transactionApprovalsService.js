import { supabase } from '../config/supabaseClient';

export async function fetchPendingTransactions() {
  const { data, error } = await supabase
    .from('transactions')
    .select('id, amount, description, created_at, department_id, supplier_id, departments(name), suppliers(name), profile_id, profiles(full_name)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function decideTransaction(transactionId, decision) {
  // decision: 'approved' | 'rejected'
  const { error } = await supabase.rpc('approve_or_reject_transaction', {
    p_transaction_id: transactionId,
    p_decision: decision,
  });
  if (error) throw error;
}