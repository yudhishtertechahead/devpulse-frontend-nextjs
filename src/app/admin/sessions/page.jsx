'use client';

import { useState } from 'react';
import AdminProtectedPage from '@/components/AdminProtectedPage';
import AdminHeader from '@/components/admin/AdminHeader';
import SessionTable from '@/components/admin/sessions/SessionTable';
import useAdminSessions from '@/hooks/admin/useAdminSessions';
import { Search } from 'lucide-react';

function Pagination({ pagination, onPage }) {
  if (!pagination || pagination.totalPages <= 1) return null;
  const { page, totalPages, total, limit } = pagination;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="admin-pagination">
      <span className="admin-pagination-info">Showing {from}–{to} of {total} sessions</span>
      <div className="admin-pagination-btns">
        <button
          className="admin-pagination-btn"
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          id="sessions-prev-page"
        >← Prev</button>
        <button
          className="admin-pagination-btn"
          onClick={() => onPage(page + 1)}
          disabled={page >= totalPages}
          id="sessions-next-page"
        >Next →</button>
      </div>
    </div>
  );
}

export default function AdminSessionsPage() {
  const { data, loading, error, params, updateParams, refetch } = useAdminSessions();
  const [localSessions, setLocalSessions] = useState(null);
  const sessions = localSessions ?? data?.sessions ?? [];

  const handleRevoked = (sessionId) => {
    setLocalSessions(prev => (prev ?? data?.sessions ?? []).filter(s => s.id !== sessionId));
  };

  return (
    <AdminProtectedPage>
      <AdminHeader title="Session Management" />
      <main className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Active Sessions</h1>
            <p className="admin-page-subtitle">All live sessions across all users</p>
          </div>
          <button className="admin-btn admin-btn-ghost" onClick={() => { setLocalSessions(null); refetch(); }} id="sessions-refresh-btn">
            ↻ Refresh
          </button>
        </div>

        {/* Search */}
        <div className="admin-filters">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              type="search"
              placeholder="Search by user email or name…"
              defaultValue={params.search || ''}
              onKeyDown={e => e.key === 'Enter' && updateParams({ search: e.target.value })}
              onBlur={e => updateParams({ search: e.target.value })}
              className="admin-filter-input"
              style={{ paddingLeft: 32 }}
              id="sessions-search"
              aria-label="Search sessions"
            />
          </div>
        </div>

        {error && <div className="admin-error-banner" role="alert">⚠️ {error}</div>}

        <div className="admin-table-card">
          {loading ? (
            <div className="admin-loading">
              <div className="admin-spinner" />
              <span>Loading sessions…</span>
            </div>
          ) : (
            <>
              <SessionTable sessions={sessions} onRevoked={handleRevoked} />
              <Pagination
                pagination={data?.pagination}
                onPage={p => { setLocalSessions(null); updateParams({ page: p }); }}
              />
            </>
          )}
        </div>
      </main>
    </AdminProtectedPage>
  );
}
