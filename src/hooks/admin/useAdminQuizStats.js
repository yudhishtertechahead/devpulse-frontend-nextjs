'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAdminQuizStats, getAdminRecentQuizzes } from '@/lib/api/adminApi';

export default function useAdminQuizStats() {
  const [data, setData] = useState(null);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, recentRes] = await Promise.all([
        getAdminQuizStats(),
        getAdminRecentQuizzes({ limit: 50 }),
      ]);
      setData(statsRes.data.data);
      setRecentQuizzes(recentRes.data.data);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load quiz stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, recentQuizzes, loading, error, refetch: fetch };
}
