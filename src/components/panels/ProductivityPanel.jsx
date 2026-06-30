'use client';

import { CheckSquare, TrendingUp, List, Award } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell
} from 'recharts';
import StatCard from '../shared/StatCard';
import SectionTitle from '../shared/SectionTitle';
import '@/styles/ProductivityPanel.css';

const getColor = (rate) => {
  if (rate >= 70) return '#70AD47';
  if (rate >= 50) return '#FFC000';
  return '#FF6B6B';
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const rate = payload[0].value;
    return (
      <div style={{
        background: '#1a1a2e',
        borderRadius: '8px',
        padding: '10px 16px',
        color: '#fff',
        fontSize: '13px',
      }}>
        <p style={{ fontWeight: '700' }}>{label}</p>
        <p>Completion Rate: {rate}%</p>
        <p style={{ color: getColor(rate) }}>
          {rate >= 70 ? '🟢 High' : rate >= 50 ? '🟡 Medium' : '🔴 Low'}
        </p>
      </div>
    );
  }
  return null;
};

export default function ProductivityPanel({ data }) {
  if (!data) return <div className="error-card">Productivity data unavailable</div>;

  const { totalTodos, completedTodos, overallRate, ranked } = data;
  const topUser = ranked[0];

  // Read current theme tokens directly from CSS custom properties
  const gridStroke = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();
  const tickColor  = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();

  return (
    <div className="productivity-panel">
      <SectionTitle>Productivity Overview</SectionTitle>

      <div className="stats-grid">
        <StatCard
          icon={List}
          label="Total Todos"
          value={totalTodos}
          color="#4f46e5"
        />
        <StatCard
          icon={CheckSquare}
          label="Completed"
          value={completedTodos}
          sub={`${overallRate}% overall`}
          color="#10b981"
        />
        <StatCard
          icon={TrendingUp}
          label="Pending"
          value={totalTodos - completedTodos}
          color="#f59e0b"
        />
        <StatCard
          icon={Award}
          label="Most Productive"
          value={topUser?.name}
          sub={`${topUser?.completionRate}% rate`}
          color="#8b5cf6"
        />
      </div>

      <div className="chart-card">
        <SectionTitle>Completion Rate by User</SectionTitle>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={ranked}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: tickColor }}
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: tickColor }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="completionRate" radius={[0, 4, 4, 0]}>
                {ranked.map((entry, i) => (
                  <Cell key={i} fill={getColor(entry.completionRate)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="legend">
          <div className="legend-item">
            <div className="legend-dot" style={{ background: '#70AD47' }} />
            High (70%+)
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: '#FFC000' }} />
            Medium (50–69%)
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: '#FF6B6B' }} />
            Low (below 50%)
          </div>
        </div>
      </div>
    </div>
  );
}
