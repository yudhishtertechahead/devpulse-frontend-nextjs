'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAdminUserDetail } from '@/lib/api/adminApi';

export default function useAdminUserDetail(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminUserDetail(id);
      setData(res.data.data);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load user');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
