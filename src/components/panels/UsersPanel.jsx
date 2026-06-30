'use client';

import { Users, Mail, Building, AtSign } from 'lucide-react';
import StatCard from '../shared/StatCard';
import SectionTitle from '../shared/SectionTitle';
import Badge from '../shared/Badge';
import '@/styles/UsersPanel.css';

export default function UsersPanel({ data }) {
  if (!data) return <div className="error-card">Users data unavailable</div>;

  const { totalUsers, bizUsers, companies, uniqueCompanies } = data;

  return (
    <div className="users-panel">
      <SectionTitle>Users Overview</SectionTitle>

      <div className="stats-grid">
        <StatCard icon={Users} label="Total Users" value={totalUsers} color="#4f46e5" />
        <StatCard icon={Building} label="Unique Companies" value={uniqueCompanies.length} color="#0ea5e9" />
        <StatCard icon={AtSign} label=".biz Email Users" value={bizUsers.length} color="#f59e0b" />
        <StatCard icon={Mail} label="Other Emails" value={totalUsers - bizUsers.length} color="#10b981" />
      </div>

      <SectionTitle>All Users</SectionTitle>
      <div className="users-grid">
        {companies.map((u, i) => (
          <div key={i} className="user-card">
            <h3>{u.name}</h3>
            <p>📧 {u.email}</p>
            <div className="user-badges">
              <Badge color="#4f46e5">{u.company}</Badge>
              {u.email.endsWith('.biz') && <Badge color="#f59e0b">.biz</Badge>}
            </div>
          </div>
        ))}
      </div>

      {bizUsers.length > 0 && (
        <div className="biz-section">
          <SectionTitle>.biz Email Users</SectionTitle>
          <div className="biz-list">
            {bizUsers.map((u, i) => (
              <div key={i} className="biz-item">
                <span>{u.name}</span>
                <Badge color="#0ea5e9">{u.email}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
