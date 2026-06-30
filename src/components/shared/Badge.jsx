'use client';

export default function Badge({ children, color = '#4f46e5' }) {
  return (
    <span style={{
      background: `${color}18`,
      color: color,
      border: `1px solid ${color}40`,
      borderRadius: '999px',
      padding: '3px 10px',
      fontSize: '12px',
      fontWeight: '600',
      display: 'inline-block',
    }}>
      {children}
    </span>
  );
}
