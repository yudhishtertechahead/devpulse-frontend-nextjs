'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Shield, BarChart2,
  ArrowLeft, LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const NAV = [
  { href: '/admin',          label: 'Overview',  icon: LayoutDashboard },
  { href: '/admin/users',    label: 'Users',     icon: Users           },
  { href: '/admin/sessions', label: 'Sessions',  icon: Shield          },
  { href: '/admin/quizzes',  label: 'Quizzes',   icon: BarChart2       },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="admin-sidebar">
      {/* Logo */}
      <div className="admin-sidebar-logo">
        <div className="admin-sidebar-logo-title">
          ⚡ DevPulse
          <span className="admin-sidebar-logo-badge">Admin</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="admin-nav" aria-label="Admin navigation">
        <div className="admin-nav-section-label">Management</div>
        {NAV.map(({ href, label, icon: Icon }) => {
          // exact match for /admin, prefix match for sub-routes
          const isActive = href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`admin-nav-link${isActive ? ' active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="admin-sidebar-footer">
        <Link href="/" className="admin-sidebar-back-btn">
          <ArrowLeft size={15} />
          Back to App
        </Link>
        <button className="admin-sidebar-logout-btn" onClick={logout}>
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
