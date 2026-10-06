import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { MembershipStatus } from '../../types';
import { Check, X, Clock, HelpCircle, Eye, AlertCircle } from 'lucide-react';

export const ClubRequestsPage: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const { showToast } = useToast();

  const id = clubId || 'club-robotica';
  const club = storageService.getClubById(id);

  const [statusFilter, setStatusFilter] = useState<'pending' | 'accepted' | 'rejected'>('pending');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [viewingAnswersId, setViewingAnswersId] = useState<string | null>(null);

  if (!club) return <div className="container">Club no encontrado.</div>;

  const allMemberships = storageService.getMembershipsByClubId(club.id);
  const filtered = allMemberships.filter(m => m.status === statusFilter);

  const handleAccept = (membershipId: string, studentName: string) => {
    storageService.updateMembershipStatus(membershipId, 'accepted');
    showToast(`Postulación de ${studentName} aprobada exitosamente`, 'success');
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingId) return;

    storageService.updateMembershipStatus(rejectingId, 'rejected', rejectReason);
    showToast('Postulación rechazada y notificación enviada al estudiante', 'info');
    setRejectingId(null);
    setRejectReason('');
  };

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Solicitudes de Admisión</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Bandeja de postulantes y postulaciones al {club.name}
          </p>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'pending', label: 'Pendientes' },
            { id: 'accepted', label: 'Aceptadas' },
            { id: 'rejected', label: 'Rechazadas' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id as any)}
              className={`btn btn-sm ${statusFilter === f.id ? 'btn-primary' : 'btn-outline'}`}
            >
              {f.label} ({allMemberships.filter(m => m.status === f.id).length})
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            No hay solicitudes en estado <strong>{statusFilter === 'pending' ? 'pendiente' : statusFilter === 'accepted' ? 'aceptada' : 'rechazada'}</strong>.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map(mem => {
            const user = storageService.getUserById(mem.userId);
            if (!user) return null;

            return (
              <div key={mem.id} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{user.fullName}</h3>
                        <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
                          {user.code}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        {user.career} • {user.cycle}.° ciclo | {user.email}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        📅 Enviado el: {new Date(mem.appliedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {mem.answers && Object.keys(mem.answers).length > 0 && (
                      <button
                        onClick={() => setViewingAnswersId(viewingAnswersId === mem.id ? null : mem.id)}
                        className="btn btn-outline btn-sm"
                        style={{ gap: '6px' }}
                      >
                        <Eye size={14} />
                        <span>Ver Respuestas</span>
                      </button>
                    )}

                    {mem.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAccept(mem.id, user.fullName)}
                          className="btn btn-primary btn-sm"
                          style={{ gap: '6px', backgroundColor: 'var(--color-success)' }}
                        >
                          <Check size={14} />
                          <span>Aceptar</span>
                        </button>
                        <button
                          onClick={() => setRejectingId(mem.id)}
                          className="btn btn-danger btn-sm"
                          style={{ gap: '6px' }}
                        >
                          <X size={14} />
                          <span>Rechazar</span>
                        </button>
                      </>
                    )}

                    {mem.status === 'accepted' && (
                      <span className="badge badge-success">✓ Aceptado en el club</span>
                    )}

                    {mem.status === 'rejected' && (
                      <span className="badge badge-danger">Rechazado ({mem.rejectionReason || 'Sin motivo'})</span>
                    )}
                  </div>
                </div>

                {/* Answers Dropdown */}
                {viewingAnswersId === mem.id && mem.answers && (
                  <div style={{
                    marginTop: '16px',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-surface-subtle)',
                    border: '1px solid var(--color-border)'
                  }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '8px', color: 'var(--color-primary)' }}>
                      Respuestas al Cuestionario de Postulación:
                    </div>
                    {Object.entries(mem.answers).map(([q, a], idx) => (
                      <div key={idx} style={{ marginBottom: '8px', fontSize: '0.84rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>• {q}</div>
                        <div style={{ color: 'var(--color-text-muted)', marginTop: '2px', paddingLeft: '12px' }}>
                          "{a}"
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Rejection Modal */}
      {rejectingId && (
        <div className="modal-overlay" onClick={() => setRejectingId(null)}>
          <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px', color: 'var(--color-danger)' }}>
              Rechazar Solicitud de Postulación
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.86rem', marginBottom: '16px' }}>
              Por favor proporciona una justificación constructiva para el postulante. Esta retroalimentación le llegará a su panel.
            </p>
            <form onSubmit={handleConfirmReject}>
              <div className="form-group">
                <label className="form-label">Motivo o Retroalimentación</label>
                <textarea
                  rows={3}
                  placeholder="Ej. Cupos agotados en esta área / No cumple con la disponibilidad horaria..."
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setRejectingId(null)} className="btn btn-outline btn-sm">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-danger btn-sm">
                  Confirmar Rechazo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
