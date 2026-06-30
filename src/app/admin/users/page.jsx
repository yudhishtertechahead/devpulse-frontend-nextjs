'use client';

import AdminProtectedPage from '@/components/AdminProtectedPage';
import AdminHeader from '@/components/admin/AdminHeader';
import UserTable from '@/components/admin/users/UserTable';
import UserFilters from '@/components/admin/users/UserFilters';
import useAdminUsers from '@/hooks/admin/useAdminUsers';

function Pagination({ pagination, onPage }) {
  if (!pagination || pagination.totalPages <= 1) return null;
  const { page, totalPages, total, limit } = pagination;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="admin-pagination">
      <span className="admin-pagination-info">
        Showing {from}–{to} of {total} users
      </span>
      <div className="admin-pagination-btns">
        <button
          className="admin-pagination-btn"
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          id="users-prev-page"
        >
          ← Prev
        </button>
        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
          const p = i + 1;
          return (
            <button
              key={p}
              className={`admin-pagination-btn${p === page ? ' active' : ''}`}
              onClick={() => onPage(p)}
              id={`users-page-${p}`}
            >
              {p}
            </button>
          );
        })}
        <button
          className="admin-pagination-btn"
          onClick={() => onPage(page + 1)}
          disabled={page >= totalPages}
          id="users-next-page"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const { data, loading, error, params, updateParams, refetch } = useAdminUsers();

  return (
    <AdminProtectedPage>
      <AdminHeader title="User Management" />
      <main className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Users</h1>
            <p className="admin-page-subtitle">Manage DevPulse accounts</p>
          </div>
          <button className="admin-btn admin-btn-ghost" onClick={refetch} id="users-refresh-btn">
            ↻ Refresh
          </button>
        </div>

        <UserFilters params={params} onUpdate={updateParams} />

        {error && (
          <div className="admin-error-banner" role="alert">⚠️ {error}</div>
        )}

        <div className="admin-table-card">
          {loading ? (
            <div className="admin-loading">
              <div className="admin-spinner" />
              <span>Loading users…</span>
            </div>
          ) : (
            <>
              <UserTable users={data?.users ?? []} />
              <Pagination
                pagination={data?.pagination}
                onPage={(p) => updateParams({ page: p })}
              />
            </>
          )}
        </div>
      </main>
    </AdminProtectedPage>
  );
}
