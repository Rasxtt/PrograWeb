import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../../services/storageService.js';
import { CalendarDateBadge } from '../../components/common/CalendarDateBadge.jsx';
import { CategoryBadge } from '../../components/common/CategoryBadge.jsx';
import { ClubInitialsBadge } from '../../components/common/ClubInitialsBadge.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faClock,
  faMapPin,
  faUsers,
  faSliders,
  faRotateRight
} from '@fortawesome/free-solid-svg-icons';

export const BillboardPage = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');
  const [modality, setModality] = useState('todas'); // 'todas' | 'presencial' | 'virtual'

  const activities = storageService.getActivities().filter(a => a.status === 'publicada');

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = act.title.toLowerCase().includes(q);
        const matchClub = act.clubName.toLowerCase().includes(q);
        const matchDesc = act.description.toLowerCase().includes(q);
        if (!matchTitle && !matchClub && !matchDesc) return false;
      }

      if (category !== 'Todas' && act.category !== category) {
        return false;
      }

      if (modality !== 'todas') {
        const isVirtual = act.location.toLowerCase().includes('zoom') ||
                          act.location.toLowerCase().includes('teams') ||
                          act.location.toLowerCase().includes('virtual');
        if (modality === 'virtual' && !isVirtual) return false;
        if (modality === 'presencial' && isVirtual) return false;
      }

      return true;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [activities, search, category, modality]);

  const categories = ['Todas', 'Tecnología', 'Académico', 'Cultural', 'Deportivo', 'Voluntariado', 'Artístico'];

  return (
    <div className="container py-4 pb-5">
      {/* Title */}
      <div className="mb-4">
        <span className="badge px-3 py-1.5 rounded-pill mb-2 fw-semibold" style={{ backgroundColor: '#F0E9F9', color: '#6B2FA8' }}>
          AGENDA Y PARTICIPACIÓN
        </span>
        <h2 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
          Cartelera de Actividades Estudiantiles
        </h2>
        <p className="text-muted small mb-0">
          Talleres, conferencias, torneos y ferias extracurriculares organizadas por los clubes oficiales Ulima
        </p>
      </div>

      {/* Filter card */}
      <div
        className="card border rounded-4 p-3 p-md-4 mb-4 shadow-sm"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
      >
        <div className="row g-3 align-items-center mb-3">
          <div className="col-12 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-muted" style={{ borderColor: '#D6CEE2' }}>
                <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: '#6B2FA8' }} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Buscar por título, club o tema..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ borderColor: '#D6CEE2' }}
              />
            </div>
          </div>

          <div className="col-12 col-md-4">
            <select
              className="form-select"
              value={modality}
              onChange={(e) => setModality(e.target.value)}
              style={{ borderColor: '#D6CEE2' }}
            >
              <option value="todas">Modalidad: Todas</option>
              <option value="presencial">Presencial (Campus)</option>
              <option value="virtual">Virtual (Zoom / Teams)</option>
            </select>
          </div>
        </div>

        {/* Category pills */}
        <div className="d-flex flex-wrap align-items-center gap-1.5 pt-2 border-top">
          <span className="small text-muted me-2 d-none d-sm-inline">
            <FontAwesomeIcon icon={faSliders} className="me-1" />
            Categoría:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`btn btn-sm rounded-pill fw-semibold transition-all ${
                category === cat ? 'btn-primary' : 'btn-light border'
              }`}
              style={{
                backgroundColor: category === cat ? '#6B2FA8' : '#FBFAFD',
                borderColor: category === cat ? '#6B2FA8' : '#E6E1EE',
                color: category === cat ? '#FFFFFF' : '#4A3E56',
                fontSize: '0.8rem',
                padding: '4px 12px'
              }}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results counter */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="small text-muted">
          Mostrando <strong>{filteredActivities.length}</strong> actividades programadas
        </div>
        {(search || category !== 'Todas' || modality !== 'todas') && (
          <button
            type="button"
            className="btn btn-link btn-sm text-decoration-none p-0 d-flex align-items-center gap-1"
            style={{ color: '#6B2FA8', fontSize: '0.84rem' }}
            onClick={() => { setSearch(''); setCategory('Todas'); setModality('todas'); }}
          >
            <FontAwesomeIcon icon={faRotateRight} />
            <span>Limpiar filtros</span>
          </button>
        )}
      </div>

      {/* Activities Grid */}
      {filteredActivities.length === 0 ? (
        <div
          className="card border rounded-4 p-5 text-center shadow-sm"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
        >
          <h5 className="fw-bold mb-2" style={{ color: '#1E1728' }}>
            No se encontraron actividades
          </h5>
          <p className="text-muted small mb-0">
            No hay eventos que coincidan con los filtros seleccionados.
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredActivities.map((act) => {
            const club = storageService.getClubById(act.clubId);
            const remaining = Math.max(0, act.capacity - (act.registeredCount || 0));
            const isFull = remaining === 0;

            return (
              <div key={act.id} className="col-12 col-md-6 col-lg-4">
                <div
                  className="card h-100 border rounded-4 p-3 shadow-sm d-flex flex-column justify-content-between hover-shadow transition"
                  style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
                >
                  <div>
                    {/* Top bar: Date badge + Club + Category */}
                    <div className="d-flex align-items-start gap-3 mb-3">
                      <CalendarDateBadge dateString={act.date} />
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <span className="small text-muted text-truncate" style={{ maxWidth: '140px', fontSize: '0.78rem' }}>
                            {act.clubName}
                          </span>
                          <CategoryBadge category={act.category} />
                        </div>
                        <h6 className="fw-bold mb-0" style={{ color: '#1E1728', lineHeight: 1.3 }}>
                          {act.title}
                        </h6>
                      </div>
                    </div>

                    <p className="text-muted small mb-3" style={{ fontSize: '0.83rem', lineHeight: 1.5, minHeight: '40px' }}>
                      {act.description}
                    </p>

                    <div className="d-flex flex-column gap-1.5 small text-muted mb-3" style={{ fontSize: '0.78rem' }}>
                      <div className="d-flex align-items-center gap-2">
                        <FontAwesomeIcon icon={faClock} style={{ color: '#6B2FA8' }} />
                        <span>{act.time || '17:00 - 19:00'} hrs</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <FontAwesomeIcon icon={faMapPin} style={{ color: '#6B2FA8' }} />
                        <span className="text-truncate">{act.location}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <FontAwesomeIcon icon={faUsers} style={{ color: '#6B2FA8' }} />
                        <span>
                          {isFull ? (
                            <strong className="text-danger">Cupos agotados</strong>
                          ) : (
                            <span><strong>{remaining}</strong> cupos disponibles</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-top d-flex align-items-center justify-content-between">
                    <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
                      Aforo: {act.capacity} personas
                    </span>
                    <Link
                      to={`/actividad/${act.id}`}
                      className="btn btn-primary btn-sm rounded-pill px-3 fw-semibold"
                      style={{
                        backgroundColor: isFull ? '#C2681C' : '#6B2FA8',
                        borderColor: isFull ? '#C2681C' : '#6B2FA8',
                        fontSize: '0.8rem'
                      }}
                    >
                      {isFull ? 'Lista de espera' : 'Inscribirme'}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
