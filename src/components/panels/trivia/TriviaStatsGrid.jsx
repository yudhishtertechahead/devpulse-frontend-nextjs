'use client';

import { HelpCircle, CheckCircle, XCircle, List } from 'lucide-react';
import StatCard from '../../shared/StatCard';

export default function TriviaStatsGrid({ total, results }) {
  return (
    <div className="stats-grid">
      <StatCard
        icon={HelpCircle}
        label="Total Questions"
        value={total}
        color="#f59e0b"
      />
      <StatCard
        icon={CheckCircle}
        label="Easy Questions"
        value={results.filter(q => q.difficulty === 'easy').length}
        color="#10b981"
      />
      <StatCard
        icon={XCircle}
        label="Hard Questions"
        value={results.filter(q => q.difficulty === 'hard').length}
        color="#FF6B6B"
      />
      <StatCard
        icon={List}
        label="Categories"
        value={[...new Set(results.map(q => q.category))].length}
        color="#8b5cf6"
      />
    </div>
  );
}
