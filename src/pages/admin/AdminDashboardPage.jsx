import React from 'react';
import { storageService } from '../../services/storageService.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faCalendarCheck,
  faLayerGroup,
  faCheckDouble,
  faDownload,
  faChartPie,
  faBuildingColumns
} from '@fortawesome/free-solid-svg-icons';

export const AdminDashboardPage = () => {
  const metrics = storageService.getAdminMetrics();
  const clubs = storageService.getClubs();
  const activities = storageService.getActivities();

  const categoryDistribution = [
    { name: 'Tecnología', count: clubs.filter(c => c.category === 'Tecnología').length, color: '#5A3FA0' },
    { name: 'Académico', count: clubs.filter(c => c.category === 'Académico').length, color: '#B5305F' },
    { name: 'Cultural', count: clubs.filter(c => c.category === 'Cultural').length, color: '#2563A8' },
    { name: 'Deportivo', count: clubs.filter(c => c.category === 'Deportivo').length, color: '#1F7A4D' },
    { name: 'Voluntariado', count: clubs.filter(c => c.category === 'Voluntariado').length, color: '#C2681C' },
    { name: 'Artístico', count: clubs.filter(c => c.category === 'Artístico').length, color: '#A63BA6' }
  ];

  const handleExportReport = () => {
    const reportText = `REPORTE EJECUTIVO - VIDA UNIVERSITARIA ULIMA 2026-2\n` +
      `Generado: ${new Date().toLocaleString()}\n` +
      `---------------------------------------------------\n` +
      `Clubes Activos: ${metrics.activeClubsCount} de ${metrics.totalClubsCount}\n` +
      `Actividades Organizadas: ${metrics.activitiesCount}\n` +
      `Miembros Estudiantiles: ${metrics.activeMembersCount}\n` +
      `Inscripciones a Eventos: ${metrics.totalRegistrationsCount}\n` +
      `Usuarios Activos: ${metrics.activeUsersCount}\n` +
      `Cuentas Sancionadas: ${metrics.blockedUsersCount}\n`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte-bienestar-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container py-4 pb-5">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <span className="badge px-3 py-1.5 rounded-pill mb-2 fw-semibold" style={{ backgroundColor: '#1E1728', color: '#17A2A2', border: '1px solid #3D2D52' }}>
            DIRECCIÓN DE BIENESTAR ESTUDIANTIL
          </span>
          <h2 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
            Tablero General de Control Institucional
          </h2>
          <p className="text-muted small mb-0">
            Resumen de indicadores clave de participación, aforo y estado general de clubes 2026-2
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary btn-sm rounded-pill px-3 d-flex align-items-center gap-2"
          onClick={handleExportReport}
        >
          <FontAwesomeIcon icon={faDownload} />
          <span>Exportar informe ejecutivo</span>
        </button>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border rounded-4 p-3 shadow-sm bg-white" style={{ borderColor: '#E6E1EE' }}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small text-muted fw-semibold">Clubes Oficiales</span>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white"
                style={{ width: '38px', height: '38px', backgroundColor: '#6B2FA8' }}
              >
                <FontAwesomeIcon icon={faBuildingColumns} />
              </div>
            </div>
            <div className="fw-bold fs-3" style={{ color: '#1E1728' }}>
              {metrics.activeClubsCount}
            </div>
            <div className="small text-muted" style={{ fontSize: '0.75rem' }}>
              {metrics.totalClubsCount} registrados en total
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border rounded-4 p-3 shadow-sm bg-white" style={{ borderColor: '#E6E1EE' }}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small text-muted fw-semibold">Actividades del Ciclo</span>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white"
                style={{ width: '38px', height: '38px', backgroundColor: '#17A2A2' }}
              >
                <FontAwesomeIcon icon={faCalendarCheck} />
              </div>
            </div>
            <div className="fw-bold fs-3" style={{ color: '#1E1728' }}>
              {metrics.activitiesCount}
            </div>
            <div className="small text-muted" style={{ fontSize: '0.75rem' }}>
              Talleres, charlas y torneos
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border rounded-4 p-3 shadow-sm bg-white" style={{ borderColor: '#E6E1EE' }}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small text-muted fw-semibold">Miembros Activos</span>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white"
                style={{ width: '38px', height: '38px', backgroundColor: '#0E7047' }}
              >
                <FontAwesomeIcon icon={faUsers} />
              </div>
            </div>
            <div className="fw-bold fs-3" style={{ color: '#1E1728' }}>
              {metrics.activeMembersCount}
            </div>
            <div className="small text-muted" style={{ fontSize: '0.75rem' }}>
              En padrones de membresía
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border rounded-4 p-3 shadow-sm bg-white" style={{ borderColor: '#E6E1EE' }}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small text-muted fw-semibold">Inscripciones a Eventos</span>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white"
                style={{ width: '38px', height: '38px', backgroundColor: '#C2681C' }}
              >
                <FontAwesomeIcon icon={faCheckDouble} />
              </div>
            </div>
            <div className="fw-bold fs-3" style={{ color: '#1E1728' }}>
              {metrics.totalRegistrationsCount}
            </div>
            <div className="small text-muted" style={{ fontSize: '0.75rem' }}>
              {metrics.attendedCount} asistencias validadas
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS / DISTRIBUTIONS SECTION */}
      <div className="row g-4 mb-4">
        {/* Category breakdown */}
        <div className="col-12 col-lg-6">
          <div
            className="card border rounded-4 p-4 shadow-sm bg-white h-100"
            style={{ borderColor: '#E6E1EE' }}
          >
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#1E1728' }}>
              <FontAwesomeIcon icon={faChartPie} style={{ color: '#6B2FA8' }} />
              <span>Distribución de Clubes por Categoría</span>
            </h5>

            <div className="d-flex flex-column gap-2.5">
              {categoryDistribution.map((cat) => {
                const pct = Math.round((cat.count / clubs.length) * 100) || 0;
                return (
                  <div key={cat.name}>
                    <div className="d-flex justify-content-between small mb-1">
                      <span className="fw-semibold">{cat.name}</span>
                      <span className="text-muted">{cat.count} clubes ({pct}%)</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${pct}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Audit Log */}
        <div className="col-12 col-lg-6">
          <div
            className="card border rounded-4 p-4 shadow-sm bg-white h-100"
            style={{ borderColor: '#E6E1EE' }}
          >
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#1E1728' }}>
              <FontAwesomeIcon icon={faLayerGroup} style={{ color: '#6B2FA8' }} />
              <span>Registro de Auditoría y Acciones Recientes</span>
            </h5>

            <div className="overflow-auto" style={{ maxHeight: '250px' }}>
              <ul className="list-unstyled d-flex flex-column gap-2 mb-0 small">
                {storageService.getAuditLogs().map((log) => (
                  <li key={log.id} className="p-2 rounded bg-light border">
                    <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.72rem' }}>
                      <span className="fw-bold text-dark">{log.action}</span>
                      <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div className="text-dark fw-semibold">{log.entityName}</div>
                    <div className="text-muted" style={{ fontSize: '0.74rem' }}>{log.details}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
