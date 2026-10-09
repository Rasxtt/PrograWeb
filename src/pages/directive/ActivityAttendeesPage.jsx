import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storageService } from '../../services/storageService.js';
import { ContextBar } from '../../components/layout/ContextBar.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDownload,
  faClipboardCheck,
  faArrowUp,
  faArrowLeft,
  faUsers
} from '@fortawesome/free-solid-svg-icons';

export const ActivityAttendeesPage = () => {
  const { id, actId } = useParams();
  const clubId = id || 'club-robotica';
  const activityId = actId || 'act-1';

  const club = storageService.getClubById(clubId) || storageService.getClubs()[0];
  const activity = storageService.getActivityById(activityId) || storageService.getActivities()[0];
  const [, setRefresh] = useState(0);

  if (!activity || !club) return null;

  const registrations = storageService.getRegistrationsByActivityId(activity.id);
  const confirmedList = registrations.filter(r => r.status === 'confirmada');
  const waitingList = registrations
    .filter(r => r.status === 'lista_espera')
    .sort((a, b) => (a.waitingListOrder || 0) - (b.waitingListOrder || 0));

  const handlePromote = () => {
    storageService.promoteFromWaitingList(activity.id);
    setRefresh(r => r + 1);
  };

  const handleExportCSV = () => {
    const rows = [
      ['ID', 'Nombre', 'Correo', 'Estado', 'Asistencia', 'Ticket QR'],
      ...confirmedList.map(r => [r.id, r.userName, r.userEmail, r.status, r.attended, r.ticketQrCode || ''])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `inscritos-${activity.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              Inscritos y Lista de Espera
            </h3>
            <p className="text-muted small mb-0">
              Actividad: <strong>{activity.title}</strong> — {new Date(activity.date).toLocaleDateString()}
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm rounded-pill px-3 d-flex align-items-center gap-1.5"
              onClick={handleExportCSV}
            >
              <FontAwesomeIcon icon={faDownload} />
              <span>Exportar lista CSV</span>
            </button>

            <Link
              to={`/club-admin/${club.id}/actividades/${activity.id}/asistencia`}
              className="btn btn-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-1.5"
              style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
            >
              <FontAwesomeIcon icon={faClipboardCheck} />
              <span>Control de asistencia</span>
            </Link>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="row g-3 mb-4">
          <div className="col-4">
            <div className="p-3 bg-white border rounded-3 text-center shadow-sm">
              <div className="fw-bold fs-4 text-success">{confirmedList.length} / {activity.capacity}</div>
              <div className="text-muted small" style={{ fontSize: '0.78rem' }}>Vacantes Confirmadas</div>
            </div>
          </div>
          <div className="col-4">
            <div className="p-3 bg-white border rounded-3 text-center shadow-sm">
              <div className="fw-bold fs-4 text-warning">{waitingList.length}</div>
              <div className="text-muted small" style={{ fontSize: '0.78rem' }}>En Lista de Espera</div>
            </div>
          </div>
          <div className="col-4">
            <div className="p-3 bg-white border rounded-3 text-center shadow-sm">
              <div className="fw-bold fs-4 text-primary">{Math.max(0, activity.capacity - confirmedList.length)}</div>
              <div className="text-muted small" style={{ fontSize: '0.78rem' }}>Cupos Disponibles</div>
            </div>
          </div>
        </div>

        {/* SECTION 1: CONFIRMED TABLE */}
        <div
          className="card border rounded-4 shadow-sm overflow-hidden mb-4"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
        >
          <div className="p-3 border-bottom bg-light d-flex align-items-center justify-content-between">
            <h6 className="fw-bold mb-0" style={{ color: '#1E1728' }}>
              Inscritos Confirmados ({confirmedList.length})
            </h6>
          </div>

          {confirmedList.length === 0 ? (
            <div className="p-4 text-center text-muted small">No hay alumnos confirmados aún.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 small">
                <thead className="table-light">
                  <tr>
                    <th>Estudiante</th>
                    <th>Correo Institucional</th>
                    <th>Fecha Registro</th>
                    <th>Ticket / Código</th>
                    <th>Estado Asistencia</th>
                  </tr>
                </thead>
                <tbody>
                  {confirmedList.map((reg) => (
                    <tr key={reg.id}>
                      <td className="fw-semibold">{reg.userName}</td>
                      <td className="text-muted">{reg.userEmail}</td>
                      <td className="text-muted">{new Date(reg.registeredAt).toLocaleDateString()}</td>
                      <td>
                        <code className="text-purple">{reg.ticketQrCode || 'ULIMA-VU-2026'}</code>
                      </td>
                      <td>
                        <StatusBadge status={reg.attended} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* SECTION 2: WAITING LIST */}
        <div
          className="card border rounded-4 shadow-sm overflow-hidden"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
        >
          <div className="p-3 border-bottom bg-light d-flex align-items-center justify-content-between">
            <h6 className="fw-bold mb-0" style={{ color: '#1E1728' }}>
              Lista de Espera ({waitingList.length})
            </h6>
            {waitingList.length > 0 && confirmedList.length < activity.capacity && (
              <button
                type="button"
                className="btn btn-outline-success btn-sm rounded-pill px-3"
                style={{ fontSize: '0.78rem' }}
                onClick={handlePromote}
              >
                <FontAwesomeIcon icon={faArrowUp} className="me-1" />
                Promover siguiente en cola
              </button>
            )}
          </div>

          {waitingList.length === 0 ? (
            <div className="p-4 text-center text-muted small">No hay alumnos en lista de espera.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 small">
                <thead className="table-light">
                  <tr>
                    <th>Posición</th>
                    <th>Estudiante</th>
                    <th>Correo Institucional</th>
                    <th>Fecha de Registro</th>
                    <th className="text-end">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {waitingList.map((reg, idx) => (
                    <tr key={reg.id}>
                      <td>
                        <span className="badge rounded-pill bg-warning text-dark">
                          #{reg.waitingListOrder || idx + 1}
                        </span>
                      </td>
                      <td className="fw-semibold">{reg.userName}</td>
                      <td className="text-muted">{reg.userEmail}</td>
                      <td className="text-muted">{new Date(reg.registeredAt).toLocaleDateString()}</td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-outline-success btn-sm rounded-pill"
                          style={{ fontSize: '0.74rem' }}
                          onClick={handlePromote}
                        >
                          Promover vacante
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
