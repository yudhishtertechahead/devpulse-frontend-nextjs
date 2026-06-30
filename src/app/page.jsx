'use client';

import ProtectedPage from '@/components/ProtectedPage';
import DevPulseDashboard from '@/components/DevPulseDashboard';

export default function HomePage() {
  return (
    <ProtectedPage>
      <DevPulseDashboard />
    </ProtectedPage>
  );
}
