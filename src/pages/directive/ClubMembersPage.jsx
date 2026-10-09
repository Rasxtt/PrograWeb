import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { storageService } from '../../services/storageService.js';
import { ContextBar } from '../../components/layout/ContextBar.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faUserGear,
  faUserXmark,
  faShieldHalved
} from '@fortawesome/free-solid-svg-icons';

const INTERNAL_ROLES = [
  'Presidente',
  'Vicepresidente',
  'Coordinador de Proyectos',
  'Tesorero',
  'Secretario General',
  'miembro'
];

export const ClubMembersPage = () => {
  const { id } = useParams();
  const clubId = id || 'club-robotica';
  const club = storageService.getClubById(clubId) || storageService.getClubs()[0];

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('todos');

  const [editingRoleMember, setEditingRoleMember] = useState(null);
  const [selectedRole, setSelectedRole] = useState('miembro');

  const [removingMember, setRemovingMember] = useState(null);
  const [removalReason, setRemovalReason] = useState('Baja voluntaria comunicada a la directiva');

  const [, setRefresh] = useState(0);

  if (!club) return null;

  const members = storageService
    .getMembershipsByClubId(club.id)
    .filter(m => m.status === 'activo');

  const filteredMembers = members.filter((m) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!m.userName.toLowerCase().includes(q) && !m.userEmail.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (roleFilter !== 'todos') {
      if (roleFilter === 'directiva' && m.roleInClub === 'miembro') return false;
      if (roleFilter === 'miembro' && m.roleInClub !== 'miembro') return false;
    }
    return true;
  });

  const handleOpenRoleModal = (m) => {
    setEditingRoleMember(m);
    setSelectedRole(m.roleInClub || 'miembro');
  };

  const handleSaveRole = () => {
    if (!editingRoleMember) return;
    storageService.updateMembershipRole(editingRoleMember.id, selectedRole);
    setEditingRoleMember(null);
    setRefresh(r => r + 1);
  };

  const handleOpenRemoveModal = (m) => {
    setRemovingMember(m);
    setRemovalReason('Baja voluntaria comunicada a la directiva');
  };

  const handleConfirmRemoval = () => {
    if (!removingMember) return;
    storageService.removeMember(removingMember.id, removalReason);
    setRemovingMember(null);
    setRefresh(r => r + 1);
  };

  return (
    <div>
      <ContextBar />

      <div className="container py-4" style={{ maxWidth: '1060px' }}>
        <div className="mb-4">
          <h3 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
            Padrón de Miembros Oficiales
          </h3>
          <p className="text-muted small mb-0">
            Administra el registro oficial de integrantes del club y asigna cargos directivos
          </p>
        </div>

        {/* Filter bar */}
        <div
          className="card border rounded-4 p-3 mb-4 shadow-sm"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
        >
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted" style={{ borderColor: '#D6CEE2' }}>
                  <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: '#6B2FA8' }} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Buscar miembro por nombre o correo institucional..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ borderColor: '#D6CEE2' }}
                />
              </div>
            </div>

            <div className="col-12 col-md-4">
              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{ borderColor: '#D6CEE2' }}
              >
                <option value="todos">Todos los cargos ({members.length})</option>
                <option value="directiva">Mesa Directiva</option>
                <option value="miembro">Miembros regulares</option>
              </select>
            </div>
          </div>
        </div>

        {/* Members Table */}
        <div
          className="card border rounded-4 shadow-sm overflow-hidden"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
        >
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th>Miembro</th>
                  <th>Correo Institucional</th>
                  <th>Fecha Ingreso</th>
                  <th>Cargo Interno</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((m) => {
                  const isDirective = m.roleInClub !== 'miembro';
                  return (
                    <tr key={m.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2.5">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                            style={{
                              width: '36px',
                              height: '36px',
                              backgroundColor: isDirective ? '#6B2FA8' : '#7E6F94',
                              fontSize: '0.8rem'
                            }}
                          >
                            {m.userName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </div>
                          <div>
                            <div className="fw-bold" style={{ color: '#1E1728' }}>{m.userName}</div>
                            <div className="text-muted" style={{ fontSize: '0.72rem' }}>Estudiante Ulima</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-muted">{m.userEmail}</td>
                      <td className="text-muted">
                        {m.joinedAt ? new Date(m.joinedAt).toLocaleDateString() : '2026-03-01'}
                      </td>
                      <td>
                        <span
                          className={`badge rounded-pill fw-semibold text-capitalize ${
                            isDirective
                              ? 'bg-purple-light text-purple border'
                              : 'bg-light text-dark border'
                          }`}
                          style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                        >
                          {m.roleInClub}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-1.5">
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm rounded-circle"
                            style={{ width: '32px', height: '32px', padding: 0 }}
                            title="Modificar rol interno"
                            onClick={() => handleOpenRoleModal(m)}
                          >
                            <FontAwesomeIcon icon={faUserGear} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm rounded-circle"
                            style={{ width: '32px', height: '32px', padding: 0 }}
                            title="Dar de baja del club"
                            onClick={() => handleOpenRemoveModal(m)}
                          >
                            <FontAwesomeIcon icon={faUserXmark} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL ROL INTERNO (Mockup 3.6_modal_rol_interno.png) */}
      {editingRoleMember && (
        <Modal
          isOpen={!!editingRoleMember}
          onClose={() => setEditingRoleMember(null)}
          title="Modificar Cargo Interno"
          subtitle={`Miembro: ${editingRoleMember.userName}`}
          maxWidth="460px"
        >
          <div className="py-2">
            <div className="mb-3">
              <label className="form-label small fw-semibold">Seleccionar cargo / rol en el club:</label>
              <select
                className="form-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {INTERNAL_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r === 'miembro' ? 'Miembro regular' : r}
                  </option>
                ))}
              </select>
            </div>

            <p className="small text-muted mb-4">
              Los cargos directivos otorgan permisos de edición de perfil, bandeja de solicitudes y publicación de eventos.
            </p>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-light btn-sm rounded-pill px-3"
                onClick={() => setEditingRoleMember(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm rounded-pill px-3"
                style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
                onClick={handleSaveRole}
              >
                Guardar cargo
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL RETIRO MIEMBRO (Mockup 3.6_modal_retiro_miembro.png) */}
      {removingMember && (
        <Modal
          isOpen={!!removingMember}
          onClose={() => setRemovingMember(null)}
          title="Dar de Baja a Miembro"
          subtitle={`¿Deseas retirar a ${removingMember.userName} del padrón oficial?`}
          maxWidth="480px"
        >
          <div className="py-2">
            <div className="alert alert-warning py-2 small mb-3">
              El estudiante perderá el acceso al tablón interno y figurará en el historial de bajas.
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Motivo del retiro institucional:</label>
              <select
                className="form-select mb-2"
                value={removalReason}
                onChange={(e) => setRemovalReason(e.target.value)}
              >
                <option value="Baja voluntaria comunicada a la directiva">Baja voluntaria comunicada a la directiva</option>
                <option value="Inasistencias reiteradas a actividades obligatorias">Inasistencias reiteradas a actividades obligatorias</option>
                <option value="Graduación o culminación de ciclo">Graduación o culminación de ciclo</option>
                <option value="Sanción disciplinaria">Sanción disciplinaria</option>
              </select>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-light btn-sm rounded-pill px-3"
                onClick={() => setRemovingMember(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm rounded-pill px-3"
                onClick={handleConfirmRemoval}
              >
                Confirmar retiro
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
