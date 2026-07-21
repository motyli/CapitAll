import React, { useEffect, useState } from 'react';
import EmployeeApprovalsCard from '../components/EmployeeApprovalsCard';
import TransactionApprovalsCard from '../components/TransactionApprovalsCard';
import { fetchPendingEmployees, fetchDepartmentsForAssignment } from '../services/approvalsService';
import { fetchPendingTransactions } from '../services/transactionApprovalsService';

function ApprovalsPage() {
  const [pendingEmployees, setPendingEmployees] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    setLoading(true);
    const [employees, transactions, depts] = await Promise.all([
      fetchPendingEmployees(),
      fetchPendingTransactions(),
      fetchDepartmentsForAssignment(),
    ]);
    setPendingEmployees(employees);
    setPendingTransactions(transactions);
    setDepartments(depts);
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, []);

  if (loading) return <div className="p-8 text-slate-400" dir="rtl">טוען...</div>;

  return (
    <div className="p-8 bg-navy-950 min-h-screen space-y-10" dir="rtl">
      <h1 className="text-2xl font-bold text-white">מרכז אישורים</h1>

      <EmployeeApprovalsCard
        pendingEmployees={pendingEmployees}
        departments={departments}
        onChanged={loadAll}
      />

      <TransactionApprovalsCard
        pendingTransactions={pendingTransactions}
        onChanged={loadAll}
      />
    </div>
  );
}

export default ApprovalsPage;