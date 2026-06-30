'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { PieChart, Pie, Legend } from 'recharts';
import ChartTooltip from '@/components/shared/ChartTooltip';

const DIFF_COLORS = {
  easy:   '#10b981',
  medium: '#f59e0b',
  hard:   '#ef4444',
  any:    '#8b5cf6',
};

export function QuizTrendChart({ data = [] }) {
  return (
    <div className="admin-chart-card">
      <div className="admin-chart-title">Quizzes Taken — Last 30 Days</div>
      {data.length === 0 ? (
        <div className="admin-empty" style={{ padding: '30px 0' }}>
          <div className="admin-empty-icon">📊</div>
          <div className="admin-empty-title">No quiz data yet</div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              tickFormatter={v => v?.slice(5)}
            />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} allowDecimals={false} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function DifficultyPieChart({ data = [] }) {
  const filtered = data.filter(d => d.attempts > 0);
  return (
    <div className="admin-chart-card">
      <div className="admin-chart-title">Difficulty Mix</div>
      {filtered.length === 0 ? (
        <div className="admin-empty" style={{ padding: '30px 0' }}>
          <div className="admin-empty-icon">🥧</div>
          <div className="admin-empty-title">No data yet</div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={filtered}
              dataKey="attempts"
              nameKey="difficulty"
              cx="50%"
              cy="50%"
              outerRadius={70}
              label={({ difficulty, attempts }) => `${difficulty} (${attempts})`}
              labelLine={false}
            >
              {filtered.map(entry => (
                <Cell key={entry.difficulty} fill={DIFF_COLORS[entry.difficulty] ?? '#6b7280'} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
