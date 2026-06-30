'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, LogOut, Sun, Moon, Shield } from 'lucide-react';
import Link from 'next/link';
import '@/styles/DevPulseDashboard.css';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

import { fetchUsers } from '@/lib/api/fetchUsers';
import { fetchPosts } from '@/lib/api/fetchPosts';
import { fetchTodos } from '@/lib/api/fetchTodos';
import { fetchCountries } from '@/lib/api/fetchCountries';

import { getUserStats } from '@/modules/userStats';
import { getPostAnalysis } from '@/modules/postAnalysis';
import { getProductivityStats } from '@/modules/productivityTracker';
import { getCountryStats } from '@/modules/countryLookup';

import OverviewPanel from './panels/OverviewPanel';
import UsersPanel from './panels/UsersPanel';
import PostsPanel from './panels/PostsPanel';
import ProductivityPanel from './panels/ProductivityPanel';
import TriviaPanel from './panels/TriviaPanel';
import CountriesPanel from './panels/CountriesPanel';
import { ErrorBoundary } from './ErrorBoundary';

const TABS = ['Overview', 'Users', 'Posts', 'Productivity', 'Trivia', 'Countries'];

export default function DevPulseDashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('Overview');
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [loadTime, setLoadTime] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    setErrors({});
    const start = Date.now();

    const [usersRes, postsRes, todosRes, countriesRes] =
      await Promise.allSettled([
        fetchUsers(),
        fetchPosts(),
        fetchTodos(),
        fetchCountries(),
      ]);

    const errs = {};

    const users = usersRes.status === 'fulfilled'
      ? usersRes.value
      : (errs.users = usersRes.reason.message, null);

    const posts = postsRes.status === 'fulfilled'
      ? postsRes.value
      : (errs.posts = postsRes.reason.message, null);

    const todos = todosRes.status === 'fulfilled'
      ? todosRes.value
      : (errs.todos = todosRes.reason.message, null);

    const countries = countriesRes.status === 'fulfilled'
      ? countriesRes.value
      : (errs.countries = countriesRes.reason.message, null);

    setErrors(errs);
    setLoadTime(Date.now() - start);

    try {
      setDashData({
        users: users ? getUserStats(users) : null,
        posts: posts && users ? getPostAnalysis(posts, users) : null,
        productivity: todos && users ? getProductivityStats(todos, users) : null,
        countries: countries ? getCountryStats(countries) : null,
        rawUsers: users,
      });
    } catch (err) {
      console.error("Data processing error:", err);
      setErrors(prev => ({ ...prev, processing: err.message }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <div>
          <h1>⚡ DevPulse Dashboard</h1>
          <p>Live developer analytics</p>
        </div>
        <div className="dashboard-header-actions">
          {user && (
            <div className="dashboard-user">
              <div className="dashboard-user-avatar">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="dashboard-user-name">{user.name}</span>
            </div>
          )}
          {user?.role === 'admin' && (
            <Link
              href="/admin"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 13px',
                borderRadius: 8,
                background: 'rgba(79,70,229,0.12)',
                color: 'var(--primary-color)',
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
                border: '1px solid var(--primary-muted)',
                transition: 'background 0.15s ease',
              }}
              id="admin-panel-link"
              title="Open Admin Panel"
            >
              <Shield size={14} />
              Admin Panel
            </Link>
          )}
          <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button className="refresh-btn" onClick={fetchAll}>
            <RefreshCw size={15} /> Refresh
          </button>
          <button className="logout-btn" onClick={logout} title="Sign out">
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="error-banner">
          ⚠️ Some modules failed to load: {Object.keys(errors).join(', ')}
        </div>
      )}

      <div className="tab-bar">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="main-content">
        {loading ? (
          <div className="loading-wrapper">
            <div className="spinner" />
            <p>Loading dashboard data...</p>
          </div>
        ) : (
          <div>
            {activeTab === 'Overview' && (
              <ErrorBoundary boundaryName="Overview">
                <OverviewPanel data={dashData} />
              </ErrorBoundary>
            )}
            {activeTab === 'Users' && (
              <ErrorBoundary boundaryName="Users">
                <UsersPanel data={dashData.users} />
              </ErrorBoundary>
            )}
            {activeTab === 'Posts' && (
              <ErrorBoundary boundaryName="Posts">
                <PostsPanel data={dashData.posts} />
              </ErrorBoundary>
            )}
            {activeTab === 'Productivity' && (
              <ErrorBoundary boundaryName="Productivity">
                <ProductivityPanel data={dashData.productivity} />
              </ErrorBoundary>
            )}
            {activeTab === 'Trivia' && (
              <ErrorBoundary boundaryName="Trivia">
                <TriviaPanel />
              </ErrorBoundary>
            )}
            {activeTab === 'Countries' && (
              <ErrorBoundary boundaryName="Countries">
                <CountriesPanel data={dashData.countries} />
              </ErrorBoundary>
            )}
          </div>
        )}
      </div>

      {loadTime && (
        <div className="dashboard-footer">
          ⚡ Dashboard loaded in {loadTime}ms
        </div>
      )}
    </div>
  );
}
