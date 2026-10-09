import React, { useState } from 'react';
import { Modal } from '../common/Modal.jsx';
import { storageService } from '../../services/storageService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { CategoryBadge } from '../common/CategoryBadge.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

export const MembershipModal = ({
  isOpen,
  onClose,
  club,
  onSuccess
}) => {
  const { currentUser } = useAuth();
  const [motivation, setMotivation] = useState('');
  const [experience, setExperience] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDone, setIsDone] = useState(false);

  if (!club) return null;

  const isOpenAdmission = club.admissionType === 'abierto';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Debes iniciar sesión para solicitar ingreso a un club.');
      return;
    }

    if (!isOpenAdmission && !motivation.trim()) {
      setError('Por favor indica tu motivación para unirte.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      storageService.requestMembership(currentUser.id, club.id, motivation, experience);
      setIsDone(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Error al procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsDone(false);
    setMotivation('');
    setExperience('');
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isDone ? '¡Solicitud Procesada!' : `Postular a ${club.name}`}
      subtitle={
        isDone
          ? ''
          : isOpenAdmission
          ? 'Este club cuenta con ingreso directo e inmediato.'
          : 'La directiva revisará tu solicitud de admisión.'
      }
      maxWidth="520px"
    >
      {isDone ? (
        <div className="text-center py-4">
          <div
            className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#EDFDF5',
              color: '#0E7047',
              fontSize: '2rem'
            }}
          >
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>
          <h5 className="fw-bold mb-2" style={{ color: '#1E1728' }}>
            {isOpenAdmission ? '¡Ya eres miembro del club!' : '¡Solicitud enviada con éxito!'}
          </h5>
          <p className="text-muted small mb-4 px-3">
            {isOpenAdmission
              ? `Te has integrado exitosamente al ${club.name}. Puedes acceder a su tablón y participar en todas sus actividades.`
              : `Tu solicitud fue enviada a la directiva del ${club.name}. Recibirás una notificación en cuanto sea evaluada.`}
          </p>
          <button
            type="button"
            className="btn btn-primary rounded-pill px-4"
            style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
            onClick={handleClose}
          >
            Entendido
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger py-2 small mb-3">
              {error}
            </div>
          )}

          <div
            className="p-3 rounded-3 mb-3 d-flex align-items-center justify-content-between"
            style={{ backgroundColor: '#FBFAFD', border: '1px solid #E6E1EE' }}
          >
            <div>
              <div className="fw-bold small" style={{ color: '#1E1728' }}>{club.name}</div>
              <div className="text-muted small" style={{ fontSize: '0.76rem' }}>{club.category}</div>
            </div>
            <CategoryBadge category={club.category} />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold" style={{ color: '#1E1728' }}>
              Motivación para unirte {isOpenAdmission ? '(opcional)' : '*'}
            </label>
            <textarea
              className="form-control form-control-sm"
              rows={3}
              placeholder="Cuéntanos por qué te interesa participar en este club..."
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              required={!isOpenAdmission}
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold" style={{ color: '#1E1728' }}>
              Experiencia previa o intereses afines (opcional)
            </label>
            <textarea
              className="form-control form-control-sm"
              rows={2}
              placeholder="¿Tienes conocimientos previos o proyectos relacionados?"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>

          <div className="d-flex align-items-center justify-content-end gap-2 pt-2 border-top">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm rounded-pill px-3"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm rounded-pill px-4 d-flex align-items-center gap-1.5"
              style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faPaperPlane} style={{ fontSize: '0.8rem' }} />
              <span>{isOpenAdmission ? 'Confirmar ingreso' : 'Enviar postulación'}</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
