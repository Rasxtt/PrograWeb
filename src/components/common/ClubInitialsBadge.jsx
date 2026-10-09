import React from 'react';

export const ClubInitialsBadge = ({
  initials = 'CL',
  size = 48,
  bgColor = '#6B2FA8',
  textColor = '#FFFFFF',
  borderRadius = '12px',
  className = ''
}) => {
  return (
    <div
      className={`d-flex align-items-center justify-content-center fw-bold shadow-sm ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: bgColor,
        color: textColor,
        borderRadius: borderRadius,
        fontSize: `${size * 0.42}px`,
        flexShrink: 0,
        letterSpacing: '0.5px'
      }}
    >
      {initials}
    </div>
  );
};
