'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import '@/styles/AuthPages.css';

export default function RegisterPage() {
  const { register } = useAuth();

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&~#^()_+=\-[\]{}|\\:;"'<>,./?]).*$/;
    if (form.password.length < 8 || form.password.length > 128) {
      setError('Password must be between 8 and 128 characters');
      return;
    }
    if (!passwordRegex.test(form.password)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
      return;
    }

    setSubmitting(true);
    try {
      await register({
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
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

        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Start monitoring your developer pulse</p>

        {error && (
          <div className="auth-error-banner" role="alert">
            ✕ {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="auth-field" style={{ flex: 1 }}>
              <label className="auth-label" htmlFor="reg-first-name">First Name</label>
              <input
                id="reg-first-name"
                className="auth-input"
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="John"
                required
                minLength={1}
                autoComplete="given-name"
                autoFocus
              />
            </div>
            <div className="auth-field" style={{ flex: 1 }}>
              <label className="auth-label" htmlFor="reg-last-name">Last Name</label>
              <input
                id="reg-last-name"
                className="auth-input"
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
                minLength={1}
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              className="auth-input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="reg-password">Password</label>
            <div className="auth-input-wrapper">
              <input
                id="reg-password"
                className="auth-input has-icon"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
                required
                minLength={8}
                autoComplete="new-password"
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

          <div className="auth-field">
            <label className="auth-label" htmlFor="reg-confirm-password">Confirm Password</label>
            <div className="auth-input-wrapper">
              <input
                id="reg-confirm-password"
                className="auth-input has-icon"
                type={showConfirmPw ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                minLength={8}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-input-icon"
                onClick={() => setShowConfirmPw((v) => !v)}
                aria-label={showConfirmPw ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            id="register-submit"
            type="submit"
            className="auth-submit-btn"
            disabled={submitting}
          >
            {submitting && <span className="btn-spinner" />}
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link href="/login" className="auth-link">Sign in</Link>
        </p>
        <p className="auth-footer" style={{ marginTop: '10px', fontSize: '13px' }}>
          Need help?{' '}
          <Link href="/contact" className="auth-link">Contact Support</Link>
        </p>
      </div>
    </main>
  );
}
