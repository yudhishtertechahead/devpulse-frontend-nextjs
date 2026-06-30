'use client';

import { RefreshCw } from 'lucide-react';
import SectionTitle from '../../shared/SectionTitle';
import TriviaStatsGrid from './TriviaStatsGrid';
import QuizScoreTrendChart from './QuizScoreTrendChart';
import QuizDifficultyChart from './QuizDifficultyChart';
import {
  toDifficultyChartData,
  toScoreTrendChartData,
} from '@/modules/quizAnalytics';

export default function TriviaPerformanceSection({
  stats,
  loading,
  error,
  isEmpty,
  onRetry,
}) {
  const summary = stats?.summary;
  const difficultyData = stats ? toDifficultyChartData(stats.byDifficulty) : [];
  const trendData = stats ? toScoreTrendChartData(stats.scoreTrend) : [];

  return (
    <section className="trivia-performance-section">
      <SectionTitle>My Quiz Performance</SectionTitle>

      {error && (
        <div className="trivia-error-banner">
          <p>{error}</p>
          <button type="button" className="retry-btn" onClick={onRetry}>
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      <TriviaStatsGrid summary={summary} loading={loading} />

      <div className="trivia-charts-grid">
        <QuizScoreTrendChart data={trendData} loading={loading} />
        <QuizDifficultyChart data={difficultyData} loading={loading} />
      </div>

      {!loading && !error && isEmpty && (
        <div className="trivia-empty-state">
          <p>You have not taken any quizzes yet.</p>
          <p className="trivia-empty-sub">Start your first quiz below to unlock personalized analytics.</p>
        </div>
      )}
    </section>
  );
}
