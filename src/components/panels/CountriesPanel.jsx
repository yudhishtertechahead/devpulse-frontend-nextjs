'use client';

import { useState } from 'react';
import { Globe, Users, Map, Search } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';
import StatCard from '../shared/StatCard';
import SectionTitle from '../shared/SectionTitle';
import Badge from '../shared/Badge';
import '@/styles/CountriesPanel.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#1a1a2e',
        borderRadius: '8px',
        padding: '10px 16px',
        color: '#fff',
        fontSize: '13px',
      }}>
        <p style={{ fontWeight: '700' }}>{label}</p>
        <p>Population: {(payload[0].value / 1e9).toFixed(2)}B</p>
      </div>
    );
  }
  return null;
};

export default function CountriesPanel({ data }) {
  const [search, setSearch] = useState('');

  if (!data) return <div className="error-card">Countries data unavailable</div>;

  const { normalised, top5, totalCountries, totalPopulation } = data;

  // Read current theme tokens directly from CSS custom properties
  const gridStroke = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();
  const tickColor  = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();

  const filtered = normalised.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="countries-panel">
      <SectionTitle>Countries Overview</SectionTitle>

      <div className="stats-grid">
        <StatCard
          icon={Globe}
          label="Asian Countries"
          value={totalCountries}
          color="#8b5cf6"
        />
        <StatCard
          icon={Users}
          label="Total Population"
          value={`${(totalPopulation / 1e9).toFixed(2)}B`}
          color="#0ea5e9"
        />
        <StatCard
          icon={Map}
          label="Most Populous"
          value={top5[0]?.name}
          sub={`${(top5[0]?.population / 1e9).toFixed(2)}B people`}
          color="#10b981"
        />
        <StatCard
          icon={Search}
          label="Search Results"
          value={filtered.length}
          sub="matching countries"
          color="#f59e0b"
        />
      </div>

      <div className="chart-card">
        <SectionTitle>Top 5 Most Populous Asian Countries</SectionTitle>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={top5} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: tickColor }} />
              <YAxis
                tick={{ fontSize: 12, fill: tickColor }}
                tickFormatter={(v) => `${(v / 1e9).toFixed(1)}B`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="population" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search countries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="search-count">{filtered.length} countries</span>
        </div>

        <SectionTitle>All Asian Countries</SectionTitle>

        {filtered.length === 0 ? (
          <div className="empty-state">
            🌏 No countries match your search
          </div>
        ) : (
          <div className="countries-grid">
            {filtered.map((c) => (
              <div key={c.name} className="country-card">
                <div className="country-flag">{c.flag}</div>
                <div className="country-name">{c.name}</div>
                <div className="country-detail">🏛 {c.capital}</div>
                <div className="country-detail">
                  👥 {(c.population / 1e6).toFixed(1)}M
                </div>
                <div className="country-badges">
                  <Badge color="#8b5cf6">{c.currency}</Badge>
                  <Badge color="#0ea5e9">{c.region}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
