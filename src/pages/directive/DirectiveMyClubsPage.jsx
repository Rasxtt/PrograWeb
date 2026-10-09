import React from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../../services/storageService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { ClubInitialsBadge } from '../../components/common/ClubInitialsBadge.jsx';
import { CategoryBadge } from '../../components/common/CategoryBadge.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faCalendarDays,
  faEnvelopeOpenText,
  faGear,
  faComments,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

export const DirectiveMyClubsPage = () => {
  const { currentUser, setActiveDirectiveClubId } = useAuth();

  // Find clubs where user has directive role
  const memberships = currentUser ? storageService.getMembershipsByUserId(currentUser.id) : [];
  const directiveClubs = memberships.filter(m => m.roleInClub !== 'miembro' && m.status === 'activo');

  // If none directly found, fallback to Club de Robótica for demo
  const displayClubs = directiveClubs.length > 0
    ? directiveClubs.map(m => storageService.getClubById(m.clubId)).filter(Boolean)
    : [storageService.getClubById('club-robotica')].filter(Boolean);

  return (
    <div className="container py-4 pb-5" style={{ maxWidth: '980px' }}>
      <div className="mb-4">
        <span className="badge px-3 py-1.5 rounded-pill mb-2 fw-semibold" style={{ backgroundColor: '#F0E9F9', color: '#6B2FA8' }}>
          GESTIÓN Y LIDERAZGO
        </span>
        <h2 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
          Mis Clubes - Mesa Directiva
        </h2>
        <p className="text-muted small mb-0">
          Agrupaciones en las que tienes permisos de administración de actividades, miembros y admisiones
        </p>
      </div>

      <div className="row g-4">
        {displayClubs.map((club) => {
          const pendingRequests = storageService.getMembershipsByClubId(club.id).filter(m => m.status === 'pendiente').length;
          const clubActivities = storageService.getActivitiesByClubId(club.id).length;

          return (
            <div key={club.id} className="col-12">
              <div
                className="card border rounded-4 p-4 shadow-sm"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
              >
                <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <ClubInitialsBadge initials={club.shortName} size={56} />
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <h4 className="fw-bold mb-0" style={{ color: '#1E1728' }}>
                          {club.name}
                        </h4>
                        <CategoryBadge category={club.category} />
                      </div>
                      <span className="badge bg-purple-light text-purple rounded-pill fw-semibold" style={{ fontSize: '0.74rem' }}>
                        Cargo: Mesa Directiva / Presidente
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/club/${club.id}`}
                    className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                    style={{ borderColor: '#E6E1EE', fontSize: '0.8rem' }}
                  >
                    Ver ficha pública
                  </Link>
                </div>

                {/* Metrics strip for this club */}
                <div className="row g-2 mb-4 text-center">
                  <div className="col-4">
                    <div className="p-3 rounded-3 bg-light border">
                      <div className="fw-bold fs-5" style={{ color: '#1E1728' }}>{club.memberCount || 24}</div>
                      <div className="text-muted small" style={{ fontSize: '0.75rem' }}>Miembros oficiales</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-3 rounded-3 bg-light border">
                      <div className="fw-bold fs-5 text-warning">{pendingRequests}</div>
                      <div className="text-muted small" style={{ fontSize: '0.75rem' }}>Postulaciones pendientes</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-3 rounded-3 bg-light border">
                      <div className="fw-bold fs-5 text-primary">{clubActivities}</div>
                      <div className="text-muted small" style={{ fontSize: '0.75rem' }}>Actividades organizadas</div>
                    </div>
                  </div>
                </div>

                {/* Quick Action buttons matching mockup 2.1 */}
                <div className="d-flex flex-wrap gap-2 pt-3 border-top">
                  <Link
                    to={`/club-admin/${club.id}/solicitudes`}
                    className="btn btn-outline-primary btn-sm rounded-pill d-flex align-items-center gap-1.5"
                    style={{ borderColor: '#6B2FA8', color: '#6B2FA8' }}
                    onClick={() => setActiveDirectiveClubId(club.id)}
                  >
                    <FontAwesomeIcon icon={faEnvelopeOpenText} />
                    <span>Bandeja de solicitudes</span>
                    {pendingRequests > 0 && (
                      <span className="badge bg-danger rounded-pill" style={{ fontSize: '0.65rem' }}>
                        {pendingRequests}
                      </span>
                    )}
                  </Link>

                  <Link
                    to={`/club-admin/${club.id}/miembros`}
                    className="btn btn-outline-secondary btn-sm rounded-pill d-flex align-items-center gap-1.5"
                    style={{ borderColor: '#E6E1EE' }}
                    onClick={() => setActiveDirectiveClubId(club.id)}
                  >
                    <FontAwesomeIcon icon={faUsers} />
                    <span>Gestionar miembros</span>
                  </Link>

                  <Link
                    to={`/club-admin/${club.id}/actividades`}
                    className="btn btn-outline-secondary btn-sm rounded-pill d-flex align-items-center gap-1.5"
                    style={{ borderColor: '#E6E1EE' }}
                    onClick={() => setActiveDirectiveClubId(club.id)}
                  >
                    <FontAwesomeIcon icon={faCalendarDays} />
                    <span>Actividades</span>
                  </Link>

                  <Link
                    to={`/club-admin/${club.id}/tablon`}
                    className="btn btn-outline-secondary btn-sm rounded-pill d-flex align-items-center gap-1.5"
                    style={{ borderColor: '#E6E1EE' }}
                    onClick={() => setActiveDirectiveClubId(club.id)}
                  >
                    <FontAwesomeIcon icon={faComments} />
                    <span>Tablón de anuncios</span>
                  </Link>

                  <Link
                    to={`/club-admin/${club.id}/perfil`}
                    className="btn btn-outline-secondary btn-sm rounded-pill d-flex align-items-center gap-1.5 ms-auto"
                    style={{ borderColor: '#E6E1EE' }}
                    onClick={() => setActiveDirectiveClubId(club.id)}
                  >
                    <FontAwesomeIcon icon={faGear} />
                    <span>Configurar club</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
