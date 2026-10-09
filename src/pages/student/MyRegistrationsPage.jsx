import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../../services/storageService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { CalendarDateBadge } from '../../components/common/CalendarDateBadge.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQrcode,
  faTicket,
  faXmark,
  faCompass,
  faClock,
  faMapPin
} from '@fortawesome/free-solid-svg-icons';

export const MyRegistrationsPage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('proximas'); // 'proximas' | 'historial'
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [cancellingReg, setCancellingReg] = useState(null);
  const [, setRefresh] = useState(0);

  if (!currentUser) {
    return (
      <div className="container py-5 text-center">
        <h4>Debes iniciar sesión para ver tus inscripciones</h4>
        <Link to="/login" className="btn btn-primary rounded-pill mt-3">Iniciar Sesión</Link>
      </div>
    );
  }

  const registrations = storageService.getRegistrationsByUserId(currentUser.id);

  const upcomingRegistrations = registrations.filter(r => r.status === 'confirmada' || r.status === 'lista_espera');
  const pastRegistrations = registrations.filter(r => r.status === 'cancelada' || r.attended !== 'pendiente');

  const handleCancelRegistration = () => {
    if (!cancellingReg) return;
    storageService.cancelRegistration(cancellingReg.id, 'Cancelado por el estudiante');
    setCancellingReg(null);
    setRefresh(r => r + 1);
  };

  return (
    <div className="container py-4 pb-5" style={{ maxWidth: '980px' }}>
      <div className="mb-4">
        <span className="badge px-3 py-1.5 rounded-pill mb-2 fw-semibold" style={{ backgroundColor: '#F0E9F9', color: '#6B2FA8' }}>
          MIS ACTIVIDADES Y TICKETS
        </span>
        <h2 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
          Mis Inscripciones
        </h2>
        <p className="text-muted small mb-0">
          Consulta tus entradas digitales con código QR, estado de lista de espera y asistencia
        </p>
      </div>

      {/* Tabs */}
      <div
        className="card border rounded-4 p-3 mb-4 shadow-sm"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
      >
        <div className="d-flex gap-2">
          <button
            type="button"
            className={`btn btn-sm rounded-pill fw-semibold ${
              activeTab === 'proximas' ? 'btn-primary' : 'btn-light border'
            }`}
            style={{
              backgroundColor: activeTab === 'proximas' ? '#6B2FA8' : '#FBFAFD',
              borderColor: activeTab === 'proximas' ? '#6B2FA8' : '#E6E1EE',
              fontSize: '0.82rem'
            }}
            onClick={() => setActiveTab('proximas')}
          >
            Próximas Actividades ({upcomingRegistrations.length})
          </button>
          <button
            type="button"
            className={`btn btn-sm rounded-pill fw-semibold ${
              activeTab === 'historial' ? 'btn-primary' : 'btn-light border'
            }`}
            style={{
              backgroundColor: activeTab === 'historial' ? '#6B2FA8' : '#FBFAFD',
              borderColor: activeTab === 'historial' ? '#6B2FA8' : '#E6E1EE',
              fontSize: '0.82rem'
            }}
            onClick={() => setActiveTab('historial')}
          >
            Historial de Asistencias ({pastRegistrations.length})
          </button>
        </div>
      </div>

      {/* TAB 1: UPCOMING */}
      {activeTab === 'proximas' && (
        <div>
          {upcomingRegistrations.length === 0 ? (
            <div
              className="card border rounded-4 p-5 text-center shadow-sm"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
            >
              <p className="text-muted small mb-3">No tienes inscripciones activas para próximas actividades.</p>
              <div>
                <Link
                  to="/cartelera"
                  className="btn btn-primary rounded-pill px-4 btn-sm fw-semibold d-inline-flex align-items-center gap-2"
                  style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
                >
                  <FontAwesomeIcon icon={faCompass} />
                  <span>Explorar Cartelera de Eventos</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {upcomingRegistrations.map((reg) => {
                const activity = storageService.getActivityById(reg.activityId);
                const isConfirmed = reg.status === 'confirmada';

                return (
                  <div
                    key={reg.id}
                    className="card border rounded-4 p-4 shadow-sm bg-white"
                    style={{ borderColor: '#E6E1EE' }}
                  >
                    <div className="d-flex flex-wrap align-items-start justify-content-between gap-3">
                      <div className="d-flex align-items-start gap-3">
                        <CalendarDateBadge dateString={activity?.date} />
                        <div>
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="small text-muted fw-semibold">{reg.clubName}</span>
                            <StatusBadge status={reg.status} />
                            {reg.waitingListOrder && (
                              <span className="badge bg-warning-subtle text-warning rounded-pill" style={{ fontSize: '0.72rem' }}>
                                Posición #{reg.waitingListOrder}
                              </span>
                            )}
                          </div>
                          <h5 className="fw-bold mb-1" style={{ color: '#1E1728' }}>
                            {reg.activityTitle}
                          </h5>
                          <div className="d-flex flex-wrap align-items-center gap-3 small text-muted">
                            <span className="d-flex align-items-center gap-1">
                              <FontAwesomeIcon icon={faClock} style={{ color: '#6B2FA8' }} />
                              {activity?.time || '17:00 hrs'}
                            </span>
                            <span className="d-flex align-items-center gap-1">
                              <FontAwesomeIcon icon={faMapPin} style={{ color: '#6B2FA8' }} />
                              {activity?.location || 'Campus Monterrico'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        {isConfirmed && (
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-1.5"
                            style={{ borderColor: '#6B2FA8', color: '#6B2FA8' }}
                            onClick={() => setSelectedTicket(reg)}
                          >
                            <FontAwesomeIcon icon={faQrcode} />
                            <span>Ver Entrada QR</span>
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm rounded-pill px-3"
                          onClick={() => setCancellingReg(reg)}
                        >
                          <FontAwesomeIcon icon={faXmark} className="me-1" />
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: HISTORIAL */}
      {activeTab === 'historial' && (
        <div
          className="card border rounded-4 shadow-sm overflow-hidden"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
        >
          {pastRegistrations.length === 0 ? (
            <div className="p-5 text-center text-muted">
              No tienes historial de asistencias pasadas.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 small">
                <thead className="table-light">
                  <tr>
                    <th>Actividad</th>
                    <th>Club</th>
                    <th>Fecha de Registro</th>
                    <th>Estado de Registro</th>
                    <th>Asistencia</th>
                  </tr>
                </thead>
                <tbody>
                  {pastRegistrations.map((reg) => (
                    <tr key={reg.id}>
                      <td className="fw-semibold">{reg.activityTitle}</td>
                      <td className="text-muted">{reg.clubName}</td>
                      <td className="text-muted">{new Date(reg.registeredAt).toLocaleDateString()}</td>
                      <td><StatusBadge status={reg.status} /></td>
                      <td><StatusBadge status={reg.attended} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TICKET QR MODAL (Mockup 5.2) */}
      {selectedTicket && (
        <Modal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          title="Entrada Digital Ulima"
          subtitle={`Evento: ${selectedTicket.activityTitle}`}
          maxWidth="440px"
        >
          <div className="text-center py-2">
            <div className="p-3 bg-light rounded-4 border mb-3">
              <div className="mb-2">
                <FontAwesomeIcon icon={faQrcode} style={{ fontSize: '7rem', color: '#1E1728' }} />
              </div>
              <div className="fw-bold mb-1" style={{ color: '#6B2FA8' }}>
                {selectedTicket.ticketQrCode || 'ULIMA-VU-2026'}
              </div>
              <div className="small text-muted">
                Estudiante: <strong>{selectedTicket.userName}</strong>
              </div>
            </div>

            <p className="small text-muted mb-3">
              Muestra esta pantalla en el acceso al aula para registrar tu asistencia automáticamente.
            </p>

            <button
              type="button"
              className="btn btn-primary rounded-pill px-4 btn-sm fw-semibold"
              style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
              onClick={() => setSelectedTicket(null)}
            >
              Cerrar entrada
            </button>
          </div>
        </Modal>
      )}

      {/* CANCEL REGISTRATION MODAL */}
      {cancellingReg && (
        <Modal
          isOpen={!!cancellingReg}
          onClose={() => setCancellingReg(null)}
          title="Cancelar Inscripción"
          subtitle={`Actividad: ${cancellingReg.activityTitle}`}
          maxWidth="460px"
        >
          <div className="py-2">
            <div className="alert alert-warning py-2 small mb-3">
              Al cancelar tu inscripción, tu cupo quedará libre y será asignado automáticamente al siguiente alumno en la lista de espera.
            </div>

            <p className="small text-muted mb-4">
              ¿Estás seguro de que no podrás asistir a este evento?
            </p>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-light btn-sm rounded-pill px-3"
                onClick={() => setCancellingReg(null)}
              >
                Volver
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm rounded-pill px-3 fw-semibold"
                onClick={handleCancelRegistration}
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
