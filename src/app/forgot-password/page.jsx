'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authForgotPassword } from '@/lib/api/authApi';
import '@/styles/AuthPages.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setSubmitting(true);
    try {
      const { data } = await authForgotPassword({ email });
      setSuccessMsg(data.message || 'If that email address is in our database, we will send you an email to reset your password.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to request password reset. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">⚡</div>
          <span className="auth-logo-text">DevPulse</span>
        </div>

        <h1 className="auth-title">Reset Password</h1>
        <p className="auth-subtitle">Enter your email to receive a reset link</p>

        {successMsg && (
          <div className="auth-success-banner" role="status">
            ✓ {successMsg}
          </div>
        )}

        {error && (
          <div className="auth-error-banner" role="alert">
            ✕ {error}
          </div>
        )}

        {!successMsg && (
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label className="auth-label" htmlFor="reset-email">Email</label>
              <div className="auth-input-wrapper">
                <input
                  id="reset-email"
                  className="auth-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={submitting || !email}
            >
              {submitting && <span className="btn-spinner" />}
              {submitting ? 'Sending…' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <p className="auth-footer">
          Remember your password?{' '}
          <Link href="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
