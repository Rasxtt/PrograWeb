import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  ArrowLeft,
  XCircle,
  FileSpreadsheet,
  Share2
} from 'lucide-react';

export const ActivityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, activeRole } = useAuth();
  const { showToast } = useToast();

  const activity = id ? storageService.getActivityById(id) : undefined;

  if (!activity) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Actividad no encontrada</h2>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '8px', marginBottom: '20px' }}>
          La actividad solicitada no existe o ha sido cancelada.
        </p>
        <Link to="/cartelera" className="btn btn-primary">
          Regresar a la Cartelera
        </Link>
      </div>
    );
  }

  const club = storageService.getClubById(activity.clubId);
  const userRegistration = currentUser
    ? storageService.getRegistrationsByActivityId(activity.id).find(r => r.userId === currentUser.id && r.status !== 'cancelled')
    : null;

  const isDirectiveOfClub = currentUser && (club?.directiveLeaderId === currentUser.id || currentUser.managedClubId === club?.id);
  const spotsLeft = activity.capacity - activity.enrolledCount;
  const isFull = spotsLeft <= 0;

  const handleRegister = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (currentUser.isBlocked) {
      showToast(`Tu cuenta se encuentra bloqueada: ${currentUser.blockReason}`, 'danger');
      return;
    }

    const { registration, isWaitlist } = storageService.registerToActivity(activity.id, currentUser);
    if (isWaitlist) {
      showToast('Los cupos están completos. Te has registrado en la Lista de Espera.', 'warning');
    } else {
      showToast('¡Inscripción confirmada exitosamente! Tienes tu cupo reservado.', 'success');
    }
    navigate('.', { replace: true });
  };

  const handleCancelRegistration = () => {
    if (!userRegistration) return;
    if (window.confirm('¿Seguro que deseas cancelar tu inscripción? Si tienes un cupo confirmado, se reasignará automáticamente al siguiente estudiante en lista de espera.')) {
      storageService.cancelRegistration(userRegistration.id);
      showToast('Inscripción cancelada. Vacante reasignada.', 'info');
      navigate('.', { replace: true });
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      {/* Back button */}
      <div style={{ marginBottom: '20px' }}>
        <Link to="/cartelera" className="btn btn-outline btn-sm" style={{ gap: '6px' }}>
          <ArrowLeft size={15} />
          <span>Volver a Cartelera</span>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        {/* Main Info */}
        <div>
          {/* Header Card */}
          <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className={`badge badge-cat-${activity.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}>
                {activity.category}
              </span>
              <span className="badge badge-primary">{activity.modality}</span>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>
              {activity.title}
            </h1>

            <div style={{ fontSize: '0.95rem', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '20px' }}>
              Organizado por: <Link to={`/clubes/${activity.clubId}`} style={{ textDecoration: 'underline' }}>{club?.name || 'Club Ulima'}</Link>
            </div>

            {/* Quick Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '14px',
              backgroundColor: 'var(--color-surface-subtle)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={18} color="var(--color-primary)" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Fecha</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{activity.date}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={18} color="var(--color-primary)" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Horario</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{activity.startTime} - {activity.endTime} hrs</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={18} color="var(--color-primary)" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Lugar</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{activity.location}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>
              Descripción y Objetivos
            </h3>
            <p style={{ color: 'var(--color-text)', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '24px' }}>
              {activity.description}
            </p>

            {/* Tags */}
            {activity.tags && activity.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {activity.tags.map((tag, idx) => (
                  <span key={idx} className="badge badge-info" style={{ fontSize: '0.78rem' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Registration / Ticket Card */}
        <div>
          <div className="card" style={{ padding: '28px', position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '14px' }}>
              Inscripción y Aforo
            </h3>

            {/* Spots capacity bar */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Ocupación de cupos:</span>
                <span style={{ fontWeight: 700 }}>{activity.enrolledCount} / {activity.capacity}</span>
              </div>
              <div style={{
                height: '8px',
                borderRadius: '999px',
                backgroundColor: 'var(--color-border)',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, (activity.enrolledCount / activity.capacity) * 100)}%`,
                  backgroundColor: isFull ? 'var(--color-warning)' : 'var(--color-success)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <div style={{ fontSize: '0.8rem', color: isFull ? 'var(--color-warning)' : 'var(--color-success)', marginTop: '6px', fontWeight: 600 }}>
                {isFull ? '⚠️ Cupos agotados. Lista de espera disponible.' : `✓ ${spotsLeft} vacantes disponibles.`}
              </div>
            </div>

            {/* State Management */}
            {!currentUser ? (
              <div style={{ textAlign: 'center', paddingTop: '10px' }}>
                <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                  Inicia sesión con tu correo @aloe.ulima.edu.pe para reservar tu cupo institucional.
                </p>
                <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
                  Iniciar Sesión para Inscribirme
                </Link>
              </div>
            ) : userRegistration ? (
              <div>
                {userRegistration.status === 'confirmed' ? (
                  <div style={{
                    backgroundColor: 'var(--color-success-soft)',
                    border: '1.5px solid var(--color-success)',
                    padding: '20px',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                    marginBottom: '16px'
                  }}>
                    <div style={{ color: 'var(--color-success)', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '8px' }}>
                      <CheckCircle2 size={20} />
                      <span>¡Inscripción Confirmada!</span>
                    </div>

                    <div style={{
                      backgroundColor: '#FFFFFF',
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      margin: '12px 0',
                      border: '1px dashed var(--color-border)'
                    }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Código de Pase Digital</div>
                      <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-primary)' }}>
                        {userRegistration.ticketCode}
                      </div>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      Muestra este código al llegar para registrar tu asistencia en la actividad.
                    </p>
                  </div>
                ) : (
                  <div style={{
                    backgroundColor: 'var(--color-warning-soft)',
                    border: '1.5px solid var(--color-warning)',
                    padding: '20px',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                    marginBottom: '16px'
                  }}>
                    <div style={{ color: 'var(--color-warning)', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '8px' }}>
                      <Clock size={20} />
                      <span>En Lista de Espera</span>
                    </div>
                    <p style={{ fontSize: '0.84rem', color: 'var(--color-text)', lineHeight: 1.5 }}>
                      Estás en cola de prioridad. Si un estudiante registrado cancela, tu cupo se confirmará automáticamente.
                    </p>
                  </div>
                )}

                <button
                  onClick={handleCancelRegistration}
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                >
                  <XCircle size={15} />
                  <span>Cancelar mi inscripción</span>
                </button>
              </div>
            ) : (
              <div>
                <button
                  onClick={handleRegister}
                  className={`btn ${isFull ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ width: '100%', padding: '12px' }}
                >
                  {isFull ? 'Unirme a la Lista de Espera' : 'Confirmar Mi Inscripción'}
                </button>
                <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '10px' }}>
                  Sin costo para alumnos matriculados Ulima
                </div>
              </div>
            )}

            {/* Directive Controls Shortcut */}
            {isDirectiveOfClub && (
              <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '20px', paddingTop: '16px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                  Panel de Directiva
                </div>
                <Link
                  to={`/gestion-club/${club?.id}/actividades/${activity.id}/asistencia`}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', gap: '6px' }}
                >
                  <FileSpreadsheet size={15} />
                  <span>Control de Asistencia ({activity.enrolledCount})</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
