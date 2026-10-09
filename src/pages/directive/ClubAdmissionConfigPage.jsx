import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { storageService } from '../../services/storageService.js';
import { ContextBar } from '../../components/layout/ContextBar.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faFloppyDisk,
  faDoorOpen,
  faUserCheck,
  faLock,
  faEye,
  faPause,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons';

export const ClubAdmissionConfigPage = () => {
  const { id } = useParams();
  const clubId = id || 'club-robotica';
  const club = storageService.getClubById(clubId) || storageService.getClubs()[0];

  const [admissionType, setAdmissionType] = useState(club?.admissionType || 'convocatoria');
  const [admissionStatus, setAdmissionStatus] = useState(club?.admissionStatus || 'abierto');
  const [status, setStatus] = useState(club?.status || 'activo');
  const [applicantMessage, setApplicantMessage] = useState(
    club?.applicantMessage ||
    'Buscamos estudiantes con entusiasmo por el desarrollo tecnológico y la robótica. No es indispensable experiencia previa.'
  );

  const [reqCycle, setReqCycle] = useState(true);
  const [reqFaculty, setReqFaculty] = useState(false);
  const [reqHours, setReqHours] = useState(true);

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!club) return null;

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...club,
      admissionType,
      admissionStatus,
      status,
      applicantMessage
    };
    storageService.updateClub(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div>
      <ContextBar />

      <div className="container py-4" style={{ maxWidth: '860px' }}>
        <div className="mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <h3 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
              Configuración de Admisión y Estado
            </h3>
            <p className="text-muted small mb-0">
              Establece las reglas para recibir postulantes y la visibilidad del club en el directorio
            </p>
          </div>
          {savedSuccess && (
            <div className="badge bg-success-subtle text-success p-2 px-3 rounded-pill d-flex align-items-center gap-1.5 border border-success-subtle">
              <FontAwesomeIcon icon={faCheck} />
              <span>Configuración guardada exitosamente</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSave}>
          {/* ADMISSION MODE CARDS */}
          <div
            className="card border rounded-4 p-4 mb-4 shadow-sm"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
          >
            <h5 className="fw-bold mb-1" style={{ color: '#1E1728' }}>
              Modalidad de Admisión
            </h5>
            <p className="text-muted small mb-3">
              Define si los estudiantes ingresan de manera instantánea o requieren filtro de directiva
            </p>

            <div className="row g-3">
              {/* Option 1: Ingreso Abierto */}
              <div className="col-12 col-md-4">
                <div
                  className={`card h-100 p-3 rounded-3 cursor-pointer border-2 transition ${
                    admissionType === 'abierto' ? 'border-primary bg-purple-light' : 'border'
                  }`}
                  style={{
                    cursor: 'pointer',
                    borderColor: admissionType === 'abierto' ? '#6B2FA8' : '#E6E1EE',
                    backgroundColor: admissionType === 'abierto' ? '#FBF9FE' : '#FFFFFF'
                  }}
                  onClick={() => setAdmissionType('abierto')}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <FontAwesomeIcon icon={faDoorOpen} style={{ color: '#0E7047', fontSize: '1.2rem' }} />
                    <input
                      type="radio"
                      name="admissionType"
                      checked={admissionType === 'abierto'}
                      onChange={() => setAdmissionType('abierto')}
                    />
                  </div>
                  <h6 className="fw-bold mb-1" style={{ color: '#1E1728' }}>
                    Ingreso Abierto
                  </h6>
                  <p className="text-muted small mb-0" style={{ fontSize: '0.78rem' }}>
                    Cualquier estudiante se incorpora inmediatamente al hacer clic en "Unirme".
                  </p>
                </div>
              </div>

              {/* Option 2: Convocatoria con filtro */}
              <div className="col-12 col-md-4">
                <div
                  className={`card h-100 p-3 rounded-3 cursor-pointer border-2 transition ${
                    admissionType === 'convocatoria' ? 'border-primary bg-purple-light' : 'border'
                  }`}
                  style={{
                    cursor: 'pointer',
                    borderColor: admissionType === 'convocatoria' ? '#6B2FA8' : '#E6E1EE',
                    backgroundColor: admissionType === 'convocatoria' ? '#FBF9FE' : '#FFFFFF'
                  }}
                  onClick={() => setAdmissionType('convocatoria')}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <FontAwesomeIcon icon={faUserCheck} style={{ color: '#6B2FA8', fontSize: '1.2rem' }} />
                    <input
                      type="radio"
                      name="admissionType"
                      checked={admissionType === 'convocatoria'}
                      onChange={() => setAdmissionType('convocatoria')}
                    />
                  </div>
                  <h6 className="fw-bold mb-1" style={{ color: '#1E1728' }}>
                    Con Aprobación
                  </h6>
                  <p className="text-muted small mb-0" style={{ fontSize: '0.78rem' }}>
                    El estudiante envía postulación con motivación. La directiva evalúa y aprueba.
                  </p>
                </div>
              </div>

              {/* Option 3: Cerrado */}
              <div className="col-12 col-md-4">
                <div
                  className={`card h-100 p-3 rounded-3 cursor-pointer border-2 transition ${
                    admissionType === 'cerrado' ? 'border-primary bg-purple-light' : 'border'
                  }`}
                  style={{
                    cursor: 'pointer',
                    borderColor: admissionType === 'cerrado' ? '#6B2FA8' : '#E6E1EE',
                    backgroundColor: admissionType === 'cerrado' ? '#FBF9FE' : '#FFFFFF'
                  }}
                  onClick={() => setAdmissionType('cerrado')}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <FontAwesomeIcon icon={faLock} style={{ color: '#B91C1C', fontSize: '1.2rem' }} />
                    <input
                      type="radio"
                      name="admissionType"
                      checked={admissionType === 'cerrado'}
                      onChange={() => setAdmissionType('cerrado')}
                    />
                  </div>
                  <h6 className="fw-bold mb-1" style={{ color: '#1E1728' }}>
                    Ingreso Cerrado
                  </h6>
                  <p className="text-muted small mb-0" style={{ fontSize: '0.78rem' }}>
                    No se admiten nuevas solicitudes. Se muestra aviso de convocatoria cerrada.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* APPLICANT MESSAGE */}
          <div
            className="card border rounded-4 p-4 mb-4 shadow-sm"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
          >
            <h5 className="fw-bold mb-1" style={{ color: '#1E1728' }}>
              Mensaje y Criterios para Postulantes
            </h5>
            <p className="text-muted small mb-3">
              Información que visualizará el alumno antes de remitir su postulación
            </p>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Mensaje orientador / Bienvenida</label>
              <textarea
                rows={3}
                className="form-control"
                value={applicantMessage}
                onChange={(e) => setApplicantMessage(e.target.value)}
              />
            </div>

            <div className="pt-2 border-top">
              <div className="small fw-semibold mb-2" style={{ color: '#1E1728' }}>
                Requisitos sugeridos (Checklist informativo):
              </div>
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="reqC"
                  checked={reqCycle}
                  onChange={(e) => setReqCycle(e.target.checked)}
                />
                <label className="form-check-label small" htmlFor="reqC">
                  Estar matriculado en ciclo 2 en adelante
                </label>
              </div>
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="reqF"
                  checked={reqFaculty}
                  onChange={(e) => setReqFaculty(e.target.checked)}
                />
                <label className="form-check-label small" htmlFor="reqF">
                  Pertenecer a carreras afines (Ingeniería o Ciencias Básicas)
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="reqH"
                  checked={reqHours}
                  onChange={(e) => setReqHours(e.target.checked)}
                />
                <label className="form-check-label small" htmlFor="reqH">
                  Disponibilidad de al menos 3 horas semanales para talleres
                </label>
              </div>
            </div>
          </div>

          {/* CLUB STATUS / VISIBILITY */}
          <div
            className="card border rounded-4 p-4 mb-4 shadow-sm"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
          >
            <h5 className="fw-bold mb-1" style={{ color: '#1E1728' }}>
              Estado Institucional del Club
            </h5>
            <p className="text-muted small mb-3">
              Controla la visibilidad general de la agrupación en la plataforma
            </p>

            <div className="d-flex flex-column gap-2">
              <label
                className={`p-3 rounded-3 border d-flex align-items-center gap-3 cursor-pointer ${
                  status === 'activo' ? 'border-success bg-light' : ''
                }`}
                style={{ cursor: 'pointer' }}
              >
                <input
                  type="radio"
                  name="clubStatus"
                  checked={status === 'activo'}
                  onChange={() => setStatus('activo')}
                />
                <div>
                  <div className="fw-semibold small d-flex align-items-center gap-1.5 text-success">
                    <FontAwesomeIcon icon={faEye} />
                    <span>Activo (Visible en Directorio)</span>
                  </div>
                  <div className="text-muted small" style={{ fontSize: '0.78rem' }}>
                    El club figura públicamente y los alumnos pueden explorar su información y actividades.
                  </div>
                </div>
              </label>

              <label
                className={`p-3 rounded-3 border d-flex align-items-center gap-3 cursor-pointer ${
                  status === 'en_pausa' ? 'border-warning bg-light' : ''
                }`}
                style={{ cursor: 'pointer' }}
              >
                <input
                  type="radio"
                  name="clubStatus"
                  checked={status === 'en_pausa'}
                  onChange={() => setStatus('en_pausa')}
                />
                <div>
                  <div className="fw-semibold small d-flex align-items-center gap-1.5 text-warning">
                    <FontAwesomeIcon icon={faPause} />
                    <span>En Pausa (Inactivo temporalmente)</span>
                  </div>
                  <div className="text-muted small" style={{ fontSize: '0.78rem' }}>
                    No recibe postulaciones ni organiza actividades en el presente periodo.
                  </div>
                </div>
              </label>

              <label
                className={`p-3 rounded-3 border d-flex align-items-center gap-3 cursor-pointer ${
                  status === 'oculto' ? 'border-secondary bg-light' : ''
                }`}
                style={{ cursor: 'pointer' }}
              >
                <input
                  type="radio"
                  name="clubStatus"
                  checked={status === 'oculto'}
                  onChange={() => setStatus('oculto')}
                />
                <div>
                  <div className="fw-semibold small d-flex align-items-center gap-1.5 text-secondary">
                    <FontAwesomeIcon icon={faEyeSlash} />
                    <span>Oculto (Solo miembros y administradores)</span>
                  </div>
                  <div className="text-muted small" style={{ fontSize: '0.78rem' }}>
                    Oculto de las búsquedas del directorio general.
                  </div>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2"
            style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
          >
            <FontAwesomeIcon icon={faFloppyDisk} />
            <span>Guardar configuración de admisión</span>
          </button>
        </form>
      </div>
    </div>
  );
};
