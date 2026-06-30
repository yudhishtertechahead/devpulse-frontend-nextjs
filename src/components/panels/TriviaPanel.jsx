'use client';

import { useQuizAnalytics } from '@/hooks/useQuizAnalytics';
import '@/styles/TriviaPanel.css';
import TriviaPerformanceSection from './trivia/TriviaPerformanceSection';
import TriviaQuizSection from './trivia/TriviaQuizSection';

export default function TriviaPanel() {
  const { stats, loading, error, refetch, isEmpty } = useQuizAnalytics();

  return (
    <div className="trivia-panel">
      <TriviaPerformanceSection
        stats={stats}
        loading={loading}
        error={error}
        isEmpty={isEmpty}
        onRetry={refetch}
      />
      <TriviaQuizSection onQuizComplete={refetch} />
    </div>
  );
}
