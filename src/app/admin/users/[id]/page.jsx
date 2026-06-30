'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AdminProtectedPage from '@/components/AdminProtectedPage';
import AdminHeader from '@/components/admin/AdminHeader';
import UserDetailCard from '@/components/admin/users/UserDetailCard';
import UserActionsMenu from '@/components/admin/users/UserActionsMenu';
import SessionTable from '@/components/admin/sessions/SessionTable';
import useAdminUserDetail from '@/hooks/admin/useAdminUserDetail';

export default function AdminUserDetailPage({ params }) {
  const { id } = use(params);
  const { data, loading, error, refetch } = useAdminUserDetail(id);
  const [feedback, setFeedback] = useState(null);
  const [feedbackType, setFeedbackType] = useState('success');

  const [sessions, setSessions] = useState(null);

  // Sync sessions from fetched data
  const activeSessions = sessions ?? data?.activeSessions ?? [];

  const handleSuccess = (msg) => {
    setFeedback(msg);
    setFeedbackType('success');
    refetch();
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleError = (msg) => {
    setFeedback(msg);
    setFeedbackType('error');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSessionRevoked = (sessionId) => {
    setSessions(prev => (prev ?? activeSessions).filter(s => s.id !== sessionId));
  };

  return (
    <AdminProtectedPage>
      <AdminHeader title="User Detail" />
      <main className="admin-content">
        <Link href="/admin/users" className="admin-back-link">
          <ArrowLeft size={14} /> Back to Users
        </Link>

        {error && (
          <div className="admin-error-banner" role="alert">⚠️ {error}</div>
        )}

        {feedback && (
          <div
            className="admin-error-banner"
            style={feedbackType === 'success'
              ? { background: 'var(--success-bg)', borderColor: 'var(--success-border)', color: 'var(--success-text)' }
              : {}}
            role="status"
          >
            {feedbackType === 'success' ? '✅' : '⚠️'} {feedback}
          </div>
        )}

        {loading ? (
          <div className="admin-loading">
            <div className="admin-spinner" />
            <span>Loading user…</span>
          </div>
        ) : data?.user ? (
          <>
            <div className="admin-page-header">
              <div>
                <h1 className="admin-page-title">{data.user.name}</h1>
                <p className="admin-page-subtitle">{data.user.email}</p>
              </div>
            </div>

            <UserDetailCard user={data.user} stats={data.stats} />

            <div className="admin-detail-card" style={{ marginBottom: 24 }}>
              <div className="admin-detail-card-title">Admin Actions</div>
              <UserActionsMenu
                targetUser={data.user}
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </div>

            {activeSessions.length > 0 && (
              <div className="admin-table-card">
                <div style={{ padding: '16px 16px 0' }}>
                  <div className="admin-chart-title">Active Sessions ({activeSessions.length})</div>
                </div>
                <SessionTable
                  sessions={activeSessions}
                  onRevoked={handleSessionRevoked}
                />
              </div>
            )}
          </>
        ) : (
          <div className="admin-empty">
            <div className="admin-empty-icon">👤</div>
            <div className="admin-empty-title">User not found</div>
          </div>
        )}
      </main>
    </AdminProtectedPage>
  );
}
