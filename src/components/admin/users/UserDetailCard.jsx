'use client';

import RoleBadge from './RoleBadge';

function fmt(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function UserDetailCard({ user, stats }) {
  return (
    <div className="admin-detail-grid">
      {/* Profile */}
      <div className="admin-detail-card">
        <div className="admin-detail-card-title">Profile</div>
        <div className="admin-detail-row">
          <span className="admin-detail-label">Name</span>
          <span className="admin-detail-value">{user.name}</span>
        </div>
        <div className="admin-detail-row">
          <span className="admin-detail-label">Email</span>
          <span className="admin-detail-value">{user.email}</span>
        </div>
        <div className="admin-detail-row">
          <span className="admin-detail-label">Role</span>
          <RoleBadge role={user.role} />
        </div>
        <div className="admin-detail-row">
          <span className="admin-detail-label">Status</span>
          <span className={`admin-status-badge ${user.is_active ? 'active' : 'inactive'}`}>
            {user.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className="admin-detail-row">
          <span className="admin-detail-label">Joined</span>
          <span className="admin-detail-value">{fmt(user.created_at)}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-detail-card">
        <div className="admin-detail-card-title">Activity</div>
        <div className="admin-detail-row">
          <span className="admin-detail-label">Total Quizzes</span>
          <span className="admin-detail-value">{stats?.quizCount ?? 0}</span>
        </div>
        <div className="admin-detail-row">
          <span className="admin-detail-label">Avg Score</span>
          <span className="admin-detail-value">{stats?.avgScorePct ?? 0}%</span>
        </div>
        <div className="admin-detail-row">
          <span className="admin-detail-label">Active Sessions</span>
          <span className="admin-detail-value">{stats?.activeSessionCount ?? 0}</span>
        </div>
      </div>
    </div>
  );
}
