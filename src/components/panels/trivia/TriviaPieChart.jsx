'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import SectionTitle from '../../shared/SectionTitle';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#1a1a2e',
        borderRadius: '8px',
        padding: '10px 16px',
        color: '#fff',
        fontSize: '13px',
      }}>
        <p style={{ fontWeight: '700' }}>{payload[0].name}</p>
        <p>Questions: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function TriviaPieChart({ results }) {
  return (
    <div className="chart-card">
      <SectionTitle>Questions by Difficulty</SectionTitle>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={[
                { name: 'Easy', value: results.filter(q => q.difficulty === 'easy').length },
                { name: 'Medium', value: results.filter(q => q.difficulty === 'medium').length },
                { name: 'Hard', value: results.filter(q => q.difficulty === 'hard').length },
              ]}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={4}
              dataKey="value"
            >
              <Cell fill="#10b981" />
              <Cell fill="#FFC000" />
              <Cell fill="#FF6B6B" />
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
