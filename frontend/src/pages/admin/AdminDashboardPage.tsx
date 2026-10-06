import React from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import {
  Users,
  Compass,
  Calendar,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Award,
  Layers,
  FileSpreadsheet
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const clubs = storageService.getClubs();
  const activities = storageService.getActivities();
  const users = storageService.getUsers();
  const registrations = storageService.getRegistrations();
  const auditLogs = storageService.getAuditLogs();

  const activeClubs = clubs.filter(c => c.status === 'published').length;
  const underReviewClubs = clubs.filter(c => c.status === 'under_review').length;
  const totalRegistrations = registrations.length;
  const totalPresent = registrations.filter(r => r.attendanceStatus === 'present').length;

  const categories = ['Tecnología', 'Académico', 'Social', 'Arte', 'Deportes', 'Cultura'] as const;

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800 }}>Tablero General de Gestión y Métricas</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
            Dirección de Bienestar Estudiantil • Supervisión del Ciclo Académico 2026-2
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/clubes" className="btn btn-secondary btn-sm">
            <Compass size={15} />
            <span>Gestionar Clubes</span>
          </Link>
          <Link to="/admin/reportes" className="btn btn-primary btn-sm">
            <FileSpreadsheet size={15} />
            <span>Generar Reportes CSV</span>
          </Link>
        </div>
      </div>

      {/* KPI CARDS GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {/* KPI 1: Clubes Activos */}
        <div className="card" style={{ padding: '24px', borderLeft: '5px solid var(--color-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Clubes Oficiales
            </span>
            <div style={{ backgroundColor: 'var(--color-primary-soft)', padding: '8px', borderRadius: '8px', color: 'var(--color-primary)' }}>
              <Compass size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1.1 }}>
            {activeClubs}
          </div>
          <div style={{ fontSize: '0.8rem', color: underReviewClubs > 0 ? 'var(--color-warning)' : 'var(--color-text-muted)', marginTop: '8px', fontWeight: 500 }}>
            {underReviewClubs > 0 ? `⚠️ ${underReviewClubs} solicitud(es) pendientes de revisión` : 'Todos los clubes al día'}
          </div>
        </div>

        {/* KPI 2: Estudiantes Inscritos en Agrupaciones */}
        <div className="card" style={{ padding: '24px', borderLeft: '5px solid var(--color-accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Estudiantes Activos
            </span>
            <div style={{ backgroundColor: 'rgba(23, 162, 162, 0.15)', padding: '8px', borderRadius: '8px', color: 'var(--color-accent)' }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1.1 }}>
            {clubs.reduce((acc, c) => acc + c.memberCount, 0)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-success)', marginTop: '8px', fontWeight: 600 }}>
            ↑ +18% de participación vs ciclo 2026-1
          </div>
        </div>

        {/* KPI 3: Actividades Programadas */}
        <div className="card" style={{ padding: '24px', borderLeft: '5px solid var(--color-success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Actividades del Ciclo
            </span>
            <div style={{ backgroundColor: 'var(--color-success-soft)', padding: '8px', borderRadius: '8px', color: 'var(--color-success)' }}>
              <Calendar size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1.1 }}>
            {activities.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>
            {activities.filter(a => a.status === 'scheduled').length} eventos programados
          </div>
        </div>

        {/* KPI 4: Total Asistencias Efectivas */}
        <div className="card" style={{ padding: '24px', borderLeft: '5px solid #E1306C' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Inscripciones Totales
            </span>
            <div style={{ backgroundColor: '#FCE8EF', padding: '8px', borderRadius: '8px', color: '#B5305F' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1.1 }}>
            {totalRegistrations}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-success)', marginTop: '8px', fontWeight: 600 }}>
            {totalPresent} asistencias verificadas
          </div>
        </div>
      </div>

      {/* CHARTS & DISTRIBUTION SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', marginBottom: '32px' }}>
        {/* Category distribution */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '18px' }}>
            Distribución de Clubes por Categoría
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {categories.map((cat, idx) => {
              const count = clubs.filter(c => c.category === cat).length;
              const percentage = Math.round((count / (clubs.length || 1)) * 100);

              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600 }}>{cat}</span>
                    <span style={{ color: 'var(--color-text-muted)' }}>{count} clubes ({percentage}%)</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: 'var(--color-surface-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${percentage}%`,
                      backgroundColor: 'var(--color-primary)',
                      borderRadius: '999px'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit Log Recent Actions */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
              Bitácora de Auditoría Administrativa
            </h3>
            <span className="badge badge-info">{auditLogs.length} registros</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
            {auditLogs.map(log => (
              <div key={log.id} style={{
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-surface-subtle)',
                border: '1px solid var(--color-border-subtle)',
                fontSize: '0.84rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ color: 'var(--color-primary)' }}>{log.action}</strong>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                    {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div style={{ color: 'var(--color-text)' }}>
                  Afectado: <strong>{log.target}</strong>
                </div>
                {log.reason && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    Motivo: <em>"{log.reason}"</em>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
