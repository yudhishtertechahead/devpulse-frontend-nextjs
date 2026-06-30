'use client';

import AdminProtectedPage from '@/components/AdminProtectedPage';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminStatsGrid from '@/components/admin/overview/AdminStatsGrid';
import SignupsTrendChart from '@/components/admin/overview/SignupsTrendChart';
import { QuizTrendChart, DifficultyPieChart } from '@/components/admin/overview/QuizActivityChart';
import useAdminOverview from '@/hooks/admin/useAdminOverview';

export default function AdminOverviewPage() {
  const { data, loading, error, refetch } = useAdminOverview();

  return (
    <AdminProtectedPage>
      <AdminHeader title="Overview" />
      <main className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Platform Overview</h1>
            <p className="admin-page-subtitle">Real-time operational metrics for DevPulse</p>
          </div>
          <button className="admin-btn admin-btn-ghost" onClick={refetch} id="overview-refresh-btn">
            ↻ Refresh
          </button>
        </div>

        {error && (
          <div className="admin-error-banner" role="alert">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="admin-loading" aria-label="Loading overview">
            <div className="admin-spinner" />
            <span>Loading platform data…</span>
          </div>
        ) : data ? (
          <>
            <AdminStatsGrid kpis={data.kpis} />

            <div className="admin-charts-grid">
              <SignupsTrendChart data={data.charts?.signupsTrend} />
              <DifficultyPieChart data={data.charts?.difficultyMix} />
            </div>

            <QuizTrendChart data={data.charts?.quizTrend} />
          </>
        ) : null}
      </main>
    </AdminProtectedPage>
  );
}
