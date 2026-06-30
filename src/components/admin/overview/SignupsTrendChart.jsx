'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import ChartTooltip from '@/components/shared/ChartTooltip';

export default function SignupsTrendChart({ data = [] }) {
  return (
    <div className="admin-chart-card">
      <div className="admin-chart-title">New Signups — Last 30 Days</div>
      {data.length === 0 ? (
        <div className="admin-empty" style={{ padding: '30px 0' }}>
          <div className="admin-empty-icon">📈</div>
          <div className="admin-empty-title">No signup data yet</div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="signupsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              tickFormatter={v => v?.slice(5)}
            />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} allowDecimals={false} />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#4f46e5"
              strokeWidth={2}
              fill="url(#signupsGrad)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
