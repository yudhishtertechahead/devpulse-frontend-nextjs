'use client';

import Link from 'next/link';
import RoleBadge from './RoleBadge';

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function UserTable({ users = [] }) {
  if (users.length === 0) {
    return (
      <div className="admin-empty">
        <div className="admin-empty-icon">👥</div>
        <div className="admin-empty-title">No users found</div>
        <div className="admin-empty-desc">Try adjusting your search or filters.</div>
      </div>
    );
  }

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table" aria-label="Users table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Quizzes</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>
                <Link href={`/admin/users/${u.id}`} className="admin-table-link">
                  {u.name}
                </Link>
              </td>
              <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
              <td><RoleBadge role={u.role} /></td>
              <td>
                <span className={`admin-status-badge ${u.is_active ? 'active' : 'inactive'}`}>
                  {u.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>{u.quiz_count}</td>
              <td style={{ color: 'var(--text-secondary)' }}>{formatDate(u.created_at)}</td>
              <td>
                <Link href={`/admin/users/${u.id}`} className="admin-btn admin-btn-ghost admin-btn-sm">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
