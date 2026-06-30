import { Suspense } from 'react';
import LoginPageClient from './LoginPageClient';
import '@/styles/AuthPages.css';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="auth-spinner-wrapper" role="status" aria-label="Loading">
          <div className="auth-spinner" />
        </div>
      }
    >
      <LoginPageClient />
    </Suspense>
  );
}
