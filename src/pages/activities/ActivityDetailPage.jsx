import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { storageService } from '../../services/storageService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { CalendarDateBadge } from '../../components/common/CalendarDateBadge.jsx';
import { CategoryBadge } from '../../components/common/CategoryBadge.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faMapPin,
  faUsers,
  faCheckCircle,
  faQrcode,
  faTicket,
  faArrowLeft,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';

export const ActivityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const activity = storageService.getActivityById(id || 'act-1') || storageService.getActivities()[0];

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [ticketCode, setTicketCode] = useState('');
  const [isWaitingListResult, setIsWaitingListResult] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [error, setError] = useState('');
  const [, setRefresh] = useState(0);

  if (!activity) {
    return (
      <div className="container py-5 text-center">
        <h4>Actividad no encontrada</h4>
        <Link to="/cartelera" className="btn btn-primary rounded-pill mt-3">Volver a la cartelera</Link>
      </div>
    );
  }

  const existingReg = currentUser
    ? storageService.getUserRegistrationInActivity(currentUser.id, activity.id)
    : null;

  const isConfirmed = existingReg && existingReg.status === 'confirmada';
  const isWaiting = existingReg && existingReg.status === 'lista_espera';

  const remaining = Math.max(0, activity.capacity - (activity.registeredCount || 0));
  const isFull = remaining === 0;

  const handleRegisterClick = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setError('');
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSubmit = () => {
    if (!acceptTerms) {
      setError('Debes aceptar el compromiso de asistencia.');
      return;
    }

    try {
      const reg = storageService.registerForActivity(currentUser.id, activity.id, acceptTerms);
      setIsConfirmModalOpen(false);
      setTicketCode(reg.ticketQrCode || 'ULIMA-VU-2026');
      setIsWaitingListResult(reg.status === 'lista_espera');
      setIsSuccessModalOpen(true);
      setRefresh(r => r + 1);
    } catch (err) {
      setError(err.message || 'Error al procesar la inscripción.');
    }
  };

  return (
    <div className="container py-4 pb-5" style={{ maxWidth: '980px' }}>
      {/* Breadcrumb */}
      <div className="mb-3">
        <Link
          to="/cartelera"
          className="text-decoration-none small text-muted d-inline-flex align-items-center gap-1.5"
        >
          <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '0.75rem' }} />
          <span>Volver a Cartelera</span>
        </Link>
      </div>

      <div className="row g-4">
        {/* LEFT COLUMN: ACTIVITY DETAILS */}
        <div className="col-12 col-lg-8">
          <div
            className="card border rounded-4 p-4 shadow-sm mb-4"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
          >
            {/* Header */}
            <div className="d-flex align-items-start gap-3 mb-3">
              <CalendarDateBadge dateString={activity.date} size="md" />
              <div className="flex-grow-1">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <span className="small text-muted fw-semibold">{activity.clubName}</span>
                  <CategoryBadge category={activity.category} />
                </div>
                <h3 className="fw-bold mb-0" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
                  {activity.title}
                </h3>
              </div>
            </div>

            {/* General Description */}
            <h5 className="fw-bold mt-4 mb-2" style={{ color: '#1E1728' }}>
              Descripción del Evento
            </h5>
            <p className="small text-muted" style={{ lineHeight: 1.7, fontSize: '0.92rem' }}>
              {activity.detailedDescription || activity.description}
            </p>

            {/* Requisitos */}
            <h5 className="fw-bold mt-4 mb-2" style={{ color: '#1E1728' }}>
              Requisitos y Materiales
            </h5>
            <ul className="small text-muted ps-3 mb-4" style={{ lineHeight: 1.7 }}>
              <li>Carné de estudiante universitario físico o digital (App Ulima).</li>
              <li>Puntualidad en el ingreso (tolerancia de 10 minutos).</li>
              <li>Traer laptop con cargador para los ejercicios prácticos.</li>
            </ul>

            {/* Ponentes */}
            <h5 className="fw-bold mt-2 mb-2" style={{ color: '#1E1728' }}>
              Expositores y Facilitadores
            </h5>
            <p className="small text-muted mb-0">
              Mesa directiva del {activity.clubName} con asesoría de la Facultad de Ingeniería.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: REGISTRATION SIDEBAR */}
        <div className="col-12 col-lg-4">
          <div
            className="card border rounded-4 p-4 shadow-sm position-sticky"
            style={{ top: '80px', backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
          >
            <h5 className="fw-bold mb-3" style={{ color: '#1E1728' }}>
              Ficha de Inscripción
            </h5>

            <div className="d-flex flex-column gap-2.5 small text-muted mb-4">
              <div className="d-flex align-items-start gap-2">
                <FontAwesomeIcon icon={faClock} style={{ color: '#6B2FA8', marginTop: '3px' }} />
                <div>
                  <div className="fw-semibold text-dark">Horario:</div>
                  <div>{activity.time || '17:00 - 19:30'} hrs</div>
                </div>
              </div>

              <div className="d-flex align-items-start gap-2">
                <FontAwesomeIcon icon={faMapPin} style={{ color: '#6B2FA8', marginTop: '3px' }} />
                <div>
                  <div className="fw-semibold text-dark">Lugar:</div>
                  <div>{activity.location}</div>
                </div>
              </div>

              <div className="d-flex align-items-start gap-2">
                <FontAwesomeIcon icon={faUsers} style={{ color: '#6B2FA8', marginTop: '3px' }} />
                <div>
                  <div className="fw-semibold text-dark">Aforo y Cupos:</div>
                  <div>{activity.registeredCount || 0} de {activity.capacity} registrados</div>
                </div>
              </div>
            </div>

            {/* Capacity Progress Bar */}
            <div className="mb-4">
              <div className="d-flex justify-content-between small text-muted mb-1">
                <span>Ocupación</span>
                <span className="fw-bold">{Math.round(((activity.registeredCount || 0) / activity.capacity) * 100)}%</span>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${Math.min(100, Math.round(((activity.registeredCount || 0) / activity.capacity) * 100))}%`,
                    backgroundColor: isFull ? '#B91C1C' : '#6B2FA8'
                  }}
                />
              </div>
              <div className="small text-muted mt-1">
                {isFull ? (
                  <span className="text-danger fw-semibold">¡Cupos regulares agotados!</span>
                ) : (
                  <span>Quedan <strong>{remaining}</strong> cupos disponibles</span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            {isConfirmed ? (
              <div>
                <div className="alert alert-success py-2 px-3 small rounded-3 mb-3 d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <span>¡Ya estás inscrito en esta actividad!</span>
                </div>
                <Link
                  to="/mis-inscripciones"
                  className="btn btn-outline-primary w-100 rounded-pill btn-sm d-flex align-items-center justify-content-center gap-2"
                  style={{ borderColor: '#6B2FA8', color: '#6B2FA8' }}
                >
                  <FontAwesomeIcon icon={faTicket} />
                  <span>Ver mi entrada / Código QR</span>
                </Link>
              </div>
            ) : isWaiting ? (
              <div className="alert alert-warning py-2 px-3 small rounded-3 mb-0">
                <div className="fw-bold mb-1">En lista de espera</div>
                <div>Estás en posición para acceder si un alumno cancela su asistencia.</div>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-primary w-100 rounded-pill py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2"
                style={{
                  backgroundColor: isFull ? '#C2681C' : '#6B2FA8',
                  borderColor: isFull ? '#C2681C' : '#6B2FA8'
                }}
                onClick={handleRegisterClick}
              >
                <span>{isFull ? 'Unirme a la lista de espera' : 'Inscribirme ahora'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL (Mockup 5.1_modal_inscripcion.png) */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title={isFull ? 'Unirse a Lista de Espera' : 'Confirmar Inscripción'}
        subtitle={`Actividad: ${activity.title}`}
        maxWidth="480px"
      >
        <div className="py-2">
          {error && (
            <div className="alert alert-danger py-2 small mb-3">
              {error}
            </div>
          )}

          {isFull ? (
            <div className="alert alert-warning py-2 small mb-3">
              <FontAwesomeIcon icon={faTriangleExclamation} className="me-1" />
              Los cupos regulares están llenos. Se te asignará una vacante de manera automática en orden de llegada si algún inscrito cancela.
            </div>
          ) : (
            <p className="small text-muted mb-3">
              Estás a punto de confirmar tu vacante para este evento organizado por <strong>{activity.clubName}</strong>.
            </p>
          )}

          <div className="p-3 bg-light rounded-3 border mb-3 small">
            <div><strong>Fecha:</strong> {new Date(activity.date).toLocaleDateString()}</div>
            <div><strong>Horario:</strong> {activity.time || '17:00 - 19:30'} hrs</div>
            <div><strong>Lugar:</strong> {activity.location}</div>
          </div>

          <div className="form-check mb-4">
            <input
              className="form-check-input"
              type="checkbox"
              id="acceptT"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            <label className="form-check-label small text-muted" htmlFor="acceptT">
              Me comprometo a asistir puntualmente o cancelar con al menos 24 horas de anticipación.
            </label>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-light btn-sm rounded-pill px-3"
              onClick={() => setIsConfirmModalOpen(false)}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm rounded-pill px-4 fw-semibold"
              style={{
                backgroundColor: isFull ? '#C2681C' : '#6B2FA8',
                borderColor: isFull ? '#C2681C' : '#6B2FA8'
              }}
              onClick={handleConfirmSubmit}
            >
              {isFull ? 'Confirmar lista de espera' : 'Confirmar vacante'}
            </button>
          </div>
        </div>
      </Modal>

      {/* SUCCESS TICKET QR MODAL (Mockup 5.1_modal_confirma_inscripcion.png) */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={isWaitingListResult ? '¡En Lista de Espera!' : '¡Inscripción Exitosa!'}
        maxWidth="460px"
      >
        <div className="text-center py-3">
          <div
            className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: isWaitingListResult ? '#FFF8F0' : '#EDFDF5',
              color: isWaitingListResult ? '#C2681C' : '#0E7047',
              fontSize: '2.2rem'
            }}
          >
            <FontAwesomeIcon icon={isWaitingListResult ? faClock : faCheckCircle} />
          </div>

          <h5 className="fw-bold mb-2" style={{ color: '#1E1728' }}>
            {isWaitingListResult ? 'Registrado en Lista de Espera' : 'Tu vacante está confirmada'}
          </h5>

          {!isWaitingListResult && (
            <div className="p-3 bg-light rounded-3 border my-3 d-inline-block text-center w-100">
              <div className="mb-2">
                <FontAwesomeIcon icon={faQrcode} style={{ fontSize: '4.5rem', color: '#1E1728' }} />
              </div>
              <div className="small fw-bold" style={{ color: '#6B2FA8' }}>
                CÓDIGO: {ticketCode}
              </div>
              <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                Presenta este código o tu carné Ulima en el control de acceso
              </div>
            </div>
          )}

          <p className="text-muted small mb-4">
            {isWaitingListResult
              ? 'Te notificaremos por correo electrónico y en la plataforma si se libera un cupo.'
              : 'Puedes consultar los detalles y gestionar tu entrada en la sección de Mis Inscripciones.'}
          </p>

          <Link
            to="/mis-inscripciones"
            className="btn btn-primary rounded-pill px-4 py-2 w-100 fw-semibold"
            style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
            onClick={() => setIsSuccessModalOpen(false)}
          >
            Ir a Mis Inscripciones
          </Link>
        </div>
      </Modal>
    </div>
  );
};
