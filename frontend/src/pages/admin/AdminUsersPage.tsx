import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User } from '../../types';
import {
  Users,
  Search,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  AlertCircle
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterBlocked, setFilterBlocked] = useState<'all' | 'active' | 'blocked'>('all');
  const [blockingUserId, setBlockingUserId] = useState<string | null>(null);
  const [blockReason, setBlockReason] = useState('');

  const users = storageService.getUsers().filter(u => u.role !== 'admin');

  const handleConfirmBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockingUserId) return;

    storageService.setUserBlockStatus(blockingUserId, true, blockReason, currentUser?.email);
    showToast('Cuenta de estudiante suspendida temporalmente', 'danger');
    setBlockingUserId(null);
    setBlockReason('');
  };

  const handleUnblock = (userId: string, userName: string) => {
    storageService.setUserBlockStatus(userId, false, undefined, currentUser?.email);
    showToast(`Cuenta de ${userName} reactivada exitosamente`, 'success');
  };

  const filtered = users.filter(u => {
    const matchesFilter =
      filterBlocked === 'all' ||
      (filterBlocked === 'active' && !u.isBlocked) ||
      (filterBlocked === 'blocked' && u.isBlocked);

    const matchesSearch =
      searchQuery === '' ||
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.code.includes(searchQuery) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.career.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800 }}>Padrón y Moderación de Usuarios</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Supervisión de cuentas estudiantiles y aplicación de sanciones disciplinarias institucionales
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'all', label: 'Todos' },
            { id: 'active', label: 'Activos' },
            { id: 'blocked', label: 'Sancionados' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterBlocked(f.id as any)}
              className={`btn btn-sm ${filterBlocked === f.id ? 'btn-primary' : 'btn-outline'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: '20px', maxWidth: '380px', position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
        <input
          type="text"
          placeholder="Buscar alumno por nombre, código o correo..."
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
              <th style={{ padding: '14px 20px' }}>Alumno Ulima</th>
              <th style={{ padding: '14px 20px' }}>Código</th>
              <th style={{ padding: '14px 20px' }}>Carrera y Ciclo</th>
              <th style={{ padding: '14px 20px' }}>Rol en Plataforma</th>
              <th style={{ padding: '14px 20px' }}>Estado</th>
              <th style={{ padding: '14px 20px', textAlign: 'right' }}>Acción Disciplinaria</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>{user.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 20px', fontWeight: 600 }}>
                  {user.code}
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div>{user.career}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user.cycle}.° ciclo</div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span className="badge badge-info">
                    {user.role === 'directive' ? 'Directiva' : 'Estudiante'}
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span className={`badge ${user.isBlocked ? 'badge-danger' : 'badge-success'}`}>
                    {user.isBlocked ? 'Sancionado' : 'Habilitado'}
                  </span>
                  {user.isBlocked && user.blockReason && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-danger)', marginTop: '4px', maxWidth: '240px' }}>
                      {user.blockReason}
                    </div>
                  )}
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                  {user.isBlocked ? (
                    <button
                      onClick={() => handleUnblock(user.id, user.fullName)}
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '6px' }}
                    >
                      <ShieldCheck size={14} color="var(--color-success)" />
                      <span>Reactivar Cuenta</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setBlockingUserId(user.id)}
                      className="btn btn-danger btn-sm"
                      style={{ gap: '6px' }}
                    >
                      <ShieldAlert size={14} />
                      <span>Bloquear</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Blocking User */}
      {blockingUserId && (
        <div className="modal-overlay" onClick={() => setBlockingUserId(null)}>
          <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: 'var(--color-danger)' }}>
              Sancionar y Bloquear Cuenta de Estudiante
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.86rem', marginBottom: '16px' }}>
              El alumno no podrá inscribirse a actividades ni postular a clubes mientras la suspensión esté activa.
            </p>
            <form onSubmit={handleConfirmBlock}>
              <div className="form-group">
                <label className="form-label">Motivo o Artículo del Reglamento Infringido</label>
                <textarea
                  rows={3}
                  placeholder="Ej. Infracción reiterada a las normas de convivencia en foros estudiantiles (Art. 45)..."
                  value={blockReason}
                  onChange={e => setBlockReason(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setBlockingUserId(null)} className="btn btn-outline btn-sm">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-danger btn-sm">
                  Confirmar Sanción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
