import React from 'react';

const STATUS_CONFIG = {
  // Clubs
  'activo': { label: 'Activo', bg: '#EDFDF5', text: '#0E7047', border: '#C7F8DD' },
  'en_pausa': { label: 'En pausa', bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
  'suspendido': { label: 'Suspendido', bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' },
  'oculto': { label: 'Oculto', bg: '#F3F4F6', text: '#4B5563', border: '#E5E7EB' },

  // Membresías / Solicitudes
  'pendiente': { label: 'Pendiente', bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
  'rechazado': { label: 'Rechazado', bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' },
  'retirado': { label: 'Retirado', bg: '#F3F4F6', text: '#6B7280', border: '#E5E7EB' },

  // Actividades
  'publicada': { label: 'Publicada', bg: '#EDFDF5', text: '#0E7047', border: '#C7F8DD' },
  'borrador': { label: 'Borrador', bg: '#F3F4F6', text: '#4B5563', border: '#E5E7EB' },
  'en_curso': { label: 'En curso', bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  'finalizada': { label: 'Finalizada', bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' },
  'cancelada': { label: 'Cancelada', bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' },

  // Inscripciones
  'confirmada': { label: 'Confirmada', bg: '#EDFDF5', text: '#0E7047', border: '#C7F8DD' },
  'lista_espera': { label: 'Lista de espera', bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
  
  // Asistencia
  'asistio': { label: 'Asistió', bg: '#EDFDF5', text: '#0E7047', border: '#C7F8DD' },
  'falto': { label: 'No asistió', bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' },

  // Admisión modo
  'abierto': { label: 'Ingreso Abierto', bg: '#EDFDF5', text: '#0E7047', border: '#C7F8DD' },
  'convocatoria': { label: 'Con aprobación previa', bg: '#F5F2FC', text: '#6B2FA8', border: '#DDD4F6' },
  'cerrado': { label: 'Ingreso Cerrado', bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' }
};

export const StatusBadge = ({ status, className = '' }) => {
  const config = STATUS_CONFIG[status] || {
    label: status,
    bg: '#F3F4F6',
    text: '#4B5563',
    border: '#E5E7EB'
  };

  return (
    <span
      className={`badge fw-semibold px-2 py-1 ${className}`}
      style={{
        backgroundColor: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
        borderRadius: '999px',
        fontSize: '0.75rem',
        letterSpacing: '0.2px'
      }}
    >
      {config.label}
    </span>
  );
};
