'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getQuizStats, getPastQuizzes } from '@/lib/api/quizApi';
import {
  normalizeQuizStats,
  buildQuizStatsFromQuizzes,
  isQuizStatsEmpty,
} from '@/modules/quizAnalytics';

export function useQuizAnalytics() {
  const { accessToken } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!accessToken) {
      setStats(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getQuizStats();
      setStats(normalizeQuizStats(response));
    } catch (statsError) {
      const status = statsError?.response?.status;

      if (status === 404 || status === 501) {
        try {
          const historyResponse = await getPastQuizzes();
          setStats(buildQuizStatsFromQuizzes(historyResponse?.data || []));
        } catch (historyError) {
          setError(
            historyError?.response?.data?.message ||
              historyError.message ||
              'Failed to load quiz analytics'
          );
          setStats(null);
        }
      } else {
        setError(
          statsError?.response?.data?.message ||
            statsError.message ||
            'Failed to load quiz analytics'
        );
        setStats(null);
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    stats,
    loading,
    error,
    refetch,
    isEmpty: stats ? isQuizStatsEmpty(stats) : false,
  };
}
