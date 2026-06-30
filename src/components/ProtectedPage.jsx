'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import '@/styles/AuthPages.css';

export default function ProtectedPage({ children }) {
  const { accessToken, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !accessToken) {
      router.replace('/login');
    }
  }, [accessToken, loading, router]);

  if (loading) {
    return (
      <div className="auth-spinner-wrapper" role="status" aria-label="Loading">
        <div className="auth-spinner" />
      </div>
    );
  }

  if (!accessToken) {
    return null;
  }

  return children;
}
