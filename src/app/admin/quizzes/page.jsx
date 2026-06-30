'use client';

import AdminProtectedPage from '@/components/AdminProtectedPage';
import AdminHeader from '@/components/admin/AdminHeader';
import { PlatformQuizStats } from '@/components/admin/quizzes/PlatformQuizStats';
import RecentQuizzesTable from '@/components/admin/quizzes/RecentQuizzesTable';
import useAdminQuizStats from '@/hooks/admin/useAdminQuizStats';

export default function AdminQuizzesPage() {
  const { data, recentQuizzes, loading, error, refetch } = useAdminQuizStats();

  return (
    <AdminProtectedPage>
      <AdminHeader title="Quiz Analytics" />
      <main className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Platform Quiz Analytics</h1>
            <p className="admin-page-subtitle">Stats, leaderboard, and recent activity across all users</p>
          </div>
          <button className="admin-btn admin-btn-ghost" onClick={refetch} id="quizzes-refresh-btn">
            ↻ Refresh
          </button>
        </div>

        {error && <div className="admin-error-banner" role="alert">⚠️ {error}</div>}

        {loading ? (
          <div className="admin-loading">
            <div className="admin-spinner" />
            <span>Loading quiz data…</span>
          </div>
        ) : (
          <>
            <PlatformQuizStats
              summary={data?.summary}
              byDifficulty={data?.byDifficulty}
              leaderboard={data?.leaderboard}
            />

            <div className="admin-table-card" style={{ marginTop: 28 }}>
              <div style={{ padding: '16px 16px 0' }}>
                <div className="admin-chart-title">📝 Recent Submissions (last 50)</div>
              </div>
              <RecentQuizzesTable quizzes={recentQuizzes} />
            </div>
          </>
        )}
      </main>
    </AdminProtectedPage>
  );
}
