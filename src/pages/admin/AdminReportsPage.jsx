import React from 'react';
import { storageService } from '../../services/storageService.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv, faDownload, faFileLines, faChartLine } from '@fortawesome/free-solid-svg-icons';

export const AdminReportsPage = () => {
  const clubs = storageService.getClubs();
  const memberships = storageService.getMemberships();
  const activities = storageService.getActivities();
  const registrations = storageService.getRegistrations();

  const handleDownloadMembersCSV = () => {
    const rows = [
      ['ID', 'Nombre', 'Correo', 'Club', 'Rol en Club', 'Estado', 'Fecha Ingreso'],
      ...memberships.map(m => [m.id, m.userName, m.userEmail, m.clubName, m.roleInClub, m.status, m.joinedAt])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `reporte-padron-miembros-2026-2.csv`;
    link.click();
  };

  const handleDownloadActivitiesCSV = () => {
    const rows = [
      ['ID', 'Título', 'Club', 'Categoría', 'Fecha', 'Aforo', 'Inscritos', 'Estado'],
      ...activities.map(a => [a.id, a.title, a.clubName, a.category, a.date, a.capacity, a.registeredCount, a.status])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `reporte-actividades-2026-2.csv`;
    link.click();
  };

  const sortedClubs = [...clubs].sort((a, b) => (b.memberCount || 0) - (a.memberCount || 0));

  return (
    <div className="container py-4 pb-5">
      <div className="mb-4">
        <h3 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
          Reportes y Estadísticas Institucionales
        </h3>
        <p className="text-muted small mb-0">
          Descarga archivos consolidados para la Dirección de Bienestar Estudiantil y acreditación universitaria
        </p>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-md-4">
          <div className="card border rounded-4 p-4 shadow-sm bg-white h-100" style={{ borderColor: '#E6E1EE' }}>
            <div className="d-flex align-items-center gap-2 mb-2 text-primary">
              <FontAwesomeIcon icon={faFileCsv} className="fs-3" style={{ color: '#6B2FA8' }} />
              <h5 className="fw-bold mb-0" style={{ color: '#1E1728' }}>Padrón de Miembros</h5>
            </div>
            <p className="text-muted small mb-4">
              Listado consolidado de todos los estudiantes inscritos en los 15 clubes oficiales ({memberships.length} registros).
            </p>
            <button
              type="button"
              className="btn btn-outline-primary btn-sm rounded-pill w-100 d-flex align-items-center justify-content-center gap-2 mt-auto"
              style={{ borderColor: '#6B2FA8', color: '#6B2FA8' }}
              onClick={handleDownloadMembersCSV}
            >
              <FontAwesomeIcon icon={faDownload} />
              <span>Descargar CSV</span>
            </button>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border rounded-4 p-4 shadow-sm bg-white h-100" style={{ borderColor: '#E6E1EE' }}>
            <div className="d-flex align-items-center gap-2 mb-2 text-primary">
              <FontAwesomeIcon icon={faFileCsv} className="fs-3" style={{ color: '#17A2A2' }} />
              <h5 className="fw-bold mb-0" style={{ color: '#1E1728' }}>Actividades & Aforo</h5>
            </div>
            <p className="text-muted small mb-4">
              Informe detallado de eventos, aforos programados, asistencia y tasas de ocupación ({activities.length} eventos).
            </p>
            <button
              type="button"
              className="btn btn-outline-info btn-sm rounded-pill w-100 d-flex align-items-center justify-content-center gap-2 mt-auto"
              onClick={handleDownloadActivitiesCSV}
            >
              <FontAwesomeIcon icon={faDownload} />
              <span>Descargar CSV</span>
            </button>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border rounded-4 p-4 shadow-sm bg-white h-100" style={{ borderColor: '#E6E1EE' }}>
            <div className="d-flex align-items-center gap-2 mb-2">
              <FontAwesomeIcon icon={faChartLine} className="fs-3" style={{ color: '#0E7047' }} />
              <h5 className="fw-bold mb-0" style={{ color: '#1E1728' }}>Inscripciones y QR</h5>
            </div>
            <p className="text-muted small mb-4">
              Consolidado de inscripciones estudiantiles con tickets QR y validaciones de entrada ({registrations.length} tickets).
            </p>
            <button
              type="button"
              className="btn btn-outline-success btn-sm rounded-pill w-100 d-flex align-items-center justify-content-center gap-2 mt-auto"
              onClick={handleDownloadMembersCSV}
            >
              <FontAwesomeIcon icon={faDownload} />
              <span>Descargar CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* CLUBS RANKING TABLE */}
      <div
        className="card border rounded-4 shadow-sm overflow-hidden"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
      >
        <div className="p-3 bg-light border-bottom">
          <h6 className="fw-bold mb-0" style={{ color: '#1E1728' }}>
            Ranking de Clubes por Participación Estudiantil
          </h6>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 small">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Club</th>
                <th>Categoría</th>
                <th>Miembros Oficiales</th>
                <th>Actividades Realizadas</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {sortedClubs.map((club, idx) => (
                <tr key={club.id}>
                  <td className="fw-bold">{idx + 1}</td>
                  <td className="fw-semibold">{club.name}</td>
                  <td>{club.category}</td>
                  <td>{club.memberCount || 24}</td>
                  <td>{activities.filter(a => a.clubId === club.id).length}</td>
                  <td>
                    <span className="badge bg-success-subtle text-success rounded-pill">
                      {club.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
