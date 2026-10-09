import React from 'react';

const MONTH_NAMES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SET', 'OCT', 'NOV', 'DIC'];

export const CalendarDateBadge = ({ dateString, size = 'md' }) => {
  let month = 'OCT';
  let day = '14';

  if (dateString) {
    try {
      const d = new Date(dateString);
      if (!isNaN(d.getTime())) {
        month = MONTH_NAMES[d.getMonth()] || 'OCT';
        day = String(d.getDate()).padStart(2, '0');
      }
    } catch {
      // fallback
    }
  }

  const isSmall = size === 'sm';

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center shadow-sm overflow-hidden"
      style={{
        width: isSmall ? '44px' : '54px',
        height: isSmall ? '48px' : '58px',
        borderRadius: '10px',
        border: '1px solid #E6E1EE',
        backgroundColor: '#FFFFFF',
        flexShrink: 0
      }}
    >
      <div
        className="w-100 text-white fw-bold d-flex align-items-center justify-content-center"
        style={{
          backgroundColor: '#6B2FA8',
          fontSize: isSmall ? '0.62rem' : '0.68rem',
          height: isSmall ? '16px' : '18px',
          letterSpacing: '0.5px'
        }}
      >
        {month}
      </div>
      <div
        className="fw-bold d-flex align-items-center justify-content-center flex-grow-1"
        style={{
          color: '#1E1728',
          fontSize: isSmall ? '1.05rem' : '1.25rem',
          lineHeight: 1
        }}
      >
        {day}
      </div>
    </div>
  );
};
