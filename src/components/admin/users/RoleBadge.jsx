'use client';

/** RoleBadge — renders a styled pill for 'admin' or 'user' role */
export default function RoleBadge({ role }) {
  return (
    <span className={`admin-role-badge ${role}`}>
      {role === 'admin' ? '🛡 Admin' : '👤 User'}
    </span>
  );
}
