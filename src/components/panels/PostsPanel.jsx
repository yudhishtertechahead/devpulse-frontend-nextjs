'use client';

import { FileText, User, BarChart2, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';
import StatCard from '../shared/StatCard';
import SectionTitle from '../shared/SectionTitle';
import '@/styles/PostsPanel.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#1a1a2e',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 16px',
        color: '#fff',
        fontSize: '13px',
      }}>
        <p style={{ fontWeight: '700' }}>{label}</p>
        <p>Posts: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function PostsPanel({ data }) {
  if (!data) return <div className="error-card">Posts data unavailable</div>;

  const { totalPosts, leaderboard, avgPostsPerUser } = data;
  const topPoster = leaderboard[0];

  // Read current theme tokens directly from CSS custom properties
  const gridStroke = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();
  const tickColor  = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();

  return (
    <div className="posts-panel">
      <SectionTitle>Posts Overview</SectionTitle>

      <div className="stats-grid">
        <StatCard
          icon={FileText}
          label="Total Posts"
          value={totalPosts}
          color="#0ea5e9"
        />
        <StatCard
          icon={User}
          label="Top Poster"
          value={topPoster?.name}
          sub={`${topPoster?.postCount} posts`}
          color="#4f46e5"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Posts Per User"
          value={avgPostsPerUser}
          color="#10b981"
        />
        <StatCard
          icon={BarChart2}
          label="Total Users"
          value={leaderboard.length}
          sub="with posts"
          color="#f59e0b"
        />
      </div>

      <div className="chart-card">
        <SectionTitle>Posts Leaderboard</SectionTitle>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={leaderboard} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: tickColor }} />
              <YAxis tick={{ fontSize: 12, fill: tickColor }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="postCount" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
