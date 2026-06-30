import { Suspense } from 'react';
import ResetPasswordPageClient from './ResetPasswordPageClient';
import '@/styles/AuthPages.css';

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="auth-spinner-wrapper" role="status" aria-label="Loading">
          <div className="auth-spinner" />
        </div>
      }
    >
      <ResetPasswordPageClient />
    </Suspense>
  );
}
