import { supabase } from '../config/supabaseClient';

export async function getCompanyInviteCode(companyId) {
  const { data, error } = await supabase
    .from('companies')
    .select('company_code')
    .eq('id', companyId)
    .single();
  if (error) throw error;
  return data.company_code;
}