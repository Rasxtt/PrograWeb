import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { RoleInClub } from '../../types';
import { Users, Search, Shield, Trash2, CheckCircle2 } from 'lucide-react';

export const ClubMembersPage: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const { showToast } = useToast();

  const id = clubId || 'club-robotica';
  const club = storageService.getClubById(id);

  const [searchMember, setSearchMember] = useState('');

  if (!club) return <div className="container">Club no encontrado.</div>;

  const memberships = storageService.getMembershipsByClubId(club.id).filter(m => m.status === 'accepted');

  const roles: RoleInClub[] = ['Presidente', 'Vicepresidente', 'Secretario', 'Vocal', 'Miembro Activo'];

  const handleRoleChange = (membershipId: string, newRole: RoleInClub) => {
    storageService.updateMemberRole(membershipId, newRole);
    showToast(`Cargo actualizado a ${newRole}`, 'success');
  };

  const handleRemoveMember = (membershipId: string, memberName: string) => {
    if (window.confirm(`¿Estás seguro de que deseas retirar a ${memberName} del club?`)) {
      storageService.updateMembershipStatus(membershipId, 'alumni');
      showToast(`${memberName} ha sido retirado del club`, 'info');
    }
  };

  const filteredMembers = memberships.filter(m => {
    const user = storageService.getUserById(m.userId);
    if (!user) return false;
    return (
      user.fullName.toLowerCase().includes(searchMember.toLowerCase()) ||
      user.code.includes(searchMember) ||
      user.career.toLowerCase().includes(searchMember.toLowerCase())
    );
  });

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Padrón y Directiva de Miembros</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Gestiona la asignación de roles de liderazgo y el estado de los integrantes del club
          </p>
        </div>

        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
            value={searchMember}
            onChange={e => setSearchMember(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-surface-subtle)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <th style={{ padding: '14px 20px' }}>Estudiante</th>
              <th style={{ padding: '14px 20px' }}>Código Ulima</th>
              <th style={{ padding: '14px 20px' }}>Carrera y Ciclo</th>
              <th style={{ padding: '14px 20px' }}>Cargo en Directiva</th>
              <th style={{ padding: '14px 20px', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map(mem => {
              const user = storageService.getUserById(mem.userId);
              if (!user) return null;
              const isPresident = mem.roleInClub === 'Presidente';

              return (
                <tr key={mem.id} style={{ borderBottom: '1px solid var(--color-border-subtle)', transition: 'var(--transition)' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={user.avatarUrl}
                        alt={user.fullName}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{user.fullName}</div>
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
                    <select
                      value={mem.roleInClub}
                      onChange={e => handleRoleChange(mem.id, e.target.value as any)}
                      style={{
                        padding: '6px 12px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        borderRadius: 'var(--radius-pill)',
                        border: isPresident ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                        backgroundColor: isPresident ? 'var(--color-primary-soft)' : 'var(--color-surface)',
                        color: isPresident ? 'var(--color-primary)' : 'var(--color-text)',
                        width: 'auto'
                      }}
                    >
                      {roles.map((r, idx) => (
                        <option key={idx} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    {!isPresident && (
                      <button
                        onClick={() => handleRemoveMember(mem.id, user.fullName)}
                        title="Dar de baja del club"
                        style={{ color: 'var(--color-danger)', padding: '6px', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
