import React from 'react';

const CATEGORY_COLORS = {
  'Académico': { bg: '#FDF2F4', text: '#B5305F', border: '#F8D1DB' },
  'Deportivo': { bg: '#F0F9F4', text: '#1F7A4D', border: '#D0ECD8' },
  'Cultural': { bg: '#EFF6FF', text: '#2563A8', border: '#CBE2FE' },
  'Voluntariado': { bg: '#FFF8F0', text: '#C2681C', border: '#FEE0C2' },
  'Tecnología': { bg: '#F5F2FC', text: '#5A3FA0', border: '#DDD4F6' },
  'Artístico': { bg: '#FDF2FA', text: '#A63BA6', border: '#F7D0F2' },
};

export const CategoryBadge = ({ category, className = '' }) => {
  const style = CATEGORY_COLORS[category] || { bg: '#F3F4F6', text: '#4B5563', border: '#E5E7EB' };

  return (
    <span
      className={`badge fw-medium px-2 py-1 ${className}`}
      style={{
        backgroundColor: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
        borderRadius: '999px',
        fontSize: '0.75rem',
        letterSpacing: '0.2px'
      }}
    >
      {category}
    </span>
  );
};
