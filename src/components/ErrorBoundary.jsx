'use client';

import { Component } from 'react';
import '@/styles/ErrorBoundary.css';

/**
 * ErrorBoundary — React class component that catches JS errors
 * anywhere in its child component tree and renders a styled fallback UI.
 *
 * Production features:
 *  - Accepts a custom `fallback` prop (ReactNode or render-prop function)
 *  - Generates a unique `errorId` for each caught error (aids support / Sentry correlation)
 *  - `componentDidCatch` is the integration point for external error services (e.g. Sentry)
 *  - "Try again" button resets local state so the subtree is remounted
 *  - `onError` prop allows the parent to react (e.g. show a toast) without coupling
 *  - Displays degraded UI that respects light/dark theme via CSS custom properties
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      // Unique ID per caught error — pass to Sentry / log dashboards
      errorId: null,
    };
    this.handleReset = this.handleReset.bind(this);
  }

  // ─── Lifecycle ──────────────────────────────────────────────────────────────

  /**
   * Called synchronously during render when a descendant throws.
   * Return value is merged into state — do NOT perform side-effects here.
   */
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
      // Generate a short collision-resistant ID for correlation in logs/Sentry
      errorId: `eb-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    };
  }

  /**
   * Called after the error has been committed to state.
   * Safe place for side-effects: logging, analytics, alerting.
   */
  componentDidCatch(error, info) {
    const { errorId } = this.state;
    const { onError, boundaryName } = this.props;

    // ── Structured console output (always) ──────────────────────────────────
    console.error(
      `[ErrorBoundary${boundaryName ? ` • ${boundaryName}` : ''}] id=${errorId}`,
      '\nError:',       error,
      '\nComponent stack:', info.componentStack,
    );

    // ── External error service hook ──────────────────────────────────────────
    // Uncomment when Sentry (or equivalent) is installed:
    // import * as Sentry from '@sentry/react';
    // Sentry.withScope(scope => {
    //   scope.setTag('errorBoundary', boundaryName ?? 'unknown');
    //   scope.setExtra('componentStack', info.componentStack);
    //   scope.setExtra('errorId', errorId);
    //   Sentry.captureException(error);
    // });

    // ── Notify parent component (e.g. to show a global toast) ───────────────
    if (typeof onError === 'function') {
      onError(error, info, errorId);
    }

    // Persist detailed info so the fallback can display the component stack
    this.setState({ errorInfo: info });
  }

  // ─── Handlers ───────────────────────────────────────────────────────────────

  handleReset() {
    this.setState({ hasError: false, error: null, errorInfo: null, errorId: null });
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  render() {
    const { hasError, error, errorId } = this.state;
    const { children, fallback, boundaryName } = this.props;

    if (!hasError) return children; // if there are no errors it directly return this.

    // ── Custom fallback (ReactNode or render-prop) ───────────────────────────
    if (fallback != null) {
      return typeof fallback === 'function'
        ? fallback({ error, errorId, reset: this.handleReset })
        : fallback;
    }

    // ── Default styled fallback ──────────────────────────────────────────────
    return (
      <div className="eb-container" role="alert" aria-live="assertive">
        <div className="eb-icon" aria-hidden="true">⚠️</div>

        <h2 className="eb-title">
          {boundaryName ? `${boundaryName} failed to load` : 'Something went wrong'}
        </h2>

        <p className="eb-message">
          {error?.message || 'An unexpected error occurred.'}
        </p>

        {errorId && (
          <p className="eb-error-id" title="Use this ID when contacting support">
            Error ID: <code>{errorId}</code>
          </p>
        )}

        <button
          id={`eb-retry-${errorId ?? 'default'}`}
          className="eb-retry-btn"
          onClick={this.handleReset}
        >
          Try again
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
