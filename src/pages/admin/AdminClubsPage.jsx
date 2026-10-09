import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../../services/storageService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { CategoryBadge } from '../../components/common/CategoryBadge.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { ClubInitialsBadge } from '../../components/common/ClubInitialsBadge.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faBan,
  faRotateRight,
  faArrowUpRightFromSquare,
  faTriangleExclamation,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

export const AdminClubsPage = () => {
  const { currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [suspendingClub, setSuspendingClub] = useState(null);
  const [suspensionReason, setSuspensionReason] = useState('Incumplimiento de las normativas de seguridad en eventos o estatutos institucionales');
  const [reactivatingClub, setReactivatingClub] = useState(null);
  const [, setRefresh] = useState(0);

  const clubs = storageService.getClubs();

  const filteredClubs = clubs.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
  });

  const handleConfirmSuspension = () => {
    if (!suspendingClub) return;
    storageService.setClubStatus(
      suspendingClub.id,
      'suspendido',
      suspensionReason,
      currentUser?.email || 'admin@aloe.ulima.edu.pe'
    );
    setSuspendingClub(null);
    setRefresh(r => r + 1);
  };

  const handleConfirmReactivation = () => {
    if (!reactivatingClub) return;
    storageService.setClubStatus(
      reactivatingClub.id,
      'activo',
      undefined,
      currentUser?.email || 'admin@aloe.ulima.edu.pe'
    );
    setReactivatingClub(null);
    setRefresh(r => r + 1);
  };

  return (
    <div className="container py-4 pb-5">
      <div className="mb-4">
        <h3 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
          Gestión y Auditoría de Clubes
        </h3>
        <p className="text-muted small mb-0">
          Supervisión de estados, aplicación de suspensiones y reactivación de agrupaciones estudiantiles
        </p>
      </div>

      {/* SEARCH BAR */}
      <div
        className="card border rounded-4 p-3 mb-4 shadow-sm"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
      >
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0 text-muted" style={{ borderColor: '#D6CEE2' }}>
            <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: '#6B2FA8' }} />
          </span>
          <input
            type="text"
            className="form-control border-start-0 ps-0"
            placeholder="Buscar club por nombre o categoría..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ borderColor: '#D6CEE2' }}
          />
        </div>
      </div>

      {/* CLUBS TABLE */}
      <div
        className="card border rounded-4 shadow-sm overflow-hidden"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
      >
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 small">
            <thead className="table-light">
              <tr>
                <th>Club</th>
                <th>Categoría</th>
                <th>Miembros</th>
                <th>Modalidad Admisión</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredClubs.map((club) => {
                const isSuspended = club.status === 'suspendido';

                return (
                  <tr key={club.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2.5">
                        <ClubInitialsBadge initials={club.shortName} size={38} />
                        <div>
                          <div className="fw-bold" style={{ color: '#1E1728' }}>{club.name}</div>
                          <div className="text-muted" style={{ fontSize: '0.72rem' }}>{club.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td><CategoryBadge category={club.category} /></td>
                    <td className="fw-semibold">{club.memberCount || 24}</td>
                    <td className="text-muted text-capitalize">{club.admissionType}</td>
                    <td>
                      <StatusBadge status={club.status} />
                      {club.suspensionReason && (
                        <div className="text-danger small mt-1" style={{ fontSize: '0.7rem' }}>
                          {club.suspensionReason}
                        </div>
                      )}
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-1.5 align-items-center">
                        <Link
                          to={`/club/${club.id}`}
                          className="btn btn-outline-secondary btn-sm rounded-circle"
                          style={{ width: '32px', height: '32px', padding: 0 }}
                          title="Ver ficha pública"
                        >
                          <FontAwesomeIcon icon={faArrowUpRightFromSquare} style={{ fontSize: '0.75rem' }} />
                        </Link>

                        {isSuspended ? (
                          <button
                            type="button"
                            className="btn btn-outline-success btn-sm rounded-pill px-3"
                            style={{ fontSize: '0.74rem' }}
                            onClick={() => setReactivatingClub(club)}
                          >
                            <FontAwesomeIcon icon={faRotateRight} className="me-1" />
                            Reactivar
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm rounded-pill px-3"
                            style={{ fontSize: '0.74rem' }}
                            onClick={() => {
                              setSuspendingClub(club);
                              setSuspensionReason('Incumplimiento de las normativas de seguridad en eventos o estatutos institucionales');
                            }}
                          >
                            <FontAwesomeIcon icon={faBan} className="me-1" />
                            Suspender
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SUSPENSION MODAL (Mockup 7.2_modal_suspension.png) */}
      {suspendingClub && (
        <Modal
          isOpen={!!suspendingClub}
          onClose={() => setSuspendingClub(null)}
          title="Suspender Club Estudiantil"
          subtitle={`Club: ${suspendingClub.name}`}
          maxWidth="480px"
        >
          <div className="py-2">
            <div className="alert alert-danger py-2 small mb-3">
              <FontAwesomeIcon icon={faTriangleExclamation} className="me-1" />
              La suspensión ocultará las actividades del club y bloqueará nuevas admisiones temporalmente.
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Motivo institucional de la sanción:</label>
              <textarea
                rows={3}
                className="form-control"
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                required
              />
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-light btn-sm rounded-pill px-3"
                onClick={() => setSuspendingClub(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm rounded-pill px-3 fw-semibold"
                onClick={handleConfirmSuspension}
              >
                Confirmar suspensión
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* REACTIVATION MODAL (Mockup 7.2_modal_reactivacion.png) */}
      {reactivatingClub && (
        <Modal
          isOpen={!!reactivatingClub}
          onClose={() => setReactivatingClub(null)}
          title="Reactivar Club Oficial"
          subtitle={`Club: ${reactivatingClub.name}`}
          maxWidth="460px"
        >
          <div className="py-2">
            <div className="text-center my-3">
              <FontAwesomeIcon icon={faCheckCircle} className="text-success fs-1 mb-2" />
              <p className="small text-muted mb-0">
                Se levantará la suspensión del club y volverá a figurar activo en el directorio oficial.
              </p>
            </div>

            <div className="d-flex justify-content-end gap-2 pt-2">
              <button
                type="button"
                className="btn btn-light btn-sm rounded-pill px-3"
                onClick={() => setReactivatingClub(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-success btn-sm rounded-pill px-3 fw-semibold"
                onClick={handleConfirmReactivation}
              >
                Confirmar reactivación
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
