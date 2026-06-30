'use client';

import StatCard from '@/components/shared/StatCard';
import { BookOpen, Star, Clock, Users } from 'lucide-react';

const DIFF_COLORS = {
  easy:   '#10b981',
  medium: '#f59e0b',
  hard:   '#ef4444',
  any:    '#8b5cf6',
};

export function PlatformQuizStats({ summary, byDifficulty = [], leaderboard = [] }) {
  return (
    <>
      {/* KPI row */}
      <div className="admin-stats-grid" style={{ marginBottom: 24 }}>
        <StatCard label="Total Quizzes"    value={summary?.total_quizzes ?? 0}     icon={BookOpen} color="#4f46e5" />
        <StatCard label="Avg Score %"      value={`${summary?.avg_score_pct ?? 0}%`} icon={Star}    color="#f59e0b" />
        <StatCard label="Avg Time (s)"     value={summary?.avg_time_seconds ?? 0}  icon={Clock}    color="#0ea5e9" />
        <StatCard label="Unique Players"   value={summary?.unique_players ?? 0}    icon={Users}    color="#10b981" />
      </div>

      {/* By difficulty */}
      <div className="admin-chart-card" style={{ marginBottom: 24 }}>
        <div className="admin-chart-title">By Difficulty</div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {byDifficulty.filter(d => d.attempts > 0).map(d => (
            <div key={d.difficulty} style={{
              background: `${DIFF_COLORS[d.difficulty] ?? '#6b7280'}18`,
              borderLeft: `4px solid ${DIFF_COLORS[d.difficulty] ?? '#6b7280'}`,
              borderRadius: 10,
              padding: '14px 20px',
              minWidth: 130,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: DIFF_COLORS[d.difficulty] }}>
                {d.difficulty}
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
                {d.attempts}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                avg {d.avg_score_pct}%
              </div>
            </div>
          ))}
          {byDifficulty.every(d => d.attempts === 0) && (
            <div className="admin-empty-desc">No quiz data yet.</div>
          )}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="admin-table-card">
        <div style={{ padding: '16px 16px 0' }}>
          <div className="admin-chart-title">🏆 Top Players Leaderboard</div>
        </div>
        {leaderboard.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">🏆</div>
            <div className="admin-empty-title">No leaderboard data yet</div>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table" aria-label="Leaderboard table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Player</th>
                  <th>Quizzes</th>
                  <th>Avg Score %</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((p, i) => {
                  const rankClass = i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other';
                  return (
                    <tr key={p.id}>
                      <td>
                        <span className={`admin-rank-badge ${rankClass}`}>{i + 1}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.email}</div>
                      </td>
                      <td>{p.quiz_count}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>
                          {p.avg_score_pct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
