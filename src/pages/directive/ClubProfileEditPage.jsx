import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { storageService } from '../../services/storageService.js';
import { ContextBar } from '../../components/layout/ContextBar.jsx';
import { CategoryBadge } from '../../components/common/CategoryBadge.jsx';
import { ClubInitialsBadge } from '../../components/common/ClubInitialsBadge.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faFloppyDisk, faCheckCircle, faEye } from '@fortawesome/free-solid-svg-icons';

export const ClubProfileEditPage = () => {
  const { id } = useParams();
  const clubId = id || 'club-robotica';
  const club = storageService.getClubById(clubId) || storageService.getClubs()[0];

  const [name, setName] = useState('');
  const [slogan, setSlogan] = useState('');
  const [category, setCategory] = useState('');
  const [targetCareers, setTargetCareers] = useState('');
  const [description, setDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [website, setWebsite] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (club) {
      setName(club.name || '');
      setSlogan(club.slogan || 'Innovación, robótica y tecnología aplicada');
      setCategory(club.category || 'Tecnología');
      setTargetCareers(club.targetCareers || 'Ingeniería de Sistemas, Industrial');
      setDescription(club.description || '');
      setDetailedDescription(club.detailedDescription || '');
      setInstagram(club.socialLinks?.instagram || '@robotica_ulima');
      setLinkedin(club.socialLinks?.linkedin || 'linkedin.com/company/robotica-ulima');
      setWebsite(club.socialLinks?.website || 'https://robotica.ulima.edu.pe');
    }
  }, [club]);

  if (!club) return null;

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...club,
      name,
      slogan,
      category,
      targetCareers,
      description,
      detailedDescription,
      socialLinks: {
        instagram,
        linkedin,
        website
      }
    };
    storageService.updateClub(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div>
      <ContextBar />

      <div className="container py-4">
        {/* Title & subtitle */}
        <div className="mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <h3 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
              Editar Perfil del Club
            </h3>
            <p className="text-muted small mb-0">
              Actualiza la información general, descripción y canales de contacto del club
            </p>
          </div>
          {savedSuccess && (
            <div className="badge bg-success-subtle text-success p-2 px-3 rounded-pill d-flex align-items-center gap-1.5 border border-success-subtle">
              <FontAwesomeIcon icon={faCheck} />
              <span>Cambios guardados con éxito</span>
            </div>
          )}
        </div>

        <div className="row g-4">
          {/* Left Column: Form */}
          <div className="col-12 col-lg-7">
            <div
              className="card border rounded-4 p-4 shadow-sm"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
            >
              <form onSubmit={handleSave}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Nombre del Club</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Lema o Frase representativa</label>
                  <input
                    type="text"
                    className="form-control"
                    value={slogan}
                    onChange={(e) => setSlogan(e.target.value)}
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-semibold">Categoría Oficial</label>
                    <select
                      className="form-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {['Tecnología', 'Académico', 'Cultural', 'Deportivo', 'Voluntariado', 'Artístico'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-semibold">Carreras afines sugeridas</label>
                    <input
                      type="text"
                      className="form-control"
                      value={targetCareers}
                      onChange={(e) => setTargetCareers(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <label className="form-label small fw-semibold">Descripción Corta (Directorio)</label>
                    <span className="small text-muted">{description.length}/180</span>
                  </div>
                  <textarea
                    rows={2}
                    maxLength={180}
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold">Descripción Detallada y Misión</label>
                  <textarea
                    rows={5}
                    className="form-control"
                    value={detailedDescription}
                    onChange={(e) => setDetailedDescription(e.target.value)}
                    required
                  />
                </div>

                <h6 className="fw-bold mb-3 border-bottom pb-2" style={{ color: '#1E1728' }}>
                  Canales de Contacto y Redes Sociales
                </h6>

                <div className="row g-3 mb-4">
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-semibold">Instagram (@usuario)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-semibold">LinkedIn</label>
                    <input
                      type="text"
                      className="form-control"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold">Sitio Web Oficial</label>
                    <input
                      type="url"
                      className="form-control"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2"
                  style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
                >
                  <FontAwesomeIcon icon={faFloppyDisk} />
                  <span>Guardar cambios del perfil</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Live Preview & Completion Card */}
          <div className="col-12 col-lg-5">
            {/* Live Preview Card */}
            <div
              className="card border rounded-4 p-4 mb-4 shadow-sm"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="small fw-bold text-uppercase" style={{ color: '#6B2FA8', letterSpacing: '0.5px' }}>
                  <FontAwesomeIcon icon={faEye} className="me-1.5" />
                  Previsualización en Directorio
                </span>
                <span className="badge bg-light text-muted border">En vivo</span>
              </div>

              {/* Mockup card */}
              <div
                className="card border rounded-3 overflow-hidden shadow-sm"
                style={{ borderColor: '#E6E1EE' }}
              >
                <div
                  style={{
                    height: '80px',
                    background: 'linear-gradient(135deg, #6B2FA8 0%, #4F2280 100%)',
                    position: 'relative'
                  }}
                >
                  <div className="position-absolute" style={{ bottom: '-20px', left: '20px' }}>
                    <ClubInitialsBadge initials={club.shortName} size={46} />
                  </div>
                </div>
                <div className="card-body pt-4 px-3 pb-3">
                  <div className="d-flex align-items-center justify-content-between mb-2 mt-1">
                    <CategoryBadge category={category} />
                    <span className="small text-muted">{club.memberCount || 24} miembros</span>
                  </div>
                  <h5 className="fw-bold mb-1" style={{ color: '#1E1728' }}>
                    {name || 'Nombre del Club'}
                  </h5>
                  <p className="text-muted small mb-3" style={{ minHeight: '42px', lineHeight: 1.5 }}>
                    {description || 'Aquí se mostrará la descripción breve que escribas en el formulario.'}
                  </p>
                  <div className="pt-2 border-top d-flex align-items-center justify-content-between">
                    <span className="small fw-semibold" style={{ color: '#6B2FA8', fontSize: '0.8rem' }}>
                      {club.admissionType === 'abierto' ? 'Ingreso abierto' : 'Convocatoria'}
                    </span>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm rounded-pill px-3"
                      style={{ borderColor: '#6B2FA8', color: '#6B2FA8', fontSize: '0.8rem' }}
                      disabled
                    >
                      Ver club
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Completeness Card */}
            <div
              className="card border rounded-4 p-4 shadow-sm"
              style={{ backgroundColor: '#FBFAFD', borderColor: '#E6E1EE' }}
            >
              <h6 className="fw-bold mb-2" style={{ color: '#1E1728' }}>
                Completitud del Perfil
              </h6>
              <div className="progress mb-3" style={{ height: '8px' }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: '92%', backgroundColor: '#0E7047' }}
                  aria-valuenow="92"
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>

              <ul className="list-unstyled d-flex flex-column gap-2 small mb-0 text-muted">
                <li className="d-flex align-items-center gap-2 text-success">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <span>Información básica y lema completados</span>
                </li>
                <li className="d-flex align-items-center gap-2 text-success">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <span>Descripción corta y detallada configuradas</span>
                </li>
                <li className="d-flex align-items-center gap-2 text-success">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <span>Canales de contacto y redes sociales enlazados</span>
                </li>
                <li className="d-flex align-items-center gap-2 text-success">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <span>Modalidad de admisión activa</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
