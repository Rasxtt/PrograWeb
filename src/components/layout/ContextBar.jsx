import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { storageService } from '../../services/storageService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

export const ContextBar = () => {
  const { activeDirectiveClubId } = useAuth();
  const club = storageService.getClubById(activeDirectiveClubId) || storageService.getClubs()[0];

  if (!club) return null;

  const pendingRequests = storageService
    .getMembershipsByClubId(club.id)
    .filter(m => m.status === 'pendiente').length;

  const navItems = [
    { label: 'Perfil', path: `/club-admin/${club.id}/perfil` },
    { label: 'Imágenes', path: `/club-admin/${club.id}/imagenes` },
    { label: 'Ingreso', path: `/club-admin/${club.id}/ingreso` },
    { 
      label: 'Solicitudes', 
      path: `/club-admin/${club.id}/solicitudes`, 
      badge: pendingRequests > 0 ? pendingRequests : null 
    },
    { label: 'Miembros', path: `/club-admin/${club.id}/miembros` },
    { label: 'Actividades', path: `/club-admin/${club.id}/actividades` },
    { label: 'Tablón', path: `/club-admin/${club.id}/tablon` }
  ];

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E6E1EE',
        boxShadow: '0 1px 3px rgba(30, 23, 40, 0.05)'
      }}
    >
      <div className="container py-2 d-flex flex-wrap align-items-center justify-content-between gap-3">
        {/* Left: Club badge & title */}
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center text-white fw-bold rounded-3 shadow-sm"
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#6B2FA8',
              fontSize: '0.85rem'
            }}
          >
            {club.shortName || 'RB'}
          </div>
          <div>
            <div className="fw-bold small" style={{ color: '#1E1728' }}>
              {club.name}
            </div>
            <div className="text-muted" style={{ fontSize: '0.72rem' }}>
              Panel de Gestión de Directiva
            </div>
          </div>
        </div>

        {/* Center: Tabs */}
        <nav className="d-flex align-items-center gap-1 overflow-auto py-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-decoration-none px-3 py-1.5 rounded-pill small fw-semibold transition-all d-flex align-items-center gap-1.5 ${
                  isActive
                    ? 'bg-purple-light text-purple'
                    : 'text-secondary hover-bg-light'
                }`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? '#F0E9F9' : 'transparent',
                color: isActive ? '#6B2FA8' : '#6E6580',
                padding: '6px 14px',
                fontSize: '0.82rem'
              })}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className="badge rounded-pill text-white"
                  style={{
                    backgroundColor: '#B5305F',
                    fontSize: '0.68rem',
                    padding: '2px 6px'
                  }}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right: Ver ficha pública */}
        <div>
          <Link
            to={`/club/${club.id}`}
            className="btn btn-outline-secondary btn-sm rounded-pill d-flex align-items-center gap-1.5"
            style={{ fontSize: '0.8rem', borderColor: '#E6E1EE', color: '#6E6580' }}
          >
            <span>Ver ficha pública</span>
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} style={{ fontSize: '0.72rem' }} />
          </Link>
        </div>
      </div>
    </div>
  );
};
