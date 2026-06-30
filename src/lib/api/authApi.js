import axios from 'axios';

// ── Module-level state ─────────────────────────────────────────────────────
//
// These live outside React so the interceptor can read/write them synchronously.

/** In-memory mirror of the access token — set by AuthContext via updateLocalToken() */
let _accessToken = null;

/**
 * Callbacks injected by AuthContext at startup.
 * Breaks the circular dependency: authApi can't import AuthContext,
 * so AuthContext pushes its setters in here instead.
 */
let _onTokenRefreshed = (_token) => { };
let _onLogout = () => { };

/**
 * Inject AuthContext callbacks.
 * Call this inside AuthContext's useEffect (after state is initialized).
 */
export const setAuthCallbacks = ({ onTokenRefreshed, onLogout }) => {
  _onTokenRefreshed = onTokenRefreshed;
  _onLogout = onLogout;
};

/**
 * Keep the module-level token in sync with React state.
 * Call whenever accessToken changes in AuthContext.
 */
export const updateLocalToken = (token) => {
  _accessToken = token;
};

// ── Axios instances ────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

/**
 * Main instance — used for all API calls requiring authentication.
 * Has request interceptor (auth header) + response interceptor (401 handling).
 * withCredentials: true is set at the INSTANCE level so every request
 * sends the httpOnly cookie cross-origin.
 */
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

/**
 * Dedicated refresh instance — NO response interceptor.
 * Used only for POST /refresh inside the 401 interceptor to prevent
 * infinite recursion if the refresh call itself returns 401.
 */
const refreshApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// ── Request interceptor ────────────────────────────────────────────────────

api.interceptors.request.use((config) => {
  if (_accessToken) {
    config.headers.Authorization = `Bearer ${_accessToken}`;
  }
  return config;
});

// ── Response interceptor — concurrent 401 storm fix ───────────────────────
//
// Problem: If N parallel requests all expire at the same time, they all get
// 401 simultaneously. Calling /refresh N times in parallel would fail because
// only the first response is valid.
//
// Fix: isRefreshing flag + failedQueue.
//   - First 401 → sets isRefreshing=true, calls /refresh once.
//   - Subsequent 401s while refreshing → push { resolve, reject } into failedQueue.
//   - When refresh succeeds → processQueue(null, newToken) replays all queued requests.
//   - When refresh fails   → processQueue(error) rejects all queued requests + logout.

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token)
  );
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    const isAuthRoute = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'].some(route => originalRequest.url?.includes(route));

    // Non-401 errors, already-retried requests, or auth routes — pass through as-is
    if (error.response?.status !== 401 || originalRequest._retry || isAuthRoute) {
      return Promise.reject(error);
    }

    // A refresh is already in-flight — queue this request until it completes
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    // Mark so if the retried request also gets 401, we don't loop
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await refreshApi.post('/auth/refresh');
      const newToken = data.accessToken;

      // Update module-level token + React state
      _accessToken = newToken;
      _onTokenRefreshed(newToken);

      // Replay all queued requests with the new token
      processQueue(null, newToken);

      // Retry the original request
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      // Refresh failed (expired cookie, revoked session, etc.)
      processQueue(refreshError);
      _accessToken = null;
      _onLogout(); // clears React state + navigates to /login
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

// ── Exported API functions ─────────────────────────────────────────────────

/** POST /auth/login — returns { accessToken }; sets httpOnly refresh cookie */
export const authLogin = (body) => api.post('/auth/login', body);

/** POST /auth/register — creates account; client must call /login separately */
export const authRegister = (body) => api.post('/auth/register', body);

/**
 * POST /auth/logout — MUST hit the backend to revoke the session row in the DB.
 * Clearing only frontend state would leave the session alive server-side.
 */
export const authLogout = () => api.post('/auth/logout');

/**
 * POST /auth/refresh — called via the dedicated refreshApi instance (no interceptor).
 * Used by: (1) AuthContext on mount, (2) the 401 interceptor above.
 */
export const authRefresh = () => refreshApi.post('/auth/refresh');

/** GET /auth/me — returns the current authenticated user; requires valid access token */
export const authGetMe = () => api.get('/auth/me');

/** POST /auth/forgot-password — requests a password reset email */
export const authForgotPassword = (body) => api.post('/auth/forgot-password', body);

/** POST /auth/reset-password — resets the password using the token */
export const authResetPassword = (body) => api.post('/auth/reset-password', body);
