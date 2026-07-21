import { supabase } from '../config/supabaseClient';

export async function fetchSuppliers() {
  const { data, error } = await supabase
    .from('suppliers')
    .select('id, name, tax_id, phone, email, address, created_at')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function createSupplier({ name, taxId, phone, email, address, companyId }) {
  const { data, error } = await supabase
    .from('suppliers')
    .insert({
      name,
      tax_id: taxId || null,
      phone: phone || null,
      email: email || null,
      address: address || null,
      company_id: companyId,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateSupplier(id, { name, taxId, phone, email, address }) {
  const { error } = await supabase
    .from('suppliers')
    .update({
      name,
      tax_id: taxId || null,
      phone: phone || null,
      email: email || null,
      address: address || null,
    })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteSupplier(id) {
  const { error } = await supabase
    .from('suppliers')
    .delete()
    .eq('id', id);
  if (error) throw error;
}