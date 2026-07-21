import { supabase } from '../config/supabaseClient';

export async function fetchDepartments() {
  const { data, error } = await supabase
    .from('departments')
    .select('id, name, allocated_budget, current_spent, created_at')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function createDepartment({ name, allocatedBudget, companyId }) {
  const { data, error } = await supabase
    .from('departments')
    .insert({ name, allocated_budget: allocatedBudget, company_id: companyId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateDepartment(id, { name, allocatedBudget }) {
  const { error } = await supabase
    .from('departments')
    .update({ name, allocated_budget: allocatedBudget })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteDepartment(id) {
  const { error } = await supabase
    .from('departments')
    .delete()
    .eq('id', id);
  if (error) throw error;
}