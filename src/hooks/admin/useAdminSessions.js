'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAdminSessions } from '@/lib/api/adminApi';

export default function useAdminSessions(initialParams = {}) {
  const [params, setParams] = useState({ page: 1, limit: 20, ...initialParams });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminSessions(params);
      setData(res.data);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetch(); }, [fetch]);

  const updateParams = useCallback((next) => {
    setParams(prev => ({ ...prev, ...next, page: next.page ?? 1 }));
  }, []);

  return { data, loading, error, refetch: fetch, params, updateParams };
}
