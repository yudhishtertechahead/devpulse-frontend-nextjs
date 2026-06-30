'use client';

import { useState } from 'react';
import { UserX, UserCheck, Shield, LogOut } from 'lucide-react';
import { deactivateAdminUser, reactivateAdminUser, updateAdminUser, forceLogoutUser } from '@/lib/api/adminApi';
import useRole from '@/hooks/useRole';

/**
 * UserActionsMenu — action buttons on the user detail page.
 * Shows appropriate actions based on user's current state.
 */
export default function UserActionsMenu({ targetUser, onSuccess, onError }) {
  const [busy, setBusy] = useState(null);
  const { user: adminUser } = useRole();

  const isSelf = targetUser?.id === adminUser?.id;

  const run = async (action, fn) => {
    setBusy(action);
    try {
      await fn();
      onSuccess?.(`${action} successful`);
    } catch (err) {
      onError?.(err?.response?.data?.error || `${action} failed`);
    } finally {
      setBusy(null);
    }
  };

  const handleDeactivate = () =>
    run('Deactivate', () => deactivateAdminUser(targetUser.id));

  const handleReactivate = () =>
    run('Reactivate', () => reactivateAdminUser(targetUser.id));

  const handleRoleChange = () => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    run(`Role → ${newRole}`, () => updateAdminUser(targetUser.id, { role: newRole }));
  };

  const handleForceLogout = () =>
    run('Force logout', () => forceLogoutUser(targetUser.id));

  return (
    <div className="admin-user-actions-row">
      {targetUser?.is_active ? (
        <button
          className="admin-btn admin-btn-danger"
          onClick={handleDeactivate}
          disabled={!!busy || isSelf}
          title={isSelf ? 'Cannot deactivate your own account' : 'Deactivate account'}
          id={`deactivate-user-${targetUser.id}`}
        >
          <UserX size={14} />
          {busy === 'Deactivate' ? 'Deactivating…' : 'Deactivate'}
        </button>
      ) : (
        <button
          className="admin-btn admin-btn-success"
          onClick={handleReactivate}
          disabled={!!busy}
          id={`reactivate-user-${targetUser.id}`}
        >
          <UserCheck size={14} />
          {busy === 'Reactivate' ? 'Reactivating…' : 'Reactivate'}
        </button>
      )}

      <button
        className="admin-btn admin-btn-ghost"
        onClick={handleRoleChange}
        disabled={!!busy || isSelf}
        title={isSelf ? 'Cannot change your own role' : `Change to ${targetUser?.role === 'admin' ? 'user' : 'admin'}`}
        id={`change-role-user-${targetUser?.id}`}
      >
        <Shield size={14} />
        {busy?.startsWith('Role') ? 'Updating…' : `Make ${targetUser?.role === 'admin' ? 'User' : 'Admin'}`}
      </button>

      <button
        className="admin-btn admin-btn-ghost"
        onClick={handleForceLogout}
        disabled={!!busy}
        id={`force-logout-user-${targetUser?.id}`}
      >
        <LogOut size={14} />
        {busy === 'Force logout' ? 'Revoking…' : 'Force Logout'}
      </button>
    </div>
  );
}
