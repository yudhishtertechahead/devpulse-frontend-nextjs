'use client';

import { Users, Activity, Shield, BookOpen, TrendingUp, Star } from 'lucide-react';
import StatCard from '@/components/shared/StatCard';

const CARDS = [
  { key: 'totalUsers',     label: 'Total Users',         icon: Users,      color: '#4f46e5' },
  { key: 'activeUsers7d',  label: 'Active Users (7d)',   icon: Activity,   color: '#0ea5e9' },
  { key: 'activeSessions', label: 'Active Sessions',     icon: Shield,     color: '#10b981' },
  { key: 'totalQuizzes',   label: 'Total Quizzes',       icon: BookOpen,   color: '#f59e0b' },
  { key: 'quizzes7d',      label: 'Quizzes (7d)',        icon: TrendingUp, color: '#8b5cf6' },
  { key: 'avgScorePct',    label: 'Avg Score %',         icon: Star,       color: '#ec4899', format: v => `${v ?? 0}%` },
];

export default function AdminStatsGrid({ kpis }) {
  if (!kpis) return null;

  return (
    <div className="admin-stats-grid">
      {CARDS.map(({ key, label, icon, color, format }) => (
        <StatCard
          key={key}
          label={label}
          value={format ? format(kpis[key]) : (kpis[key] ?? 0)}
          icon={icon}
          color={color}
        />
      ))}
    </div>
  );
}
