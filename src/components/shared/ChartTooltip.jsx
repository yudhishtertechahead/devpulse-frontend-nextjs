'use client';

export default function ChartTooltip({ active, payload, label, rows }) {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: '#1a1a2e',
        borderRadius: '8px',
        padding: '10px 16px',
        color: '#fff',
        fontSize: '13px',
      }}
    >
      {label && <p style={{ fontWeight: '700', margin: '0 0 6px' }}>{label}</p>}
      {rows
        ? rows(payload, label).map((row, index) => (
            <p key={index} style={{ margin: index === 0 ? 0 : '4px 0 0' }}>
              {row}
            </p>
          ))
        : payload.map((entry, index) => (
            <p key={index} style={{ margin: index === 0 ? 0 : '4px 0 0' }}>
              {entry.name}: {entry.value}
            </p>
          ))}
    </div>
  );
}
