'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAdminOverview } from '@/lib/api/adminApi';

export default function useAdminOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminOverview();
      setData(res.data.data);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load overview');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
