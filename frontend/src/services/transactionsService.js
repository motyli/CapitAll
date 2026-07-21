import { supabase } from '../config/supabaseClient';

export async function createTransaction({
  companyId,
  departmentId,
  profileId,
  amount,
  type,
  description,
  supplierId = null,
  paymentMethod = null,
}) {
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      company_id: companyId,
      department_id: departmentId,
      profile_id: profileId,
      amount,
      type,
      description,
      supplier_id: supplierId,
      payment_method: paymentMethod,
    })
    .select()
    .single();

  if (error) {
    if (error.code === 'P0001' || error.message?.includes('Budget Exceeded')) {
      const { error: logError } = await supabase.from('audit_logs').insert({
        user_id: profileId,
        action: 'BLOCKED_ATTEMPT',
        table_name: 'transactions',
        details: { department_id: departmentId, requested_amount: amount, reason: error.message },
      });
      if (logError && logError.code !== '23505') {
        console.error('Failed to log blocked attempt:', logError);
      }
    }
    throw error;
  }

  return data;
}

export async function fetchTransactions({ limit = 50 } = {}) {
  const { data, error } = await supabase
    .from('transactions')
    .select('id, amount, type, description, status, created_at, department_id, supplier_id, departments(name), suppliers(name)')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function fetchTransactionsPage({ status = null, offset = 0, limit = 20 } = {}) {
  let query = supabase
    .from('transactions')
    .select('id, amount, type, description, status, created_at, department_id, supplier_id, departments(name), suppliers(name), profiles(full_name), payment_method, receipt_url', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { data, count };
}

export async function updateTransactionReceiptUrl(transactionId, filePath) {
  const { error } = await supabase
    .from('transactions')
    .update({ receipt_url: filePath })
    .eq('id', transactionId);
  if (error) throw error;
}