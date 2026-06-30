'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { authResetPassword } from '@/lib/api/authApi';
import '@/styles/AuthPages.css';

export default function ResetPasswordPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token || !email) {
      setError('Invalid reset link. Please request a new one.');
      return;
    }

    setSubmitting(true);
    try {
      await authResetPassword({ email, token, newPassword: form.newPassword });
      setSuccess(true);
      setTimeout(() => {
        router.replace('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password. The link might be expired.');
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

        <h1 className="auth-title">Set New Password</h1>
        <p className="auth-subtitle">Create a new, secure password</p>

        {success && (
          <div className="auth-success-banner" role="status">
            ✓ Password reset successfully! Redirecting to login...
          </div>
        )}

        {error && (
          <div className="auth-error-banner" role="alert">
            ✕ {error}
          </div>
        )}

        {!success && (
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label className="auth-label" htmlFor="new-password">New Password</label>
              <div className="auth-input-wrapper">
                <input
                  id="new-password"
                  className="auth-input has-icon"
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  className="auth-input-icon"
                  onClick={() => setShowPw((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="confirm-password">Confirm Password</label>
              <div className="auth-input-wrapper">
                <input
                  id="confirm-password"
                  className="auth-input has-icon"
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="auth-input-icon"
                  onClick={() => setShowConfirm((v) => !v)}
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={submitting || !form.newPassword || !form.confirmPassword}
            >
              {submitting && <span className="btn-spinner" />}
              {submitting ? 'Resetting…' : 'Reset Password'}
            </button>
          </form>
        )}

        <p className="auth-footer">
          Return to{' '}
          <Link href="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
