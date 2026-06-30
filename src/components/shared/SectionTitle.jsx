'use client';

/**
 * SectionTitle — renders a themed section heading that automatically adapts
 * to light and dark mode via CSS variables.
 */
export default function SectionTitle({ children }) {
  return (
    <h2 style={{
      fontSize: '16px',
      fontWeight: '700',
      color: 'var(--text-primary)',
      paddingBottom: '10px',
      borderBottom: '2px solid var(--border-color)',
      marginBottom: '20px',
    }}>
      {children}
    </h2>
  );
}
