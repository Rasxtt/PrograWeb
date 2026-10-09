import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storageService } from '../../services/storageService.js';
import { ContextBar } from '../../components/layout/ContextBar.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { CategoryBadge } from '../../components/common/CategoryBadge.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faUsers,
  faClipboardCheck,
  faUpload,
  faBan,
  faEye
} from '@fortawesome/free-solid-svg-icons';

export const ClubActivitiesManagePage = () => {
  const { id } = useParams();
  const clubId = id || 'club-robotica';
  const club = storageService.getClubById(clubId) || storageService.getClubs()[0];

  const [activeTab, setActiveTab] = useState('todas'); // 'todas' | 'publicada' | 'borrador' | 'finalizada' | 'cancelada'
  const [publishingAct, setPublishingAct] = useState(null);
  const [cancellingAct, setCancellingAct] = useState(null);
  const [cancelReason, setCancelReason] = useState('Reprogramación de fecha y disponibilidad de laboratorio');
  const [, setRefresh] = useState(0);

  if (!club) return null;

  const activities = storageService.getActivitiesByClubId(club.id);

  const displayedActivities = activities.filter((act) => {
    if (activeTab === 'todas') return true;
    return act.status === activeTab;
  });

  const handleConfirmPublish = () => {
    if (!publishingAct) return;
    storageService.publishActivity(publishingAct.id);
    setPublishingAct(null);
    setRefresh(r => r + 1);
  };

  const handleConfirmCancel = () => {
    if (!cancellingAct) return;
    storageService.cancelActivity(cancellingAct.id, cancelReason);
    setCancellingAct(null);
    setRefresh(r => r + 1);
  };

  return (
    <div>
      <ContextBar />

      <div className="container py-4" style={{ maxWidth: '1060px' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div>
            <h3 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
              Gestión de Actividades del Club
            </h3>
            <p className="text-muted small mb-0">
              Programa talleres, conferencias y competencias, y administra cupos y asistencias
            </p>
          </div>

          <Link
            to={`/club-admin/${club.id}/actividades/nueva`}
            className="btn btn-primary rounded-pill px-4 btn-sm fw-semibold d-flex align-items-center gap-2"
            style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Crear nueva actividad</span>
          </Link>
        </div>

        {/* Status filter tabs */}
        <div
          className="card border rounded-4 p-3 mb-4 shadow-sm"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
        >
          <div className="d-flex flex-wrap gap-2">
            {[
              { id: 'todas', label: 'Todas' },
              { id: 'publicada', label: 'Publicadas' },
              { id: 'borrador', label: 'Borradores' },
              { id: 'cancelada', label: 'Canceladas' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`btn btn-sm rounded-pill fw-semibold ${
                  activeTab === tab.id ? 'btn-primary' : 'btn-light border'
                }`}
                style={{
                  backgroundColor: activeTab === tab.id ? '#6B2FA8' : '#FBFAFD',
                  borderColor: activeTab === tab.id ? '#6B2FA8' : '#E6E1EE',
                  fontSize: '0.82rem'
                }}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Activities Table */}
        <div
          className="card border rounded-4 shadow-sm overflow-hidden"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
        >
          {displayedActivities.length === 0 ? (
            <div className="p-5 text-center text-muted">
              No hay actividades con el estado seleccionado.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 small">
                <thead className="table-light">
                  <tr>
                    <th>Actividad</th>
                    <th>Fecha & Horario</th>
                    <th>Lugar</th>
                    <th>Inscritos / Aforo</th>
                    <th>Estado</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedActivities.map((act) => (
                    <tr key={act.id}>
                      <td>
                        <div className="fw-bold" style={{ color: '#1E1728' }}>
                          {act.title}
                        </div>
                        <CategoryBadge category={act.category} />
                      </td>
                      <td className="text-muted">
                        <div>{new Date(act.date).toLocaleDateString()}</div>
                        <div style={{ fontSize: '0.74rem' }}>{act.time}</div>
                      </td>
                      <td className="text-muted text-truncate" style={{ maxWidth: '160px' }}>
                        {act.location}
                      </td>
                      <td>
                        <div className="fw-semibold">
                          {act.registeredCount || 0} / {act.capacity}
                        </div>
                        {act.waitingListCount > 0 && (
                          <div className="text-warning small" style={{ fontSize: '0.72rem' }}>
                            +{act.waitingListCount} en espera
                          </div>
                        )}
                      </td>
                      <td>
                        <StatusBadge status={act.status} />
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-1.5">
                          {act.status === 'borrador' && (
                            <button
                              type="button"
                              className="btn btn-outline-success btn-sm rounded-pill px-2.5"
                              style={{ fontSize: '0.75rem' }}
                              onClick={() => setPublishingAct(act)}
                            >
                              <FontAwesomeIcon icon={faUpload} className="me-1" />
                              Publicar
                            </button>
                          )}

                          <Link
                            to={`/club-admin/${club.id}/actividades/${act.id}/inscritos`}
                            className="btn btn-outline-secondary btn-sm rounded-circle"
                            style={{ width: '32px', height: '32px', padding: 0 }}
                            title="Ver inscritos y lista de espera"
                          >
                            <FontAwesomeIcon icon={faUsers} />
                          </Link>

                          <Link
                            to={`/club-admin/${club.id}/actividades/${act.id}/asistencia`}
                            className="btn btn-outline-secondary btn-sm rounded-circle"
                            style={{ width: '32px', height: '32px', padding: 0 }}
                            title="Control de asistencia"
                          >
                            <FontAwesomeIcon icon={faClipboardCheck} />
                          </Link>

                          {act.status === 'publicada' && (
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm rounded-circle"
                              style={{ width: '32px', height: '32px', padding: 0 }}
                              title="Cancelar actividad"
                              onClick={() => {
                                setCancellingAct(act);
                                setCancelReason('Reprogramación de fecha y disponibilidad de laboratorio');
                              }}
                            >
                              <FontAwesomeIcon icon={faBan} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* MODAL PUBLICACIÓN (Mockup 4.3_modal_publicacion.png) */}
      {publishingAct && (
        <Modal
          isOpen={!!publishingAct}
          onClose={() => setPublishingAct(null)}
          title="Publicar Actividad en Cartelera"
          subtitle={`Evento: ${publishingAct.title}`}
          maxWidth="460px"
        >
          <div className="py-2">
            <p className="small text-muted mb-3">
              Al publicar este evento, aparecerá inmediatamente en la cartelera general para que todos los estudiantes Ulima puedan inscribirse.
            </p>
            <div className="p-3 bg-light rounded-3 border mb-3 small">
              <div><strong>Fecha:</strong> {new Date(publishingAct.date).toLocaleDateString()}</div>
              <div><strong>Aforo máximo:</strong> {publishingAct.capacity} vacantes</div>
              <div><strong>Lugar:</strong> {publishingAct.location}</div>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-light btn-sm rounded-pill px-3"
                onClick={() => setPublishingAct(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-success btn-sm rounded-pill px-4 fw-semibold"
                onClick={handleConfirmPublish}
              >
                Confirmar publicación
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL CANCELACIÓN (Mockup 4.3_modal_cancelacion.png) */}
      {cancellingAct && (
        <Modal
          isOpen={!!cancellingAct}
          onClose={() => setCancellingAct(null)}
          title="Cancelar Actividad"
          subtitle={`Evento: ${cancellingAct.title}`}
          maxWidth="480px"
        >
          <div className="py-2">
            <div className="alert alert-warning py-2 small mb-3">
              Se notificará automáticamente a los {cancellingAct.registeredCount || 0} estudiantes inscritos sobre la cancelación.
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Motivo de cancelación:</label>
              <textarea
                rows={3}
                className="form-control"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                required
              />
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-light btn-sm rounded-pill px-3"
                onClick={() => setCancellingAct(null)}
              >
                Volver
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm rounded-pill px-3 fw-semibold"
                onClick={handleConfirmCancel}
              >
                Confirmar cancelación
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
