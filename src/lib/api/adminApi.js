/**
 * adminApi.js — All admin API calls.
 *
 * Re-uses the shared `api` axios instance from authApi.js which already handles:
 *   - Authorization Bearer header injection
 *   - 401 → token refresh → request retry
 *   - Logout on unrecoverable 401
 */
import { api } from '@/lib/api/authApi';

// ── Overview ──────────────────────────────────────────────────────────────────

export const getAdminOverview = () => api.get('/admin/overview');

// ── Users ─────────────────────────────────────────────────────────────────────

export const getAdminUsers = (params) => api.get('/admin/users', { params });

export const getAdminUserDetail = (id) => api.get(`/admin/users/${id}`);

export const updateAdminUser = (id, body) => api.patch(`/admin/users/${id}`, body);

export const deactivateAdminUser = (id) => api.post(`/admin/users/${id}/deactivate`);

export const reactivateAdminUser = (id) => api.post(`/admin/users/${id}/reactivate`);

export const getAdminUserSessions = (id) => api.get(`/admin/users/${id}/sessions`);

export const forceLogoutUser = (id) => api.delete(`/admin/users/${id}/sessions`);

// ── Sessions ──────────────────────────────────────────────────────────────────

export const getAdminSessions = (params) => api.get('/admin/sessions', { params });

export const revokeAdminSession = (sessionId) => api.delete(`/admin/sessions/${sessionId}`);

// ── Quizzes ───────────────────────────────────────────────────────────────────

export const getAdminQuizStats = () => api.get('/admin/quizzes/stats');

export const getAdminRecentQuizzes = (params) => api.get('/admin/quizzes/recent', { params });
