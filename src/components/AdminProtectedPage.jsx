'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ROLES } from '@/constants/roles';
import '@/styles/AuthPages.css';

/**
 * AdminProtectedPage
 *
 * Guards admin routes with two layers:
 *   1. Authentication check — redirects to /login if not logged in.
 *   2. Role check — redirects to / if authenticated but not admin.
 *
 * Children are only rendered when BOTH accessToken AND user (with admin role)
 * are confirmed. This prevents API hooks from firing before the module-level
 * _accessToken (in authApi.js) is reliably set.
 *
 * The API provides a third layer (protect + restrictTo('admin')),
 * so this is defence-in-depth, not the only check.
 */
export default function AdminProtectedPage({ children }) {
  const { accessToken, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!accessToken) {
      router.replace('/login');
      return;
    }
    if (user && user.role !== ROLES.ADMIN) {
      router.replace('/');
    }
  }, [accessToken, user, loading, router]);

  // Show spinner while auth is initialising
  if (loading) {
    return (
      <div className="auth-spinner-wrapper" role="status" aria-label="Loading admin panel">
        <div className="auth-spinner" />
      </div>
    );
  }

  // Require BOTH accessToken AND a confirmed admin user before rendering.
  // If user is null (e.g. authGetMe still in-flight) we show nothing —
  // the loading spinner above already covers that transition.
  if (!accessToken || !user || user.role !== ROLES.ADMIN) {
    return null;
  }

  return children;
}

