'use client';

import Link from 'next/link';

function fmt(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

const DIFF_COLORS = {
  easy:   '#10b981',
  medium: '#f59e0b',
  hard:   '#ef4444',
  any:    '#8b5cf6',
};

export default function RecentQuizzesTable({ quizzes = [] }) {
  if (quizzes.length === 0) {
    return (
      <div className="admin-empty">
        <div className="admin-empty-icon">📝</div>
        <div className="admin-empty-title">No recent quiz submissions</div>
      </div>
    );
  }

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table" aria-label="Recent quiz submissions table">
        <thead>
          <tr>
            <th>Player</th>
            <th>Difficulty</th>
            <th>Score</th>
            <th>Time (s)</th>
            <th>Submitted</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map(q => {
            const pct = q.total_questions
              ? Math.round((q.score / q.total_questions) * 100)
              : 0;
            return (
              <tr key={q.id}>
                <td>
                  <Link href={`/admin/users/${q.user_id}`} className="admin-table-link">
                    {q.user_name}
                  </Link>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{q.user_email}</div>
                </td>
                <td>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 700,
                    background: `${DIFF_COLORS[q.difficulty] ?? '#6b7280'}18`,
                    color: DIFF_COLORS[q.difficulty] ?? '#6b7280',
                    textTransform: 'capitalize',
                  }}>
                    {q.difficulty}
                  </span>
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: pct >= 70 ? 'var(--success-text)' : pct >= 40 ? 'var(--warning-text)' : 'var(--error-text)' }}>
                    {q.score}/{q.total_questions}
                    <span style={{ fontWeight: 400, color: 'var(--text-muted)', marginLeft: 4 }}>({pct}%)</span>
                  </span>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{q.time_taken ?? '—'}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{fmt(q.created_at)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
