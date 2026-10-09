import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storageService } from '../../services/storageService.js';
import { ContextBar } from '../../components/layout/ContextBar.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faXmark,
  faCheckDouble,
  faArrowLeft,
  faMagnifyingGlass,
  faLock
} from '@fortawesome/free-solid-svg-icons';

export const AttendancePage = () => {
  const { id, actId } = useParams();
  const clubId = id || 'club-robotica';
  const activityId = actId || 'act-1';

  const club = storageService.getClubById(clubId) || storageService.getClubs()[0];
  const activity = storageService.getActivityById(activityId) || storageService.getActivities()[0];

  const [search, setSearch] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [, setRefresh] = useState(0);

  if (!activity || !club) return null;

  const confirmedAttendees = storageService
    .getRegistrationsByActivityId(activity.id)
    .filter(r => r.status === 'confirmada');

  const attendedCount = confirmedAttendees.filter(r => r.attended === 'asistio').length;
  const missedCount = confirmedAttendees.filter(r => r.attended === 'falto').length;
  const attendancePercentage = confirmedAttendees.length > 0
    ? Math.round((attendedCount / confirmedAttendees.length) * 100)
    : 0;

  const filteredAttendees = confirmedAttendees.filter(r => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return r.userName.toLowerCase().includes(q) || r.userEmail.toLowerCase().includes(q);
  });

  const handleSetAttendance = (regId, status) => {
    if (isLocked) return;
    storageService.updateAttendance(regId, status, 'Sofía Vega');
    setRefresh(r => r + 1);
  };

  const handleMarkAllAttended = () => {
    if (isLocked) return;
    confirmedAttendees.forEach(r => {
      storageService.updateAttendance(r.id, 'asistio', 'Sofía Vega');
    });
    setRefresh(r => r + 1);
  };

  const handleCloseRegister = () => {
    if (window.confirm('¿Seguro que deseas cerrar el registro de asistencia? No se permitirán más cambios.')) {
      setIsLocked(true);
    }
  };

  return (
    <div>
      <ContextBar />

      <div className="container py-4 pb-5" style={{ maxWidth: '1060px' }}>
        <div className="mb-3">
          <Link
            to={`/club-admin/${club.id}/actividades`}
            className="text-decoration-none small text-muted d-inline-flex align-items-center gap-1.5"
          >
            <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '0.75rem' }} />
            <span>Volver a Actividades</span>
          </Link>
        </div>

        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div>
            <h3 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
              Control de Asistencia en Vivo
            </h3>
            <p className="text-muted small mb-0">
              Actividad: <strong>{activity.title}</strong> — {activity.location}
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            {!isLocked && (
              <>
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm rounded-pill px-3 d-flex align-items-center gap-1.5"
                  onClick={handleMarkAllAttended}
                >
                  <FontAwesomeIcon icon={faCheckDouble} />
                  <span>Marcar todos presentes</span>
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm rounded-pill px-3 d-flex align-items-center gap-1.5"
                  onClick={handleCloseRegister}
                >
                  <FontAwesomeIcon icon={faLock} />
                  <span>Cerrar registro</span>
                </button>
              </>
            )}
            {isLocked && (
              <span className="badge bg-secondary rounded-pill p-2 px-3">
                <FontAwesomeIcon icon={faLock} className="me-1" />
                Registro cerrado
              </span>
            )}
          </div>
        </div>

        {/* METRICS STRIP */}
        <div className="row g-3 mb-4">
          <div className="col-4">
            <div className="p-3 bg-white border rounded-3 text-center shadow-sm">
              <div className="fw-bold fs-4 text-dark">{confirmedAttendees.length}</div>
              <div className="text-muted small" style={{ fontSize: '0.78rem' }}>Total Confirmados</div>
            </div>
          </div>
          <div className="col-4">
            <div className="p-3 bg-white border rounded-3 text-center shadow-sm">
              <div className="fw-bold fs-4 text-success">{attendedCount} ({attendancePercentage}%)</div>
              <div className="text-muted small" style={{ fontSize: '0.78rem' }}>Asistieron</div>
            </div>
          </div>
          <div className="col-4">
            <div className="p-3 bg-white border rounded-3 text-center shadow-sm">
              <div className="fw-bold fs-4 text-danger">{missedCount}</div>
              <div className="text-muted small" style={{ fontSize: '0.78rem' }}>Ausentes / No asistieron</div>
            </div>
          </div>
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
              placeholder="Buscar asistente por nombre o correo institucional..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ borderColor: '#D6CEE2' }}
            />
          </div>
        </div>

        {/* ATTENDEES TABLE */}
        <div
          className="card border rounded-4 shadow-sm overflow-hidden"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
        >
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th>Estudiante</th>
                  <th>Correo</th>
                  <th>Ticket QR</th>
                  <th>Estado Actual</th>
                  <th className="text-end">Marcación</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendees.map((reg) => (
                  <tr key={reg.id}>
                    <td className="fw-semibold" style={{ color: '#1E1728' }}>{reg.userName}</td>
                    <td className="text-muted">{reg.userEmail}</td>
                    <td>
                      <code className="text-purple">{reg.ticketQrCode || 'ULIMA-VU-2026'}</code>
                    </td>
                    <td>
                      <span
                        className={`badge rounded-pill fw-semibold ${
                          reg.attended === 'asistio'
                            ? 'bg-success-subtle text-success border border-success-subtle'
                            : reg.attended === 'falto'
                            ? 'bg-danger-subtle text-danger border border-danger-subtle'
                            : 'bg-light text-muted border'
                        }`}
                        style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                      >
                        {reg.attended === 'asistio' ? 'Asistió' : reg.attended === 'falto' ? 'Faltó' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="text-end">
                      {!isLocked ? (
                        <div className="d-inline-flex gap-1.5">
                          <button
                            type="button"
                            className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                              reg.attended === 'asistio' ? 'btn-success text-white' : 'btn-outline-success'
                            }`}
                            style={{ fontSize: '0.76rem' }}
                            onClick={() => handleSetAttendance(reg.id, 'asistio')}
                          >
                            <FontAwesomeIcon icon={faCheck} className="me-1" />
                            Presente
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                              reg.attended === 'falto' ? 'btn-danger text-white' : 'btn-outline-danger'
                            }`}
                            style={{ fontSize: '0.76rem' }}
                            onClick={() => handleSetAttendance(reg.id, 'falto')}
                          >
                            <FontAwesomeIcon icon={faXmark} className="me-1" />
                            Ausente
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted small">Cerrado</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
