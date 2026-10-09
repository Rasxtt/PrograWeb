import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storageService } from '../../services/storageService.js';
import { ContextBar } from '../../components/layout/ContextBar.jsx';
import { CategoryBadge } from '../../components/common/CategoryBadge.jsx';
import { CalendarDateBadge } from '../../components/common/CalendarDateBadge.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFloppyDisk,
  faUpload,
  faEye,
  faClock,
  faMapPin,
  faUsers
} from '@fortawesome/free-solid-svg-icons';

const CATEGORIES = ['Tecnología', 'Académico', 'Cultural', 'Deportivo', 'Voluntariado', 'Artístico'];

export const NewActivityPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const clubId = id || 'club-robotica';
  const club = storageService.getClubById(clubId) || storageService.getClubs()[0];

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(club?.category || CATEGORIES[0]);
  const [date, setDate] = useState('2026-10-24');
  const [time, setTime] = useState('17:00 - 19:30');
  const [location, setLocation] = useState('Pabellón W - Laboratorio 302');
  const [capacity, setCapacity] = useState(30);
  const [hasWaitingList, setHasWaitingList] = useState(true);
  const [description, setDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [error, setError] = useState('');

  if (!club) return null;

  const handleSubmit = (statusToSave) => {
    setError('');
    if (!title.trim() || !description.trim()) {
      setError('Por favor completa el título y la descripción de la actividad.');
      return;
    }

    try {
      storageService.createActivity({
        title,
        clubId: club.id,
        clubName: club.name,
        category,
        date,
        time,
        location,
        capacity: Number(capacity),
        hasWaitingList,
        description,
        detailedDescription: detailedDescription || description,
        status: statusToSave
      });

      navigate(`/club-admin/${club.id}/actividades`);
    } catch {
      setError('Error al registrar la actividad.');
    }
  };

  return (
    <div>
      <ContextBar />

      <div className="container py-4 pb-5">
        <div className="mb-4">
          <h3 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
            Crear Nueva Actividad
          </h3>
          <p className="text-muted small mb-0">
            Define la fecha, aforo, sede y temario del evento oficial para el {club.name}
          </p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small mb-3">
            {error}
          </div>
        )}

        <div className="row g-4">
          {/* LEFT: FORM */}
          <div className="col-12 col-lg-7">
            <div
              className="card border rounded-4 p-4 shadow-sm"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
            >
              <div className="mb-3">
                <label className="form-label small fw-semibold">Título de la Actividad *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej. Taller Práctico de Robótica con Arduino y ESP32"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold">Categoría *</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold">Fecha del Evento *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold">Horario (Inicio - Fin) *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="17:00 - 19:30"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold">Lugar o Enlace Virtual *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Pabellón W - Lab 302"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="row g-3 mb-3 align-items-center">
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold">Aforo / Vacantes Máximas *</label>
                  <input
                    type="number"
                    min={5}
                    max={500}
                    className="form-control"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    required
                  />
                </div>
                <div className="col-12 col-sm-6 pt-sm-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="wlCheck"
                      checked={hasWaitingList}
                      onChange={(e) => setHasWaitingList(e.target.checked)}
                    />
                    <label className="form-check-label small" htmlFor="wlCheck">
                      Habilitar lista de espera al agotarse cupos
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Descripción Corta (Cartelera) *</label>
                <textarea
                  rows={2}
                  maxLength={180}
                  className="form-control"
                  placeholder="Breve introducción para motivar a los estudiantes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Temario y Contenido Detallado</label>
                <textarea
                  rows={4}
                  className="form-control"
                  placeholder="Describe los temas a tratar, requisitos y dinámicas del evento..."
                  value={detailedDescription}
                  onChange={(e) => setDetailedDescription(e.target.value)}
                />
              </div>

              <div className="d-flex flex-wrap gap-2 pt-2 border-top">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4 btn-sm fw-semibold d-flex align-items-center gap-2"
                  onClick={() => handleSubmit('borrador')}
                >
                  <FontAwesomeIcon icon={faFloppyDisk} />
                  <span>Guardar como Borrador</span>
                </button>

                <button
                  type="button"
                  className="btn btn-primary rounded-pill px-4 btn-sm fw-semibold d-flex align-items-center gap-2"
                  style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
                  onClick={() => handleSubmit('publicada')}
                >
                  <FontAwesomeIcon icon={faUpload} />
                  <span>Publicar en Cartelera Inmediatamente</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: LIVE PREVIEW */}
          <div className="col-12 col-lg-5">
            <div
              className="card border rounded-4 p-4 shadow-sm"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="small fw-bold text-uppercase" style={{ color: '#6B2FA8' }}>
                  <FontAwesomeIcon icon={faEye} className="me-1.5" />
                  Previsualización en Cartelera
                </span>
                <span className="badge bg-light text-muted border">En vivo</span>
              </div>

              <div className="card border rounded-3 p-3 shadow-sm bg-light" style={{ borderColor: '#E6E1EE' }}>
                <div className="d-flex align-items-start gap-3 mb-2">
                  <CalendarDateBadge dateString={date} />
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="small text-muted">{club.name}</span>
                      <CategoryBadge category={category} />
                    </div>
                    <h6 className="fw-bold mb-0" style={{ color: '#1E1728' }}>
                      {title || 'Título de la Actividad'}
                    </h6>
                  </div>
                </div>

                <p className="text-muted small mb-3" style={{ minHeight: '38px', fontSize: '0.82rem' }}>
                  {description || 'Aquí se mostrará el resumen de la actividad en la cartelera.'}
                </p>

                <div className="d-flex flex-column gap-1 small text-muted mb-3" style={{ fontSize: '0.76rem' }}>
                  <div className="d-flex align-items-center gap-2">
                    <FontAwesomeIcon icon={faClock} style={{ color: '#6B2FA8' }} />
                    <span>{time}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <FontAwesomeIcon icon={faMapPin} style={{ color: '#6B2FA8' }} />
                    <span>{location}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <FontAwesomeIcon icon={faUsers} style={{ color: '#6B2FA8' }} />
                    <span>0 de {capacity} registrados ({capacity} cupos)</span>
                  </div>
                </div>

                <div className="pt-2 border-top d-flex justify-content-between align-items-center">
                  <span className="small text-muted" style={{ fontSize: '0.72rem' }}>Aforo: {capacity} vacantes</span>
                  <button type="button" className="btn btn-primary btn-sm rounded-pill px-3" disabled style={{ backgroundColor: '#6B2FA8' }}>
                    Inscribirme
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
