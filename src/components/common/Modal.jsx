import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = '540px'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{
        backgroundColor: 'rgba(30, 23, 40, 0.65)',
        backdropFilter: 'blur(3px)',
        zIndex: 1050,
        animation: 'fadeIn 0.15s ease'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-3 shadow-lg w-100 overflow-hidden d-flex flex-column"
        style={{
          maxWidth: maxWidth,
          maxHeight: '90vh',
          border: '1px solid #E6E1EE',
          animation: 'scaleUp 0.15s ease'
        }}
      >
        {/* Header */}
        <div
          className="d-flex align-items-start justify-content-between p-3 border-bottom"
          style={{ backgroundColor: '#FBFAFD' }}
        >
          <div>
            <h5 className="fw-bold mb-1" style={{ color: '#1E1728' }}>
              {title}
            </h5>
            {subtitle && (
              <p className="text-muted small mb-0">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            className="btn btn-sm btn-light rounded-circle text-muted"
            style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Body */}
        <div className="p-3 overflow-auto flex-grow-1" style={{ color: '#1E1728' }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className="p-3 border-top d-flex align-items-center justify-content-end gap-2"
            style={{ backgroundColor: '#FBFAFD' }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
