import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { storageService } from '../../services/storageService.js';
import { ContextBar } from '../../components/layout/ContextBar.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faXmark,
  faEye,
  faCheckDouble,
  faBan
} from '@fortawesome/free-solid-svg-icons';

export const ClubRequestsPage = () => {
  const { id } = useParams();
  const clubId = id || 'club-robotica';
  const club = storageService.getClubById(clubId) || storageService.getClubs()[0];

  const [filterStatus, setFilterStatus] = useState('pendiente');
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeRequestDetail, setActiveRequestDetail] = useState(null);
  const [rejectingRequest, setRejectingRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [, setRefresh] = useState(0);

  if (!club) return null;

  const allRequests = storageService.getMembershipsByClubId(club.id);

  const displayedRequests = allRequests.filter((req) => {
    if (filterStatus === 'todos') return true;
    return req.status === filterStatus;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(displayedRequests.map(r => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (reqId) => {
    if (selectedIds.includes(reqId)) {
      setSelectedIds(selectedIds.filter(id => id !== reqId));
    } else {
      setSelectedIds([...selectedIds, reqId]);
    }
  };

  const handleApproveSingle = (reqId) => {
    storageService.updateMembershipStatus(reqId, 'activo', undefined, 'Sofía Vega');
    setSelectedIds(selectedIds.filter(id => id !== reqId));
    setRefresh(r => r + 1);
  };

  const handleApproveSelected = () => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach((reqId) => {
      storageService.updateMembershipStatus(reqId, 'activo', undefined, 'Sofía Vega');
    });
    setSelectedIds([]);
    setRefresh(r => r + 1);
  };

  const handleOpenRejectModal = (req) => {
    setRejectingRequest(req);
    setRejectReason('No cumple con los requisitos o perfil solicitado en este ciclo');
  };

  const handleConfirmReject = () => {
    if (!rejectingRequest) return;
    storageService.updateMembershipStatus(rejectingRequest.id, 'rechazado', rejectReason, 'Sofía Vega');
    setRejectingRequest(null);
    setRejectReason('');
    setRefresh(r => r + 1);
  };

  return (
    <div>
      <ContextBar />

      <div className="container py-4" style={{ maxWidth: '1060px' }}>
        <div className="mb-4">
          <h3 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
            Bandeja de Solicitudes de Ingreso
          </h3>
          <p className="text-muted small mb-0">
            Evalúa postulaciones recibidas, revisa la motivación de los aspirantes y aprueba su integración al club
          </p>
        </div>

        {/* Toolbar card */}
        <div
          className="card border rounded-4 p-3 mb-4 shadow-sm"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
        >
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            {/* Filter Pills */}
            <div className="d-flex align-items-center gap-2">
              <span className="small text-muted fw-semibold me-1">Filtrar:</span>
              <button
                type="button"
                className={`btn btn-sm rounded-pill fw-semibold ${
                  filterStatus === 'pendiente' ? 'btn-primary' : 'btn-light border'
                }`}
                style={{
                  backgroundColor: filterStatus === 'pendiente' ? '#6B2FA8' : '#FBFAFD',
                  borderColor: filterStatus === 'pendiente' ? '#6B2FA8' : '#E6E1EE',
                  fontSize: '0.8rem'
                }}
                onClick={() => setFilterStatus('pendiente')}
              >
                Pendientes ({allRequests.filter(r => r.status === 'pendiente').length})
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-pill fw-semibold ${
                  filterStatus === 'activo' ? 'btn-primary' : 'btn-light border'
                }`}
                style={{
                  backgroundColor: filterStatus === 'activo' ? '#6B2FA8' : '#FBFAFD',
                  borderColor: filterStatus === 'activo' ? '#6B2FA8' : '#E6E1EE',
                  fontSize: '0.8rem'
                }}
                onClick={() => setFilterStatus('activo')}
              >
                Aprobados ({allRequests.filter(r => r.status === 'activo').length})
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-pill fw-semibold ${
                  filterStatus === 'rechazado' ? 'btn-primary' : 'btn-light border'
                }`}
                style={{
                  backgroundColor: filterStatus === 'rechazado' ? '#6B2FA8' : '#FBFAFD',
                  borderColor: filterStatus === 'rechazado' ? '#6B2FA8' : '#E6E1EE',
                  fontSize: '0.8rem'
                }}
                onClick={() => setFilterStatus('rechazado')}
              >
                Rechazados ({allRequests.filter(r => r.status === 'rechazado').length})
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-pill fw-semibold ${
                  filterStatus === 'todos' ? 'btn-primary' : 'btn-light border'
                }`}
                style={{
                  backgroundColor: filterStatus === 'todos' ? '#6B2FA8' : '#FBFAFD',
                  borderColor: filterStatus === 'todos' ? '#6B2FA8' : '#E6E1EE',
                  fontSize: '0.8rem'
                }}
                onClick={() => setFilterStatus('todos')}
              >
                Todos
              </button>
            </div>

            {/* Bulk actions */}
            {selectedIds.length > 0 && (
              <div className="d-flex align-items-center gap-2">
                <span className="small text-muted">{selectedIds.length} seleccionados</span>
                <button
                  type="button"
                  className="btn btn-success btn-sm rounded-pill px-3 d-flex align-items-center gap-1.5"
                  onClick={handleApproveSelected}
                >
                  <FontAwesomeIcon icon={faCheckDouble} />
                  <span>Aprobar seleccionados</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Requests Table */}
        <div
          className="card border rounded-4 shadow-sm overflow-hidden"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
        >
          {displayedRequests.length === 0 ? (
            <div className="p-5 text-center text-muted">
              No hay solicitudes con el estado seleccionado en este momento.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 small">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '40px' }}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedIds.length === displayedRequests.length && displayedRequests.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>Postulante</th>
                    <th>Correo Institucional</th>
                    <th>Fecha</th>
                    <th>Motivación</th>
                    <th>Estado</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedRequests.map((req) => {
                    const isSelected = selectedIds.includes(req.id);
                    return (
                      <tr key={req.id}>
                        <td>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(req.id)}
                          />
                        </td>
                        <td>
                          <div className="fw-bold" style={{ color: '#1E1728' }}>{req.userName}</div>
                          <div className="text-muted" style={{ fontSize: '0.72rem' }}>Postulante Ulima</div>
                        </td>
                        <td className="text-muted">{req.userEmail}</td>
                        <td className="text-muted">
                          {req.joinedAt ? new Date(req.joinedAt).toLocaleDateString() : 'Hoy'}
                        </td>
                        <td style={{ maxWidth: '240px' }}>
                          <div className="text-truncate text-muted">{req.motivation || 'Sin mensaje'}</div>
                          <button
                            type="button"
                            className="btn btn-link btn-sm p-0 text-decoration-none"
                            style={{ fontSize: '0.74rem', color: '#6B2FA8' }}
                            onClick={() => setActiveRequestDetail(req)}
                          >
                            Ver detalle
                          </button>
                        </td>
                        <td>
                          <StatusBadge status={req.status} />
                        </td>
                        <td className="text-end">
                          {req.status === 'pendiente' ? (
                            <div className="d-inline-flex gap-1">
                              <button
                                type="button"
                                className="btn btn-success btn-sm rounded-circle"
                                style={{ width: '32px', height: '32px', padding: 0 }}
                                title="Aprobar solicitud"
                                onClick={() => handleApproveSingle(req.id)}
                              >
                                <FontAwesomeIcon icon={faCheck} />
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm rounded-circle"
                                style={{ width: '32px', height: '32px', padding: 0 }}
                                title="Rechazar solicitud"
                                onClick={() => handleOpenRejectModal(req)}
                              >
                                <FontAwesomeIcon icon={faXmark} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-muted small">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {activeRequestDetail && (
        <Modal
          isOpen={!!activeRequestDetail}
          onClose={() => setActiveRequestDetail(null)}
          title={`Postulación de ${activeRequestDetail.userName}`}
          subtitle={`Correo: ${activeRequestDetail.userEmail}`}
          maxWidth="500px"
        >
          <div className="py-2">
            <h6 className="fw-bold mb-2">Motivación del estudiante:</h6>
            <div className="p-3 rounded-3 bg-light border mb-3 small">
              {activeRequestDetail.motivation || 'Sin motivación registrada.'}
            </div>

            {activeRequestDetail.experience && (
              <>
                <h6 className="fw-bold mb-2">Experiencia / Habilidades previas:</h6>
                <div className="p-3 rounded-3 bg-light border mb-3 small">
                  {activeRequestDetail.experience}
                </div>
              </>
            )}

            <div className="d-flex justify-content-end gap-2 pt-2">
              <button
                type="button"
                className="btn btn-light btn-sm rounded-pill px-3"
                onClick={() => setActiveRequestDetail(null)}
              >
                Cerrar
              </button>
              {activeRequestDetail.status === 'pendiente' && (
                <button
                  type="button"
                  className="btn btn-primary btn-sm rounded-pill px-3"
                  style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
                  onClick={() => {
                    handleApproveSingle(activeRequestDetail.id);
                    setActiveRequestDetail(null);
                  }}
                >
                  Aprobar ingreso
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Modal */}
      {rejectingRequest && (
        <Modal
          isOpen={!!rejectingRequest}
          onClose={() => setRejectingRequest(null)}
          title="Rechazar Solicitud de Ingreso"
          subtitle={`Postulante: ${rejectingRequest.userName}`}
          maxWidth="480px"
        >
          <div className="py-2">
            <div className="alert alert-warning py-2 small mb-3">
              Se enviará una notificación al alumno con el motivo institucional indicado.
            </div>

            <label className="form-label small fw-semibold">Motivo del rechazo:</label>
            <textarea
              rows={3}
              className="form-control mb-3"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              required
            />

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-light btn-sm rounded-pill px-3"
                onClick={() => setRejectingRequest(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm rounded-pill px-3"
                onClick={handleConfirmReject}
              >
                Confirmar rechazo
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
