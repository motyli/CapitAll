import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentProfile } from '../services/authService';
import AppLayout from './AppLayout';

export function ProtectedRoute({ children, requiredRole }) {
  const [profile, setProfile] = useState(undefined);

  useEffect(() => {
    let isMounted = true;
    getCurrentProfile()
      .then((p) => { if (isMounted) setProfile(p); })
      .catch(() => { if (isMounted) setProfile(null); });
    return () => { isMounted = false; };
  }, []);

  if (profile === undefined) {
    return <div className="min-h-screen flex items-center justify-center bg-navy-950 text-slate-400" dir="rtl">טוען...</div>;
  }
  if (profile === null) return <Navigate to="/login" replace />;
  if (profile.status === 'pending_approval') return <Navigate to="/pending-approval" replace />;
  if (profile.status === 'suspended') return <Navigate to="/login" replace />;
  if (requiredRole && profile.role !== requiredRole) return <Navigate to="/dashboard" replace />;

  return (
    <AppLayout profile={profile}>
      {React.cloneElement(children, { profile })}
    </AppLayout>
  );
}