import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { storageService } from '../../services/storageService.js';
import { ContextBar } from '../../components/layout/ContextBar.jsx';
import { ClubInitialsBadge } from '../../components/common/ClubInitialsBadge.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUpload,
  faTrash,
  faCheck,
  faFloppyDisk,
  faImages,
  faPlus
} from '@fortawesome/free-solid-svg-icons';

export const ClubImagesPage = () => {
  const { id } = useParams();
  const clubId = id || 'club-robotica';
  const club = storageService.getClubById(clubId) || storageService.getClubs()[0];

  const [bannerPattern, setBannerPattern] = useState(club?.bannerPattern || 'diagonal');
  const [logoInitials, setLogoInitials] = useState(club?.shortName || 'RB');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [gallery, setGallery] = useState([
    { id: 1, title: 'Taller de Arduino 2026-1', caption: 'Laboratorio de Ingeniería' },
    { id: 2, title: 'Competencia Interuniversitaria', caption: '1er Puesto Categoría Sumo' },
    { id: 3, title: 'Feria de Clubes Monterrico', caption: 'Stand de Robótica Ulima' }
  ]);

  if (!club) return null;

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...club,
      bannerPattern,
      shortName: logoInitials
    };
    storageService.updateClub(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddPhoto = () => {
    if (gallery.length >= 8) {
      alert('Se permite un máximo de 8 fotos en la galería del club.');
      return;
    }
    const newId = Date.now();
    setGallery([
      ...gallery,
      { id: newId, title: `Foto ${gallery.length + 1} de actividades`, caption: 'Campus Monterrico' }
    ]);
  };

  const handleRemovePhoto = (photoId) => {
    setGallery(gallery.filter(g => g.id !== photoId));
  };

  return (
    <div>
      <ContextBar />

      <div className="container py-4">
        <div className="mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <h3 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
              Gestión de Imágenes y Multimedia
            </h3>
            <p className="text-muted small mb-0">
              Personaliza el logotipo, banner de portada y la galería fotográfica del club
            </p>
          </div>
          {savedSuccess && (
            <div className="badge bg-success-subtle text-success p-2 px-3 rounded-pill d-flex align-items-center gap-1.5 border border-success-subtle">
              <FontAwesomeIcon icon={faCheck} />
              <span>Imágenes actualizadas con éxito</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSave}>
          <div className="row g-4">
            {/* LOGO SECTION */}
            <div className="col-12 col-md-6">
              <div
                className="card border rounded-4 p-4 h-100 shadow-sm"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
              >
                <h5 className="fw-bold mb-3" style={{ color: '#1E1728' }}>
                  Logotipo Oficial del Club
                </h5>
                <p className="text-muted small mb-3">
                  Se muestra en el directorio, fichas públicas, carteles y credenciales institucionales.
                </p>

                <div className="d-flex align-items-center gap-4 mb-4">
                  <ClubInitialsBadge initials={logoInitials} size={72} />
                  <div>
                    <div className="small fw-semibold mb-1">Siglas / Iniciales:</div>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      style={{ width: '100px' }}
                      maxLength={4}
                      value={logoInitials}
                      onChange={(e) => setLogoInitials(e.target.value.toUpperCase())}
                    />
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm rounded-pill d-flex align-items-center gap-2"
                    onClick={() => alert('Selector de archivo simulado para avatar.')}
                  >
                    <FontAwesomeIcon icon={faUpload} />
                    <span>Subir imagen PNG</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-light btn-sm rounded-pill text-muted"
                    onClick={() => setLogoInitials('RB')}
                  >
                    Restablecer
                  </button>
                </div>
              </div>
            </div>

            {/* BANNER SECTION */}
            <div className="col-12 col-md-6">
              <div
                className="card border rounded-4 p-4 h-100 shadow-sm"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
              >
                <h5 className="fw-bold mb-3" style={{ color: '#1E1728' }}>
                  Portada / Banner Institucional
                </h5>
                <p className="text-muted small mb-3">
                  Aparece como cabecera panorámica en la ficha pública del club.
                </p>

                {/* Banner preview */}
                <div
                  className="rounded-3 mb-3 d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                  style={{
                    height: '100px',
                    background:
                      bannerPattern === 'diagonal'
                        ? 'repeating-linear-gradient(45deg, #4F2280, #4F2280 20px, #6B2FA8 20px, #6B2FA8 40px)'
                        : 'linear-gradient(135deg, #4F2280 0%, #6B2FA8 50%, #17A2A2 100%)'
                  }}
                >
                  Vista previa de Portada
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Patrón de Banner</label>
                  <select
                    className="form-select form-select-sm"
                    value={bannerPattern}
                    onChange={(e) => setBannerPattern(e.target.value)}
                  >
                    <option value="diagonal">Patrón Rayado Institucional (Recomendado)</option>
                    <option value="gradient">Gradiente Suave Morado - Cian</option>
                  </select>
                </div>
              </div>
            </div>

            {/* GALLERY SECTION */}
            <div className="col-12">
              <div
                className="card border rounded-4 p-4 shadow-sm"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
              >
                <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-2">
                  <div>
                    <h5 className="fw-bold mb-1" style={{ color: '#1E1728' }}>
                      <FontAwesomeIcon icon={faImages} className="me-2" style={{ color: '#6B2FA8' }} />
                      Galería de Actividades del Club
                    </h5>
                    <p className="text-muted small mb-0">
                      Fotografías de talleres, ferias y competencias pasadas ({gallery.length}/8 fotos).
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm rounded-pill d-flex align-items-center gap-1.5"
                    style={{ borderColor: '#6B2FA8', color: '#6B2FA8' }}
                    onClick={handleAddPhoto}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Agregar foto</span>
                  </button>
                </div>

                <div className="row g-3">
                  {gallery.map((item) => (
                    <div key={item.id} className="col-12 col-sm-6 col-md-4">
                      <div className="border rounded-3 p-3 bg-light position-relative">
                        <div
                          className="rounded-2 mb-2 d-flex align-items-center justify-content-center text-muted fw-bold"
                          style={{
                            height: '110px',
                            backgroundColor: '#E6E1EE',
                            fontSize: '0.85rem'
                          }}
                        >
                          [ Foto {item.id} ]
                        </div>
                        <div className="fw-semibold small text-truncate" style={{ color: '#1E1728' }}>
                          {item.title}
                        </div>
                        <div className="text-muted small text-truncate" style={{ fontSize: '0.75rem' }}>
                          {item.caption}
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger rounded-circle position-absolute top-0 end-0 m-2"
                          style={{ width: '28px', height: '28px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          onClick={() => handleRemovePhoto(item.id)}
                          title="Eliminar foto"
                        >
                          <FontAwesomeIcon icon={faTrash} style={{ fontSize: '0.75rem' }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-12">
              <button
                type="submit"
                className="btn btn-primary rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2"
                style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
              >
                <FontAwesomeIcon icon={faFloppyDisk} />
                <span>Guardar cambios de multimedia</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
