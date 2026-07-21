import { supabase } from '../config/supabaseClient';

export async function fetchPendingEmployees() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, created_at')
    .eq('status', 'pending_approval')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function approveEmployee(profileId, { role = 'employee', departmentId = null, scopeType = null } = {}) {
  const resolvedScopeType = scopeType || (departmentId ? 'department' : (role === 'manager' ? 'company' : 'department'));
  const { error } = await supabase
    .from('profiles')
    .update({ status: 'active', role, department_id: departmentId, scope_type: resolvedScopeType })
    .eq('id', profileId);
  if (error) throw error;
}

export async function rejectEmployee(profileId) {
  const { error } = await supabase
    .from('profiles')
    .update({ status: 'suspended' })
    .eq('id', profileId);
  if (error) throw error;
}

export async function fetchDepartmentsForAssignment() {
  const { data, error } = await supabase.from('departments').select('id, name');
  if (error) throw error;
  return data;
}