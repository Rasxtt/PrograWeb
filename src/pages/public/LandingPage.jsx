import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { storageService } from '../../services/storageService.js';
import { CategoryBadge } from '../../components/common/CategoryBadge.jsx';
import { CalendarDateBadge } from '../../components/common/CalendarDateBadge.jsx';
import { ClubInitialsBadge } from '../../components/common/ClubInitialsBadge.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faUsers,
  faCalendarDays,
  faGraduationCap,
  faAward,
  faArrowRight,
  faMapPin
} from '@fortawesome/free-solid-svg-icons';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const clubs = storageService.getClubs().filter(c => c.status === 'activo');
  const activities = storageService.getActivities().filter(a => a.status === 'publicada');

  const featuredClubs = clubs.slice(0, 6);
  const upcomingActivities = activities.slice(0, 3);

  const categories = [
    { name: 'Académico', count: clubs.filter(c => c.category === 'Académico').length, desc: 'Debate, finanzas e investigación' },
    { name: 'Tecnología', count: clubs.filter(c => c.category === 'Tecnología').length, desc: 'Robótica, desarrollo de software e IA' },
    { name: 'Cultural', count: clubs.filter(c => c.category === 'Cultural').length, desc: 'Cine, literatura, idiomas e historia' },
    { name: 'Deportivo', count: clubs.filter(c => c.category === 'Deportivo').length, desc: 'Ajedrez, e-sports y acondicionamiento' },
    { name: 'Voluntariado', count: clubs.filter(c => c.category === 'Voluntariado').length, desc: 'Impacto social y sostenibilidad' },
    { name: 'Artístico', count: clubs.filter(c => c.category === 'Artístico').length, desc: 'Fotografía, música y teatro' }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/directorio?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/directorio');
    }
  };

  return (
    <div className="landing-page pb-5">
      {/* HERO SECTION */}
      <section
        className="py-5"
        style={{
          background: 'linear-gradient(180deg, #F0E9F9 0%, #FBFAFD 100%)',
          borderBottom: '1px solid #E6E1EE'
        }}
      >
        <div className="container py-4 text-center">
          <div className="mx-auto" style={{ maxWidth: '820px' }}>
            <span
              className="badge px-3 py-1.5 rounded-pill mb-3 fw-semibold shadow-sm"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#6B2FA8',
                border: '1px solid #E6E1EE',
                fontSize: '0.82rem'
              }}
            >
              VIDA UNIVERSITARIA ULIMA 2026-2
            </span>

            <h1
              className="display-5 fw-bold mb-3"
              style={{
                fontFamily: "'Outfit', sans-serif",
                color: '#1E1728',
                letterSpacing: '-0.5px'
              }}
            >
              Descubre tu pasión, conecta con tu comunidad universitaria
            </h1>

            <p
              className="lead text-muted mb-4 px-md-4"
              style={{ fontSize: '1.1rem', lineHeight: 1.6 }}
            >
              Explora más de 15 clubes oficiales, participa en talleres, competencias y actividades extracurriculares reconocidas por Bienestar Estudiantil.
            </p>

            {/* Search Box */}
            <form onSubmit={handleSearchSubmit} className="mb-3">
              <div
                className="d-flex align-items-center bg-white rounded-pill p-1 shadow-sm mx-auto"
                style={{
                  maxWidth: '620px',
                  border: '1px solid #D6CEE2'
                }}
              >
                <div className="px-3 text-muted">
                  <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: '#6B2FA8' }} />
                </div>
                <input
                  type="text"
                  className="form-control border-0 shadow-none px-0"
                  placeholder="Buscar clubes por nombre, temática o interés..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ fontSize: '0.95rem' }}
                />
                <button
                  type="submit"
                  className="btn btn-primary rounded-pill px-4 py-2 fw-semibold"
                  style={{
                    backgroundColor: '#6B2FA8',
                    borderColor: '#6B2FA8',
                    fontSize: '0.9rem'
                  }}
                >
                  Buscar
                </button>
              </div>
            </form>

            {/* Quick tag pills */}
            <div className="d-flex flex-wrap align-items-center justify-content-center gap-2 small text-muted">
              <span>Populares:</span>
              {['Robótica', 'Debate', 'Fotografía', 'Voluntariado', 'Finanzas', 'Cine'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="btn btn-sm btn-light rounded-pill border py-0 px-2.5 text-secondary"
                  style={{ fontSize: '0.78rem' }}
                  onClick={() => navigate(`/directorio?q=${encodeURIComponent(tag)}`)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* METRICS STRIP */}
      <section className="py-4 bg-white border-bottom">
        <div className="container">
          <div className="row text-center g-3">
            <div className="col-6 col-md-3">
              <div className="d-flex align-items-center justify-content-center gap-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{ width: '44px', height: '44px', backgroundColor: '#F0E9F9', color: '#6B2FA8' }}
                >
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <div className="text-start">
                  <div className="fw-bold fs-4" style={{ color: '#1E1728', lineHeight: 1.1 }}>15+</div>
                  <div className="text-muted small" style={{ fontSize: '0.78rem' }}>Clubes Oficiales</div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="d-flex align-items-center justify-content-center gap-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{ width: '44px', height: '44px', backgroundColor: '#EDFDF5', color: '#0E7047' }}
                >
                  <FontAwesomeIcon icon={faCalendarDays} />
                </div>
                <div className="text-start">
                  <div className="fw-bold fs-4" style={{ color: '#1E1728', lineHeight: 1.1 }}>120+</div>
                  <div className="text-muted small" style={{ fontSize: '0.78rem' }}>Actividades al Año</div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="d-flex align-items-center justify-content-center gap-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{ width: '44px', height: '44px', backgroundColor: '#EFF6FF', color: '#2563A8' }}
                >
                  <FontAwesomeIcon icon={faGraduationCap} />
                </div>
                <div className="text-start">
                  <div className="fw-bold fs-4" style={{ color: '#1E1728', lineHeight: 1.1 }}>1,850+</div>
                  <div className="text-muted small" style={{ fontSize: '0.78rem' }}>Estudiantes Activos</div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="d-flex align-items-center justify-content-center gap-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{ width: '44px', height: '44px', backgroundColor: '#FFF8F0', color: '#C2681C' }}
                >
                  <FontAwesomeIcon icon={faAward} />
                </div>
                <div className="text-start">
                  <div className="fw-bold fs-4" style={{ color: '#1E1728', lineHeight: 1.1 }}>100%</div>
                  <div className="text-muted small" style={{ fontSize: '0.78rem' }}>Reconocimiento Ulima</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex flex-wrap align-items-end justify-content-between mb-4">
            <div>
              <span className="text-uppercase fw-bold small" style={{ color: '#6B2FA8', letterSpacing: '0.5px' }}>
                Explora por Áreas
              </span>
              <h2 className="fw-bold mb-0" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
                Categorías de Clubes
              </h2>
            </div>
            <Link
              to="/directorio"
              className="btn btn-link text-decoration-none fw-semibold p-0"
              style={{ color: '#6B2FA8' }}
            >
              Ver todos los clubes <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
            </Link>
          </div>

          <div className="row g-3">
            {categories.map((cat) => (
              <div key={cat.name} className="col-12 col-sm-6 col-lg-4">
                <div
                  className="card h-100 border p-3 rounded-3 hover-shadow transition cursor-pointer"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E6E1EE',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/directorio?categoria=${encodeURIComponent(cat.name)}`)}
                >
                  <div className="d-flex align-items-start justify-content-between mb-2">
                    <CategoryBadge category={cat.name} />
                    <span className="small text-muted">{cat.count} clubes</span>
                  </div>
                  <h5 className="fw-bold mb-1" style={{ color: '#1E1728' }}>
                    {cat.name}
                  </h5>
                  <p className="text-muted small mb-0">
                    {cat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED CLUBS */}
      <section className="py-5" style={{ backgroundColor: '#FBFAFD' }}>
        <div className="container">
          <div className="d-flex flex-wrap align-items-end justify-content-between mb-4">
            <div>
              <span className="text-uppercase fw-bold small" style={{ color: '#6B2FA8', letterSpacing: '0.5px' }}>
                Comunidades Destacadas
              </span>
              <h2 className="fw-bold mb-0" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
                Clubes Estudiantiles
              </h2>
            </div>
            <Link
              to="/directorio"
              className="btn btn-outline-secondary btn-sm rounded-pill px-3"
              style={{ borderColor: '#E6E1EE', color: '#6E6580' }}
            >
              Explorar directorio completo
            </Link>
          </div>

          <div className="row g-4">
            {featuredClubs.map((club) => (
              <div key={club.id} className="col-12 col-md-6 col-lg-4">
                <div
                  className="card h-100 border rounded-3 overflow-hidden shadow-sm"
                  style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
                >
                  {/* Banner header */}
                  <div
                    style={{
                      height: '80px',
                      background: 'linear-gradient(135deg, #6B2FA8 0%, #4F2280 100%)',
                      position: 'relative'
                    }}
                  >
                    <div
                      className="position-absolute"
                      style={{ bottom: '-20px', left: '20px' }}
                    >
                      <ClubInitialsBadge initials={club.shortName} size={46} />
                    </div>
                  </div>

                  <div className="card-body pt-4 px-3 pb-3 d-flex flex-column">
                    <div className="d-flex align-items-center justify-content-between mb-2 mt-1">
                      <CategoryBadge category={club.category} />
                      <span className="small text-muted d-flex align-items-center gap-1">
                        <FontAwesomeIcon icon={faUsers} style={{ fontSize: '0.75rem' }} />
                        {club.memberCount || 24} miembros
                      </span>
                    </div>

                    <h5 className="fw-bold mb-1" style={{ color: '#1E1728' }}>
                      {club.name}
                    </h5>
                    <p
                      className="text-muted small flex-grow-1 mb-3"
                      style={{ lineHeight: 1.5, minHeight: '42px' }}
                    >
                      {club.description}
                    </p>

                    <div className="pt-2 border-top d-flex align-items-center justify-content-between">
                      <span className="small fw-semibold" style={{ color: '#6B2FA8', fontSize: '0.8rem' }}>
                        {club.admissionType === 'abierto' ? 'Ingreso abierto' : 'Convocatoria'}
                      </span>
                      <Link
                        to={`/club/${club.id}`}
                        className="btn btn-outline-primary btn-sm rounded-pill px-3"
                        style={{
                          borderColor: '#6B2FA8',
                          color: '#6B2FA8',
                          fontSize: '0.8rem'
                        }}
                      >
                        Ver club
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UPCOMING ACTIVITIES */}
      <section className="py-5 bg-white border-top">
        <div className="container">
          <div className="d-flex flex-wrap align-items-end justify-content-between mb-4">
            <div>
              <span className="text-uppercase fw-bold small" style={{ color: '#6B2FA8', letterSpacing: '0.5px' }}>
                Próximos Eventos
              </span>
              <h2 className="fw-bold mb-0" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
                Cartelera de Actividades
              </h2>
            </div>
            <Link
              to="/cartelera"
              className="btn btn-outline-secondary btn-sm rounded-pill px-3"
              style={{ borderColor: '#E6E1EE', color: '#6E6580' }}
            >
              Ver cartelera completa
            </Link>
          </div>

          <div className="row g-3">
            {upcomingActivities.map((act) => (
              <div key={act.id} className="col-12 col-md-4">
                <div
                  className="card h-100 border rounded-3 p-3 shadow-sm d-flex flex-column"
                  style={{ borderColor: '#E6E1EE' }}
                >
                  <div className="d-flex align-items-start gap-3 mb-2">
                    <CalendarDateBadge dateString={act.date} />
                    <div className="flex-grow-1">
                      <div className="small text-muted mb-1" style={{ fontSize: '0.76rem' }}>
                        {act.clubName}
                      </div>
                      <h6 className="fw-bold mb-1" style={{ color: '#1E1728' }}>
                        {act.title}
                      </h6>
                    </div>
                  </div>

                  <p className="text-muted small flex-grow-1 mb-2" style={{ fontSize: '0.82rem' }}>
                    {act.description}
                  </p>

                  <div className="d-flex align-items-center justify-content-between small text-muted pt-2 border-top">
                    <span className="d-flex align-items-center gap-1">
                      <FontAwesomeIcon icon={faMapPin} style={{ fontSize: '0.75rem', color: '#6B2FA8' }} />
                      {act.location}
                    </span>
                    <Link
                      to={`/actividad/${act.id}`}
                      className="btn btn-sm btn-link text-decoration-none fw-semibold p-0"
                      style={{ color: '#6B2FA8', fontSize: '0.82rem' }}
                    >
                      Inscribirme
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA REGISTER CLUB */}
      <section className="py-5">
        <div className="container">
          <div
            className="rounded-4 p-4 p-md-5 text-white position-relative overflow-hidden shadow"
            style={{
              background: 'linear-gradient(135deg, #4F2280 0%, #6B2FA8 50%, #17A2A2 100%)'
            }}
          >
            <div className="row align-items-center">
              <div className="col-12 col-lg-8">
                <span className="badge bg-white text-dark mb-2 px-3 py-1 rounded-pill fw-semibold small">
                  Iniciativas Estudiantiles
                </span>
                <h2 className="fw-bold mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  ¿Tienes una propuesta o quieres fundar un nuevo club?
                </h2>
                <p className="lead mb-3 text-light opacity-90" style={{ fontSize: '1rem' }}>
                  El programa de Vida Universitaria apoya a estudiantes organizados para constituir nuevos clubes oficiales con asesoría y financiamiento institucional.
                </p>
                <Link
                  to="/registrar-club"
                  className="btn btn-light rounded-pill px-4 py-2 fw-bold"
                  style={{ color: '#6B2FA8', fontSize: '0.92rem' }}
                >
                  Presentar propuesta de nuevo club
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
