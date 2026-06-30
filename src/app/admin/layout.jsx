'use client';

import '@/styles/AdminPanel.css';
import AdminSidebar from '@/components/admin/AdminSidebar';

/**
 * Admin layout — fixed sidebar + scrollable main content area.
 * This layout wraps all /admin/* routes.
 * The AdminProtectedPage guard is applied inside each page individually
 * so the loading spinner renders in the correct content area.
 */
export default function AdminLayout({ children }) {
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-main">
        {children}
      </div>
    </div>
  );
}
