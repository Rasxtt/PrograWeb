import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ClubStatus } from '../../types';
import {
  Check,
  AlertTriangle,
  RotateCcw,
  Search,
  Users,
  Compass,
  Eye,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminClubsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [statusFilter, setStatusFilter] = useState<'all' | ClubStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionClubId, setActionClubId] = useState<string | null>(null);
  const [suspendReason, setSuspendReason] = useState('');

  const clubs = storageService.getClubs();

  const handleApprove = (clubId: string, clubName: string) => {
    storageService.updateClubStatus(clubId, 'published', currentUser?.email, 'Aprobación oficial por Bienestar Estudiantil');
    showToast(`Club "${clubName}" aprobado y publicado en el directorio`, 'success');
  };

  const handleSuspend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionClubId) return;

    const club = storageService.getClubById(actionClubId);
    storageService.updateClubStatus(actionClubId, 'suspended', currentUser?.email, suspendReason);
    showToast(`Club "${club?.name}" suspendido temporalmente`, 'info');
    setActionClubId(null);
    setSuspendReason('');
  };

  const handleReactivate = (clubId: string, clubName: string) => {
    storageService.updateClubStatus(clubId, 'published', currentUser?.email, 'Reactivación de actividades por cumplimiento de observaciones');
    showToast(`Club "${clubName}" reactivado exitosamente`, 'success');
  };

  const filtered = clubs.filter(c => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesSearch =
      searchQuery === '' ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800 }}>Supervisión y Gobernanza de Clubes</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Aprobación estatutaria, seguimiento y control disciplinario de agrupaciones
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'all', label: 'Todos' },
            { id: 'published', label: 'Publicados' },
            { id: 'under_review', label: 'En Revisión' },
            { id: 'suspended', label: 'Suspendidos' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id as any)}
              className={`btn btn-sm ${statusFilter === f.id ? 'btn-primary' : 'btn-outline'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: '20px', maxWidth: '360px', position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
        <input
          type="text"
          placeholder="Buscar club por nombre o sigla..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ paddingLeft: '36px' }}
        />
      </div>

      {/* Table */}
      <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-surface-subtle)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <th style={{ padding: '14px 20px' }}>Club</th>
              <th style={{ padding: '14px 20px' }}>Categoría</th>
              <th style={{ padding: '14px 20px' }}>Miembros</th>
              <th style={{ padding: '14px 20px' }}>Estado</th>
              <th style={{ padding: '14px 20px', textAlign: 'right' }}>Acciones Administrativas</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(club => (
              <tr key={club.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={club.logoUrl}
                      alt={club.name}
                      style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>{club.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{club.contactEmail}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span className={`badge badge-cat-${club.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}>
                    {club.category}
                  </span>
                </td>
                <td style={{ padding: '14px 20px', fontWeight: 600 }}>
                  {club.memberCount} integrantes
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span className={`badge ${
                    club.status === 'published' ? 'badge-success' :
                    club.status === 'under_review' ? 'badge-warning' : 'badge-danger'
                  }`}>
                    {club.status === 'published' ? 'Publicado' :
                     club.status === 'under_review' ? 'En Revisión' : 'Suspendido'}
                  </span>
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <Link to={`/clubes/${club.id}`} target="_blank" className="btn btn-outline btn-sm" title="Ver ficha pública">
                      <Eye size={14} />
                    </Link>

                    {club.status === 'under_review' && (
                      <button
                        onClick={() => handleApprove(club.id, club.name)}
                        className="btn btn-primary btn-sm"
                        style={{ gap: '6px', backgroundColor: 'var(--color-success)' }}
                      >
                        <Check size={14} />
                        <span>Aprobar</span>
                      </button>
                    )}

                    {club.status === 'published' && (
                      <button
                        onClick={() => setActionClubId(club.id)}
                        className="btn btn-danger btn-sm"
                        style={{ gap: '6px' }}
                      >
                        <ShieldAlert size={14} />
                        <span>Suspender</span>
                      </button>
                    )}

                    {club.status === 'suspended' && (
                      <button
                        onClick={() => handleReactivate(club.id, club.name)}
                        className="btn btn-secondary btn-sm"
                        style={{ gap: '6px' }}
                      >
                        <RotateCcw size={14} />
                        <span>Reactivar</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Suspend Club */}
      {actionClubId && (
        <div className="modal-overlay" onClick={() => setActionClubId(null)}>
          <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: 'var(--color-danger)' }}>
              Suspender Actividades de Club
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.86rem', marginBottom: '16px' }}>
              Al suspender el club, no podrá convocar nuevas actividades ni recibir postulaciones de estudiantes hasta subsanar las observaciones.
            </p>
            <form onSubmit={handleSuspend}>
              <div className="form-group">
                <label className="form-label">Justificación o Infracción Normativa</label>
                <textarea
                  rows={3}
                  placeholder="Ej. Incumplimiento de presentación de balance semestral o falta al reglamento..."
                  value={suspendReason}
                  onChange={e => setSuspendReason(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setActionClubId(null)} className="btn btn-outline btn-sm">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-danger btn-sm">
                  Confirmar Suspensión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
