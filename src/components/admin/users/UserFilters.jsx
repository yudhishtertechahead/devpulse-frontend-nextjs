'use client';

import { Search } from 'lucide-react';
import { useRef } from 'react';

export default function UserFilters({ params, onUpdate }) {
  const searchRef = useRef(null);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      onUpdate({ search: e.target.value });
    }
  };

  return (
    <div className="admin-filters">
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <Search
          size={14}
          style={{
            position: 'absolute', left: 10,
            color: 'var(--text-muted)', pointerEvents: 'none'
          }}
        />
        <input
          ref={searchRef}
          type="search"
          placeholder="Search name or email…"
          defaultValue={params.search || ''}
          onKeyDown={handleSearch}
          onBlur={e => onUpdate({ search: e.target.value })}
          className="admin-filter-input"
          style={{ paddingLeft: 32 }}
          id="admin-user-search"
          aria-label="Search users"
        />
      </div>

      <select
        className="admin-filter-select"
        value={params.role || ''}
        onChange={e => onUpdate({ role: e.target.value })}
        id="admin-user-role-filter"
        aria-label="Filter by role"
      >
        <option value="">All roles</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <select
        className="admin-filter-select"
        value={params.status || ''}
        onChange={e => onUpdate({ status: e.target.value })}
        id="admin-user-status-filter"
        aria-label="Filter by status"
      >
        <option value="">All statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  );
}
