import React, { useState } from 'react';
import { storageService } from '../../services/storageService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faBan,
  faCheckCircle,
  faRotateRight,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';

export const AdminUsersPage = () => {
  const { currentUser, refreshUsers } = useAuth();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');

  const [blockingUser, setBlockingUser] = useState(null);
  const [blockReason, setBlockReason] = useState('Sanción disciplinaria por inconducta o falta al reglamento estudiantil');

  const users = storageService.getUsers();

  const filteredUsers = users.filter((u) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = u.fullName.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchCode = (u.code || '').toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchCode) return false;
    }

    if (roleFilter !== 'todos' && u.role !== roleFilter) return false;
    if (statusFilter === 'activos' && u.isBlocked) return false;
    if (statusFilter === 'bloqueados' && !u.isBlocked) return false;

    return true;
  });

  const handleConfirmBlock = () => {
    if (!blockingUser) return;
    storageService.setUserBlockStatus(
      blockingUser.id,
      true,
      blockReason,
      currentUser?.email || 'admin@aloe.ulima.edu.pe'
    );
    setBlockingUser(null);
    refreshUsers();
  };

  const handleUnblock = (userId) => {
    storageService.setUserBlockStatus(
      userId,
      false,
      undefined,
      currentUser?.email || 'admin@aloe.ulima.edu.pe'
    );
    refreshUsers();
  };

  return (
    <div className="container py-4 pb-5">
      <div className="mb-4">
        <h3 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
          Gestión y Moderación de Usuarios
        </h3>
        <p className="text-muted small mb-0">
          Supervisión de cuentas institucionales, roles y aplicación de sanciones disciplinarias
        </p>
      </div>

      {/* FILTER BAR */}
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
                placeholder="Buscar por nombre, código o correo institucional..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ borderColor: '#D6CEE2' }}
              />
            </div>
          </div>

          <div className="col-6 col-md-3">
            <select
              className="form-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ borderColor: '#D6CEE2' }}
            >
              <option value="todos">Rol: Todos</option>
              <option value="student">Estudiante</option>
              <option value="directive">Directiva</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="col-6 col-md-3">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ borderColor: '#D6CEE2' }}
            >
              <option value="todos">Estado: Todos</option>
              <option value="activos">Activos</option>
              <option value="bloqueados">Bloqueados</option>
            </select>
          </div>
        </div>
      </div>

      {/* USERS TABLE */}
      <div
        className="card border rounded-4 shadow-sm overflow-hidden"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
      >
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 small">
            <thead className="table-light">
              <tr>
                <th>Estudiante / Usuario</th>
                <th>Correo Institucional</th>
                <th>Carrera & Ciclo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const isBlocked = !!u.isBlocked;

                return (
                  <tr key={u.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2.5">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                          style={{
                            width: '36px',
                            height: '36px',
                            backgroundColor: u.role === 'admin' ? '#17A2A2' : u.role === 'directive' ? '#C2681C' : '#6B2FA8',
                            fontSize: '0.8rem'
                          }}
                        >
                          {u.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <div className="fw-bold" style={{ color: '#1E1728' }}>{u.fullName}</div>
                          <div className="text-muted" style={{ fontSize: '0.72rem' }}>Cód: {u.code || '20210000'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-muted">{u.email}</td>
                    <td className="text-muted">
                      <div>{u.career || 'Ingeniería de Sistemas'}</div>
                      <div style={{ fontSize: '0.72rem' }}>Ciclo {u.cycle || 5}</div>
                    </td>
                    <td>
                      <span
                        className="badge rounded-pill fw-semibold text-capitalize"
                        style={{
                          backgroundColor: u.role === 'admin' ? '#E6F6F6' : u.role === 'directive' ? '#FFF8F0' : '#F0E9F9',
                          color: u.role === 'admin' ? '#17A2A2' : u.role === 'directive' ? '#C2681C' : '#6B2FA8',
                          fontSize: '0.75rem',
                          padding: '4px 10px'
                        }}
                      >
                        {u.role === 'student' ? 'Estudiante' : u.role === 'directive' ? 'Directiva' : 'Admin'}
                      </span>
                    </td>
                    <td>
                      {isBlocked ? (
                        <div>
                          <span className="badge bg-danger-subtle text-danger rounded-pill fw-semibold" style={{ fontSize: '0.72rem' }}>
                            Bloqueado
                          </span>
                          <div className="text-danger small mt-1" style={{ fontSize: '0.7rem' }}>
                            {u.blockReason}
                          </div>
                        </div>
                      ) : (
                        <span className="badge bg-success-subtle text-success rounded-pill fw-semibold" style={{ fontSize: '0.72rem' }}>
                          Activo
                        </span>
                      )}
                    </td>
                    <td className="text-end">
                      {u.role !== 'admin' && (
                        <div>
                          {isBlocked ? (
                            <button
                              type="button"
                              className="btn btn-outline-success btn-sm rounded-pill px-3"
                              style={{ fontSize: '0.75rem' }}
                              onClick={() => handleUnblock(u.id)}
                            >
                              <FontAwesomeIcon icon={faRotateRight} className="me-1" />
                              Desbloquear
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm rounded-pill px-3"
                              style={{ fontSize: '0.75rem' }}
                              onClick={() => {
                                setBlockingUser(u);
                                setBlockReason('Sanción disciplinaria por inconducta o falta al reglamento estudiantil');
                              }}
                            >
                              <FontAwesomeIcon icon={faBan} className="me-1" />
                              Bloquear cuenta
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* BLOCK USER MODAL (Mockup 7.3_modal_bloqueo_cuenta.png) */}
      {blockingUser && (
        <Modal
          isOpen={!!blockingUser}
          onClose={() => setBlockingUser(null)}
          title="Bloquear Cuenta de Usuario"
          subtitle={`Estudiante: ${blockingUser.fullName} (${blockingUser.email})`}
          maxWidth="480px"
        >
          <div className="py-2">
            <div className="alert alert-danger py-2 small mb-3">
              <FontAwesomeIcon icon={faTriangleExclamation} className="me-1" />
              Al bloquear la cuenta, el alumno no podrá iniciar sesión ni participar en actividades o postulaciones.
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Motivo disciplinario institucional:</label>
              <textarea
                rows={3}
                className="form-control"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                required
              />
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-light btn-sm rounded-pill px-3"
                onClick={() => setBlockingUser(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm rounded-pill px-3 fw-semibold"
                onClick={handleConfirmBlock}
              >
                Confirmar bloqueo
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
