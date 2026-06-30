'use client';

import { useAuth } from '@/context/AuthContext';
import { ROLES } from '@/constants/roles';

/**
 * useRole — convenience hook for role-based rendering.
 *
 * Returns:
 *   role    — the raw role string ('user' | 'admin' | null)
 *   isAdmin — true if the authenticated user is an admin
 *   user    — the full user object from AuthContext
 */
export default function useRole() {
  const { user } = useAuth();
  const role = user?.role ?? null;

  return {
    role,
    isAdmin: role === ROLES.ADMIN,
    user,
  };
}
