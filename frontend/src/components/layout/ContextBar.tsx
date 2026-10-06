import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { ExternalLink } from 'lucide-react';

export const ContextBar: React.FC = () => {
  const { currentUser, activeRole } = useAuth();

  if (activeRole !== 'directive' || !currentUser) return null;

  const clubId = currentUser.managedClubId || 'club-robotica';
  const club = storageService.getClubById(clubId);
  const pendingRequests = storageService.getMembershipsByClubId(clubId).filter(m => m.status === 'pending').length;

  const navItems = [
    { label: 'Perfil', path: `/gestion-club/${clubId}/perfil` },
    { label: 'Imágenes', path: `/gestion-club/${clubId}/imagenes` },
    { label: 'Ingreso', path: `/gestion-club/${clubId}/ingreso` },
    { label: `Solicitudes (${pendingRequests})`, path: `/gestion-club/${clubId}/solicitudes` },
    { label: 'Miembros', path: `/gestion-club/${clubId}/miembros` },
    { label: 'Actividades', path: `/gestion-club/${clubId}/actividades` },
    { label: 'Tablón', path: `/gestion-club/${clubId}/tablon` },
  ];

  return (
    <div style={{
      backgroundColor: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      boxShadow: '0 2px 4px rgba(30, 23, 40, 0.03)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 'var(--contextbar-height)',
        gap: '16px',
        overflowX: 'auto'
      }}>
        {/* Club identifier badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.82rem'
          }}>
            {club?.code || 'RB'}
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-text)' }}>
            {club?.name || 'Club de Robótica Ulima'}
          </span>
        </div>

        {/* Navigation tabs */}
        <nav aria-label="Menú de gestión de club" style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          {navItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              style={({ isActive }) => ({
                padding: '8px 14px',
                fontSize: '0.84rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                borderRadius: '4px 4px 0 0',
                transition: 'var(--transition)',
                whiteSpace: 'nowrap'
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Quick link to public view */}
        <Link
          to={`/clubes/${clubId}`}
          target="_blank"
          className="btn btn-outline btn-sm"
          style={{
            fontSize: '0.8rem',
            padding: '5px 12px',
            flexShrink: 0,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>Ver ficha pública</span>
          <ExternalLink size={13} />
        </Link>
      </div>
    </div>
  );
};
