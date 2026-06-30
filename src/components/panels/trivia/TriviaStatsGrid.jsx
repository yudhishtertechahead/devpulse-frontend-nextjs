'use client';

import { HelpCircle, TrendingUp, Award, Clock } from 'lucide-react';
import StatCard from '../../shared/StatCard';
import { toSummaryStats } from '@/modules/quizAnalytics';

const ICONS = [HelpCircle, TrendingUp, Award, Clock];

export default function TriviaStatsGrid({ summary, loading }) {
  if (loading) {
    return (
      <div className="trivia-performance-grid">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="trivia-stat-skeleton" aria-hidden="true" />
        ))}
      </div>
    );
  }

  const cards = toSummaryStats(summary);

  return (
    <div className="trivia-performance-grid">
      {cards.map((card, index) => (
        <StatCard
          key={card.label}
          icon={ICONS[index]}
          label={card.label}
          value={card.value}
          sub={card.sub}
          color={card.color}
        />
      ))}
    </div>
  );
}
