import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../../services/storageService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { ClubInitialsBadge } from '../../components/common/ClubInitialsBadge.jsx';
import { CategoryBadge } from '../../components/common/CategoryBadge.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComments,
  faArrowRight,
  faClock,
  faXmark,
  faCompass
} from '@fortawesome/free-solid-svg-icons';

export const MyClubsPage = () => {
  const { currentUser } = useAuth();
  const [, setRefresh] = useState(0);

  if (!currentUser) {
    return (
      <div className="container py-5 text-center">
        <h4>Debes iniciar sesión para ver tus clubes</h4>
        <Link to="/login" className="btn btn-primary rounded-pill mt-3">Iniciar Sesión</Link>
      </div>
    );
  }

  const userMemberships = storageService.getMembershipsByUserId(currentUser.id);
  const activeMemberships = userMemberships.filter(m => m.status === 'activo');
  const pendingMemberships = userMemberships.filter(m => m.status === 'pendiente');
  const historicalMemberships = userMemberships.filter(m => m.status === 'rechazado' || m.status === 'retirado');

  const handleCancelRequest = (membershipId) => {
    if (window.confirm('¿Seguro que deseas cancelar esta solicitud de postulación?')) {
      storageService.removeMember(membershipId, 'Cancelada por el estudiante');
      setRefresh(r => r + 1);
    }
  };

  return (
    <div className="container py-4 pb-5" style={{ maxWidth: '980px' }}>
      <div className="mb-4">
        <span className="badge px-3 py-1.5 rounded-pill mb-2 fw-semibold" style={{ backgroundColor: '#F0E9F9', color: '#6B2FA8' }}>
          PARTICIPACIÓN ESTUDIANTIL
        </span>
        <h2 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
          Mis Clubes
        </h2>
        <p className="text-muted small mb-0">
          Gestiona las agrupaciones a las que perteneces, accede a sus tablones y revisa el estado de tus postulaciones
        </p>
      </div>

      {/* SECTION 1: ACTIVOS */}
      <div className="mb-5">
        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#1E1728' }}>
          <span>Clubes Activos</span>
          <span className="badge rounded-pill bg-light text-dark border">{activeMemberships.length}</span>
        </h5>

        {activeMemberships.length === 0 ? (
          <div
            className="card border rounded-4 p-4 text-center shadow-sm"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
          >
            <p className="text-muted small mb-3">Aún no eres miembro de ningún club universitario.</p>
            <div>
              <Link
                to="/directorio"
                className="btn btn-primary btn-sm rounded-pill px-4 d-inline-flex align-items-center gap-2"
                style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
              >
                <FontAwesomeIcon icon={faCompass} />
                <span>Explorar Directorio de Clubes</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="row g-3">
            {activeMemberships.map((mem) => {
              const club = storageService.getClubById(mem.clubId);
              return (
                <div key={mem.id} className="col-12 col-md-6">
                  <div
                    className="card border rounded-4 p-4 shadow-sm h-100 d-flex flex-column justify-content-between"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
                  >
                    <div>
                      <div className="d-flex align-items-start justify-content-between mb-3">
                        <div className="d-flex align-items-center gap-3">
                          <ClubInitialsBadge initials={club?.shortName || 'CL'} size={46} />
                          <div>
                            <h6 className="fw-bold mb-0" style={{ color: '#1E1728' }}>
                              {mem.clubName}
                            </h6>
                            <span className="badge bg-secondary-subtle text-secondary rounded-pill text-capitalize" style={{ fontSize: '0.72rem' }}>
                              Rol: {mem.roleInClub}
                            </span>
                          </div>
                        </div>
                        {club && <CategoryBadge category={club.category} />}
                      </div>

                      <p className="text-muted small mb-3" style={{ fontSize: '0.84rem' }}>
                        {club?.description || 'Club oficial de la Universidad de Lima.'}
                      </p>
                    </div>

                    <div className="pt-3 border-top d-flex align-items-center justify-content-between">
                      <Link
                        to={`/club/${mem.clubId}`}
                        className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                        style={{ borderColor: '#E6E1EE', fontSize: '0.8rem', color: '#6E6580' }}
                      >
                        Ver ficha
                      </Link>
                      <Link
                        to={`/tablon/${mem.clubId}`}
                        className="btn btn-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-1.5"
                        style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8', fontSize: '0.8rem' }}
                      >
                        <FontAwesomeIcon icon={faComments} />
                        <span>Tablón de anuncios</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: PENDIENTES */}
      <div className="mb-5">
        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#1E1728' }}>
          <span>Postulaciones en Revisión</span>
          <span className="badge rounded-pill bg-light text-dark border">{pendingMemberships.length}</span>
        </h5>

        {pendingMemberships.length === 0 ? (
          <div className="text-muted small p-3 bg-white border rounded-3 text-center">
            No tienes solicitudes de postulación pendientes en este ciclo.
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {pendingMemberships.map((mem) => (
              <div
                key={mem.id}
                className="card border rounded-3 p-3 shadow-sm bg-white d-flex flex-md-row align-items-md-center justify-content-between gap-3"
                style={{ borderColor: '#E6E1EE' }}
              >
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <h6 className="fw-bold mb-0" style={{ color: '#1E1728' }}>{mem.clubName}</h6>
                    <span className="badge bg-warning-subtle text-warning rounded-pill d-flex align-items-center gap-1" style={{ fontSize: '0.72rem' }}>
                      <FontAwesomeIcon icon={faClock} /> En evaluación
                    </span>
                  </div>
                  <p className="text-muted small mb-0" style={{ fontSize: '0.8rem' }}>
                    Motivación enviada: "{mem.motivation}"
                  </p>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm rounded-pill px-3"
                    style={{ fontSize: '0.78rem' }}
                    onClick={() => handleCancelRequest(mem.id)}
                  >
                    <FontAwesomeIcon icon={faXmark} className="me-1" />
                    Cancelar solicitud
                  </button>
                  <Link
                    to={`/club/${mem.clubId}`}
                    className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                    style={{ fontSize: '0.78rem', borderColor: '#E6E1EE' }}
                  >
                    Ver club
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 3: HISTORIAL */}
      {historicalMemberships.length > 0 && (
        <div>
          <h5 className="fw-bold mb-3" style={{ color: '#1E1728' }}>
            Historial de Solicitudes y Membresías Pasadas
          </h5>
          <div className="table-responsive bg-white border rounded-3">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th>Club</th>
                  <th>Estado</th>
                  <th>Detalle / Motivo</th>
                </tr>
              </thead>
              <tbody>
                {historicalMemberships.map((mem) => (
                  <tr key={mem.id}>
                    <td className="fw-semibold">{mem.clubName}</td>
                    <td><StatusBadge status={mem.status} /></td>
                    <td className="text-muted">{mem.rejectionReason || 'Finalización de ciclo'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
