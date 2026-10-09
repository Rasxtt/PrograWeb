import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../../services/storageService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const CATEGORIES = ['Académico', 'Tecnología', 'Cultural', 'Deportivo', 'Voluntariado', 'Artístico'];

export const RegisterClubPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [mission, setMission] = useState('');
  const [promoterName, setPromoterName] = useState(currentUser?.fullName || '');
  const [promoterEmail, setPromoterEmail] = useState(currentUser?.email || '');
  const [promoterCode, setPromoterCode] = useState(currentUser?.code || '');

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !description.trim()) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }

    try {
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      storageService.createClub({
        name,
        shortName: shortName || name.slice(0, 2).toUpperCase(),
        slug,
        category,
        description,
        detailedDescription: mission,
        admissionType: 'convocatoria',
        admissionStatus: 'abierto',
        status: 'activo',
        memberCount: 1,
        bannerPattern: 'diagonal',
        socialLinks: { instagram: '', linkedin: '', website: '' }
      });

      setShowSuccessModal(true);
    } catch {
      setError('Ocurrió un error al registrar la propuesta.');
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '780px' }}>
      <div className="mb-4 text-center">
        <span className="badge px-3 py-1.5 rounded-pill mb-2 fw-semibold" style={{ backgroundColor: '#F0E9F9', color: '#6B2FA8' }}>
          BIENESTAR ESTUDIANTIL ULIMA
        </span>
        <h2 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
          Registrar un Nuevo Club Estudiantil
        </h2>
        <p className="text-muted small mb-0 px-md-4">
          Presenta la propuesta de constitución para una nueva iniciativa u organización estudiantil oficial.
        </p>
      </div>

      <div
        className="card border rounded-4 p-4 p-sm-5 shadow-sm"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
      >
        {error && (
          <div className="alert alert-danger py-2 small mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <h5 className="fw-bold mb-3 border-bottom pb-2" style={{ color: '#1E1728' }}>
            1. Datos del Club
          </h5>

          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-8">
              <label className="form-label small fw-semibold">Nombre oficial de la iniciativa *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej. Club de Inteligencia Artificial y Datos"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="col-12 col-sm-4">
              <label className="form-label small fw-semibold">Siglas o Iniciales (2-3 letras)</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej. IA"
                maxLength={4}
                value={shortName}
                onChange={(e) => setShortName(e.target.value.toUpperCase())}
              />
            </div>
            <div className="col-12 col-sm-6">
              <label className="form-label small fw-semibold">Categoría *</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="col-12">
              <label className="form-label small fw-semibold">Descripción corta (máx. 180 caracteres) *</label>
              <textarea
                rows={2}
                maxLength={180}
                className="form-control"
                placeholder="Breve resumen de los objetivos y actividades de la agrupación..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label small fw-semibold">Misión y Propuesta de Valor *</label>
              <textarea
                rows={4}
                className="form-control"
                placeholder="Detalla cómo esta iniciativa beneficiará a la comunidad universitaria..."
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                required
              />
            </div>
          </div>

          <h5 className="fw-bold mb-3 border-bottom pb-2" style={{ color: '#1E1728' }}>
            2. Estudiante Promotor
          </h5>

          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6">
              <label className="form-label small fw-semibold">Nombres y Apellidos *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nombres completos"
                value={promoterName}
                onChange={(e) => setPromoterName(e.target.value)}
                required
              />
            </div>
            <div className="col-12 col-sm-6">
              <label className="form-label small fw-semibold">Correo Institucional *</label>
              <input
                type="email"
                className="form-control"
                placeholder="u20220000@aloe.ulima.edu.pe"
                value={promoterEmail}
                onChange={(e) => setPromoterEmail(e.target.value)}
                required
              />
            </div>
            <div className="col-12 col-sm-6">
              <label className="form-label small fw-semibold">Código de alumno</label>
              <input
                type="text"
                className="form-control"
                placeholder="20220000"
                value={promoterCode}
                onChange={(e) => setPromoterCode(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="btn btn-primary w-100 rounded-pill py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2"
              style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
              <span>Enviar propuesta a Bienestar Estudiantil</span>
            </button>
          </div>
        </form>
      </div>

      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate('/directorio');
        }}
        title="¡Propuesta enviada con éxito!"
        maxWidth="480px"
      >
        <div className="text-center py-3">
          <div
            className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: '64px', height: '64px', backgroundColor: '#EDFDF5', color: '#0E7047', fontSize: '2.2rem' }}
          >
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>
          <h5 className="fw-bold mb-2" style={{ color: '#1E1728' }}>
            Propuesta Recibida
          </h5>
          <p className="text-muted small mb-4">
            Tu propuesta para el <strong>{name}</strong> ha sido registrada en el sistema de Bienestar Estudiantil. Nos pondremos en contacto contigo vía correo institucional.
          </p>
          <button
            type="button"
            className="btn btn-primary rounded-pill px-4 fw-semibold"
            style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
            onClick={() => {
              setShowSuccessModal(false);
              navigate('/directorio');
            }}
          >
            Ir al Directorio de Clubes
          </button>
        </div>
      </Modal>
    </div>
  );
};
