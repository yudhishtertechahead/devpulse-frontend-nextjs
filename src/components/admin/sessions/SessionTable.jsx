'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { revokeAdminSession } from '@/lib/api/adminApi';

function fmt(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function truncate(str, n = 40) {
  if (!str) return '—';
  return str.length > n ? str.slice(0, n) + '…' : str;
}

export default function SessionTable({ sessions = [], onRevoked }) {
  const [revoking, setRevoking] = useState(null);

  const handleRevoke = async (sessionId) => {
    setRevoking(sessionId);
    try {
      await revokeAdminSession(sessionId);
      onRevoked?.(sessionId);
    } catch {
      // surface error to parent if needed
    } finally {
      setRevoking(null);
    }
  };

  if (sessions.length === 0) {
    return (
      <div className="admin-empty">
        <div className="admin-empty-icon">🔒</div>
        <div className="admin-empty-title">No active sessions</div>
        <div className="admin-empty-desc">All sessions appear clean.</div>
      </div>
    );
  }

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table" aria-label="Active sessions table">
        <thead>
          <tr>
            {onRevoked !== undefined && <th>User</th>}
            <th>Device</th>
            <th>IP Address</th>
            <th>Created</th>
            <th>Expires</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map(s => (
            <tr key={s.id}>
              {onRevoked !== undefined && (
                <td>
                  <div style={{ fontWeight: 600 }}>{s.user_name ?? '—'}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.user_email}</div>
                </td>
              )}
              <td title={s.device_info}>{truncate(s.device_info, 45)}</td>
              <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{s.ip_address ?? '—'}</td>
              <td style={{ color: 'var(--text-secondary)' }}>{fmt(s.created_at)}</td>
              <td style={{ color: 'var(--text-secondary)' }}>{fmt(s.expires_at)}</td>
              <td>
                <button
                  className="admin-btn admin-btn-danger admin-btn-sm"
                  onClick={() => handleRevoke(s.id)}
                  disabled={revoking === s.id}
                  id={`revoke-session-${s.id}`}
                  aria-label={`Revoke session ${s.id}`}
                >
                  <LogOut size={12} />
                  {revoking === s.id ? 'Revoking…' : 'Revoke'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
