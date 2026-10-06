import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { AttendanceStatus } from '../../types';
import {
  Download,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  FileSpreadsheet,
  Users,
  QrCode
} from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const { clubId, actId } = useParams<{ clubId: string; actId: string }>();
  const { showToast } = useToast();

  const activity = actId ? storageService.getActivityById(actId) : undefined;
  const club = clubId ? storageService.getClubById(clubId) : undefined;

  const [searchQuery, setSearchQuery] = useState('');

  if (!activity) {
    return <div className="container" style={{ padding: '40px 0' }}>Actividad no encontrada.</div>;
  }

  const registrations = storageService.getRegistrationsByActivityId(activity.id);

  const presentCount = registrations.filter(r => r.attendanceStatus === 'present').length;
  const absentCount = registrations.filter(r => r.attendanceStatus === 'absent').length;
  const lateCount = registrations.filter(r => r.attendanceStatus === 'late').length;

  const handleStatusChange = (regId: string, status: AttendanceStatus) => {
    storageService.updateAttendance(regId, status);
    showToast('Estado de asistencia actualizado', 'info');
  };

  const handleExportCSV = () => {
    const csvData = storageService.exportAttendanceCSV(activity.id);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Asistencia_${activity.title.replace(/\s+/g, '_')}_${activity.date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('¡Archivo CSV de asistencia descargado con éxito!', 'success');
  };

  const filtered = registrations.filter(r => {
    return (
      r.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.userCode.includes(searchQuery) ||
      r.ticketCode.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      {/* Back button */}
      <div style={{ marginBottom: '18px' }}>
        <Link to={`/gestion-club/${clubId}/actividades`} className="btn btn-outline btn-sm" style={{ gap: '6px' }}>
          <ArrowLeft size={15} />
          <span>Volver a Actividades del Club</span>
        </Link>
      </div>

      {/* Header and Stats */}
      <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
              Control y Registro de Asistencia
            </span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{activity.title}</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
              📅 {activity.date} • {activity.startTime} - {activity.endTime} hrs | 📍 {activity.location}
            </p>
          </div>

          {/* Export button */}
          <button onClick={handleExportCSV} className="btn btn-primary" style={{ gap: '8px' }}>
            <Download size={16} />
            <span>Exportar Asistencia a CSV</span>
          </button>
        </div>

        {/* Counter cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px',
          marginTop: '24px',
          borderTop: '1px solid var(--color-border)',
          paddingTop: '20px'
        }}>
          <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-subtle)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Total Inscritos</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text)' }}>{registrations.length}</div>
          </div>

          <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-success-soft)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-success)', fontWeight: 600 }}>Presentes</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-success)' }}>{presentCount}</div>
          </div>

          <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-danger-soft)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-danger)', fontWeight: 600 }}>Ausentes</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-danger)' }}>{absentCount}</div>
          </div>

          <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-warning-soft)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-warning)', fontWeight: 600 }}>Tardanzas</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-warning)' }}>{lateCount}</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '16px', maxWidth: '400px', position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
        <input
          type="text"
          placeholder="Buscar por código, nombre o ticket..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ paddingLeft: '36px' }}
        />
      </div>

      {/* Registrations List Table */}
      <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-surface-subtle)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <th style={{ padding: '14px 20px' }}>Estudiante</th>
              <th style={{ padding: '14px 20px' }}>Código Ulima</th>
              <th style={{ padding: '14px 20px' }}>Pase Ticket</th>
              <th style={{ padding: '14px 20px' }}>Tipo</th>
              <th style={{ padding: '14px 20px', textAlign: 'center' }}>Marcar Asistencia</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  No se encontraron estudiantes inscritos para este filtro.
                </td>
              </tr>
            ) : (
              filtered.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{r.userName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{r.userCareer} • {r.userEmail}</div>
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: 600 }}>
                    {r.userCode}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, backgroundColor: 'var(--color-surface-subtle)', padding: '4px 8px', borderRadius: '4px' }}>
                      {r.ticketCode}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className={`badge ${r.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                      {r.status === 'confirmed' ? 'Confirmado' : 'Lista espera'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        onClick={() => handleStatusChange(r.id, 'present')}
                        className={`btn btn-sm ${r.attendanceStatus === 'present' ? 'btn-primary' : 'btn-outline'}`}
                        style={{
                          backgroundColor: r.attendanceStatus === 'present' ? 'var(--color-success)' : undefined,
                          borderColor: r.attendanceStatus === 'present' ? 'var(--color-success)' : undefined,
                          fontSize: '0.78rem',
                          padding: '4px 10px'
                        }}
                      >
                        Presente
                      </button>

                      <button
                        onClick={() => handleStatusChange(r.id, 'late')}
                        className={`btn btn-sm ${r.attendanceStatus === 'late' ? 'btn-primary' : 'btn-outline'}`}
                        style={{
                          backgroundColor: r.attendanceStatus === 'late' ? 'var(--color-warning)' : undefined,
                          borderColor: r.attendanceStatus === 'late' ? 'var(--color-warning)' : undefined,
                          fontSize: '0.78rem',
                          padding: '4px 10px'
                        }}
                      >
                        Tarde
                      </button>

                      <button
                        onClick={() => handleStatusChange(r.id, 'absent')}
                        className={`btn btn-sm ${r.attendanceStatus === 'absent' ? 'btn-danger' : 'btn-outline'}`}
                        style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                      >
                        Ausente
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
