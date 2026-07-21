import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage'; 
import PendingApprovalPage from './pages/PendingApprovalPage';
import OnboardingPage from './pages/OnboardingPage';
import { ProtectedRoute } from './components/ProtectedRoute'; 
import ApprovalsPage from './pages/ApprovalsPage';
import SignUpPage from './pages/SignUpPage';
import DepartmentsPage from './pages/DepartmentsPage';
import SuppliersPage from './pages/SuppliersPage';
import TransactionsPage from './pages/TransactionsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/approvals" element={ <ProtectedRoute requiredRole="admin"><ApprovalsPage /></ProtectedRoute> } />
        <Route path="/pending-approval" element={<PendingApprovalPage />} />
        <Route path="/dashboard" element={ <ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/suppliers" element={<ProtectedRoute><SuppliersPage /></ProtectedRoute>} />
        <Route path="/transactions" element={ <ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        <Route path="/settings" element={ <ProtectedRoute requiredRole="admin"><SettingsPage /></ProtectedRoute>} />
        <Route path="/departments" element={ <ProtectedRoute requiredRole="admin"><DepartmentsPage /></ProtectedRoute>} />
        <Route path="*" element={<div className="p-8 text-center">העמוד לא נמצא.</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;