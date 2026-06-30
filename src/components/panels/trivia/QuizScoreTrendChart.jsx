'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import SectionTitle from '../../shared/SectionTitle';
import ChartTooltip from '../../shared/ChartTooltip';

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

export default function QuizScoreTrendChart({ data, loading }) {
  const { gridStroke, tickColor } = getThemeColors();

  return (
    <div className="chart-card" aria-label="Quiz score trend chart">
      <SectionTitle>Score Trend</SectionTitle>
      <div className="chart-wrapper">
        {loading ? (
          <div className="chart-skeleton" aria-hidden="true" />
        ) : data.length === 0 ? (
          <div className="chart-empty">Complete a quiz to see your score trend.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: tickColor }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: tickColor }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                content={
                  <ChartTooltip
                    rows={(payload, label) => [
                      `Score: ${payload[0]?.value ?? 0}%`,
                      `Result: ${payload[0]?.payload?.label ?? label}`,
                    ]}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="scorePercent"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ r: 4, fill: '#8b5cf6' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
