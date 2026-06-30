'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import SectionTitle from '../../shared/SectionTitle';
import ChartTooltip from '../../shared/ChartTooltip';

const DIFFICULTY_COLORS = {
  Easy: '#10b981',
  Medium: '#FFC000',
  Hard: '#FF6B6B',
};

function getThemeColors() {
  if (typeof document === 'undefined') {
    return { gridStroke: '#e5e7eb', tickColor: '#6b7280' };
  }

  const root = document.documentElement;
  return {
    gridStroke: getComputedStyle(root).getPropertyValue('--border-color').trim() || '#e5e7eb',
    tickColor: getComputedStyle(root).getPropertyValue('--text-secondary').trim() || '#6b7280',
  };
}

export default function QuizDifficultyChart({ data, loading }) {
  const { gridStroke, tickColor } = getThemeColors();
  const hasAttempts = data.some((item) => item.attempts > 0);

  return (
    <div className="chart-card" aria-label="Performance by difficulty chart">
      <SectionTitle>Performance by Difficulty</SectionTitle>
      <div className="chart-wrapper">
        {loading ? (
          <div className="chart-skeleton" aria-hidden="true" />
        ) : !hasAttempts ? (
          <div className="chart-empty">Try different difficulty levels to compare performance.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: tickColor }} />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: tickColor }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                content={
                  <ChartTooltip
                    rows={(payload, label) => [
                      `Average: ${payload[0]?.value ?? 0}%`,
                      `Attempts: ${payload[0]?.payload?.attempts ?? 0}`,
                      `Level: ${label}`,
                    ]}
                  />
                }
              />
              <Bar dataKey="averageScorePercent" radius={[6, 6, 0, 0]}>
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={DIFFICULTY_COLORS[entry.name] || '#8b5cf6'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
