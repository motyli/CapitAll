import { supabase } from '../config/supabaseClient';

export async function uploadReceipt(file, companyId, transactionId) {
  const fileExt = file.name.split('.').pop();
  const filePath = `${companyId}/${transactionId}/${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from('receipts')
    .upload(filePath, file, { cacheControl: '3600', upsert: false });

  if (error) throw error;
  return filePath;
}

export async function getReceiptSignedUrl(filePath) {
  const { data, error } = await supabase.storage
    .from('receipts')
    .createSignedUrl(filePath, 60 * 5);
  if (error) throw error;
  return data.signedUrl;
}