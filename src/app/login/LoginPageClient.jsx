'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import '@/styles/AuthPages.css';

export default function LoginPageClient() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered') === '1';

  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
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

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your DevPulse account</p>

        {registered && (
          <div className="auth-success-banner" role="status">
            ✓ Account created successfully — please sign in.
          </div>
        )}

        {error && (
          <div className="auth-error-banner" role="alert">
            ✕ {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label className="auth-label" htmlFor="login-email">Email</label>
            <div className="auth-input-wrapper">
              <input
                id="login-email"
                className="auth-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoComplete="email"
                autoFocus
              />
            </div>
          </div>

          <div className="auth-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <label className="auth-label" htmlFor="login-password">Password</label>
              <Link href="/forgot-password" className="auth-link" style={{ fontSize: '13px', fontWeight: '500' }}>Forgot password?</Link>
            </div>
            <div className="auth-input-wrapper">
              <input
                id="login-password"
                className="auth-input has-icon"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-input-icon"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <label className="auth-remember" htmlFor="login-remember">
            <input
              id="login-remember"
              className="auth-remember-checkbox"
              type="checkbox"
              name="rememberMe"
              checked={form.rememberMe}
              onChange={handleChange}
            />
            <span className="auth-remember-label">Remember me for 7 days</span>
          </label>

          <button
            id="login-submit"
            type="submit"
            className="auth-submit-btn"
            disabled={submitting}
          >
            {submitting && <span className="btn-spinner" />}
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="auth-link">Create one</Link>
        </p>
        <p className="auth-footer" style={{ marginTop: '10px', fontSize: '13px' }}>
          Need help?{' '}
          <Link href="/contact" className="auth-link">Contact Support</Link>
        </p>
      </div>
    </main>
  );
}
