'use client';

/**
 * StatCard — a reusable metric card that fully respects the active theme.
 * Uses CSS variables so it automatically adapts between light and dark mode
 * without any extra code in the parent component.
 */
export default function StatCard({ icon: Icon, label, value, sub, color = '#4f46e5' }) {
  return (
    <div style={{
      background: 'var(--card-bg)',
      borderRadius: '12px',
      padding: '20px',
      borderLeft: `5px solid ${color}`,
      boxShadow: 'var(--card-shadow)',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      minWidth: '200px',
      flex: '1',
      transition: 'background 0.3s ease, box-shadow 0.3s ease',
    }}>
      {Icon && (
        <div style={{
          background: `${color}22`,
          borderRadius: '50%',
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: '0',
        }}>
          <Icon size={22} color={color} />
        </div>
      )}
      <div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
          {label}
        </div>
        <div style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)' }}>
          {value}
        </div>
        {sub && (
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}
