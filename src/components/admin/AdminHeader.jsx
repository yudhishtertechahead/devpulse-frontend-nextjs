'use client';

import { Sun, Moon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function AdminHeader({ title }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="admin-header">
      <span className="admin-header-title">{title}</span>
      <div className="admin-header-actions">
        {user && (
          <div className="admin-header-user">
            <div className="admin-header-avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <span>{user.name}</span>
          </div>
        )}
        <button
          className="admin-theme-btn"
          onClick={toggleTheme}
          title="Toggle theme"
          aria-label="Toggle colour theme"
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>
    </header>
  );
}
