import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import {
  Calendar,
  Clock,
  MapPin,
  QrCode,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  Compass,
  ArrowRight
} from 'lucide-react';

export const MyRegistrationsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [filterTab, setFilterTab] = useState<'upcoming' | 'past'>('upcoming');

  if (!currentUser) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <p>Inicia sesión para ver tus inscripciones a actividades.</p>
        <Link to="/login" className="btn btn-primary" style={{ marginTop: '14px' }}>
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  const allRegistrations = storageService.getRegistrationsByUserId(currentUser.id);

  const upcomingRegistrations = allRegistrations.filter(r => {
    const act = storageService.getActivityById(r.activityId);
    return act && act.status === 'scheduled';
  });

  const pastRegistrations = allRegistrations.filter(r => {
    const act = storageService.getActivityById(r.activityId);
    return act && act.status === 'completed';
  });

  const displayed = filterTab === 'upcoming' ? upcomingRegistrations : pastRegistrations;

  const handleCancel = (regId: string) => {
    if (window.confirm('¿Deseas cancelar esta inscripción? Si tenías cupo confirmado, se otorgará automáticamente al primer alumno en lista de espera.')) {
      storageService.cancelRegistration(regId);
      showToast('Inscripción cancelada con éxito', 'info');
      window.location.reload();
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Mis Inscripciones y Pases</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
            Gestiona tus vacantes a talleres y presenta tus códigos de acceso en las actividades
          </p>
        </div>

        <Link to="/cartelera" className="btn btn-secondary">
          <Compass size={16} />
          <span>Ver Cartelera de Actividades</span>
        </Link>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <button
          onClick={() => setFilterTab('upcoming')}
          className={`btn btn-sm ${filterTab === 'upcoming' ? 'btn-primary' : 'btn-outline'}`}
        >
          Próximas Actividades ({upcomingRegistrations.length})
        </button>
        <button
          onClick={() => setFilterTab('past')}
          className={`btn btn-sm ${filterTab === 'past' ? 'btn-primary' : 'btn-outline'}`}
        >
          Historial y Asistencia ({pastRegistrations.length})
        </button>
      </div>

      {displayed.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '16px' }}>
            No tienes inscripciones en esta sección.
          </p>
          <Link to="/cartelera" className="btn btn-primary btn-sm">
            Explorar Actividades en Cartelera
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {displayed.map(reg => {
            const act = storageService.getActivityById(reg.activityId);
            const club = act ? storageService.getClubById(act.clubId) : undefined;
            if (!act) return null;

            return (
              <div key={reg.id} className="card" style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--color-border)' }}>
                {/* Header Ticket */}
                <div style={{
                  padding: '16px 20px',
                  backgroundColor: reg.status === 'confirmed' ? 'var(--color-primary-soft)' : 'var(--color-warning-soft)',
                  borderBottom: '1px dashed var(--color-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <QrCode size={20} color="var(--color-primary)" />
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-text)' }}>
                      {reg.ticketCode}
                    </span>
                  </div>
                  <span className={`badge ${reg.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                    {reg.status === 'confirmed' ? '✓ Confirmado' : '⏳ Lista de Espera'}
                  </span>
                </div>

                {/* Body Content */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
                    {act.title}
                  </h3>

                  <div style={{ fontSize: '0.82rem', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '14px' }}>
                    {club?.name || 'Club Ulima'}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} />
                      <span>{act.date} • {act.startTime} hrs</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} />
                      <span>{act.location} ({act.modality})</span>
                    </div>
                  </div>

                  {/* Attendance status badge if recorded */}
                  {reg.attendanceStatus && (
                    <div style={{ marginBottom: '14px' }}>
                      <span className="badge badge-success">
                        Asistencia: {reg.attendanceStatus === 'present' ? 'Presente' : reg.attendanceStatus === 'absent' ? 'Ausente' : 'Tardanza'}
                      </span>
                    </div>
                  )}

                  {/* Footer buttons */}
                  <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '14px' }}>
                    <Link to={`/actividades/${act.id}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                      Ver detalles
                    </Link>

                    {act.status === 'scheduled' && (
                      <button
                        onClick={() => handleCancel(reg.id)}
                        className="btn btn-danger btn-sm"
                        style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
