import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { storageService } from '../../services/storageService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { CategoryBadge } from '../../components/common/CategoryBadge.jsx';
import { ClubInitialsBadge } from '../../components/common/ClubInitialsBadge.jsx';
import { MembershipModal } from '../../components/clubs/MembershipModal.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faUsers,
  faSliders,
  faRotateRight,
  faPaperPlane,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

export const ClubDirectoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentUser } = useAuth();

  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('categoria') || 'Todas';

  const [search, setSearch] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [admissionFilter, setAdmissionFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('name-asc');

  const [selectedClubForModal, setSelectedClubForModal] = useState(null);

  const allClubs = storageService.getClubs().filter(c => c.status !== 'oculto');
  const userMemberships = currentUser ? storageService.getMembershipsByUserId(currentUser.id) : [];

  const filteredClubs = useMemo(() => {
    return allClubs.filter((club) => {
      // Search text
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchName = club.name.toLowerCase().includes(query);
        const matchDesc = club.description.toLowerCase().includes(query);
        const matchCat = club.category.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchCat) return false;
      }

      // Category
      if (category !== 'Todas' && club.category !== category) {
        return false;
      }

      // Admission
      if (admissionFilter !== 'todos' && club.admissionType !== admissionFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'members-desc') return (b.memberCount || 0) - (a.memberCount || 0);
      return 0;
    });
  }, [allClubs, search, category, admissionFilter, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('Todas');
    setAdmissionFilter('todos');
    setSortBy('name-asc');
    setSearchParams({});
  };

  const getMembershipForClub = (clubId) => {
    return userMemberships.find(m => m.clubId === clubId);
  };

  const categories = ['Todas', 'Tecnología', 'Académico', 'Cultural', 'Deportivo', 'Voluntariado', 'Artístico'];

  return (
    <div className="container py-4 pb-5">
      {/* Page Title */}
      <div className="mb-4">
        <span className="badge px-3 py-1.5 rounded-pill mb-2 fw-semibold" style={{ backgroundColor: '#F0E9F9', color: '#6B2FA8' }}>
          EXPLORA Y PARTICIPA
        </span>
        <h2 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
          Directorio de Clubes Estudiantiles
        </h2>
        <p className="text-muted small mb-0">
          Encuentra organizaciones oficiales, conéctate con estudiantes afines y postula a nuevas convocatorias
        </p>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div
        className="card border rounded-4 p-3 p-md-4 mb-4 shadow-sm"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
      >
        <div className="row g-3 align-items-center mb-3">
          {/* Search Input */}
          <div className="col-12 col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-muted" style={{ borderColor: '#D6CEE2' }}>
                <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: '#6B2FA8' }} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Buscar por nombre o palabra clave..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ borderColor: '#D6CEE2' }}
              />
            </div>
          </div>

          {/* Admission Type Filter */}
          <div className="col-6 col-md-3">
            <select
              className="form-select"
              value={admissionFilter}
              onChange={(e) => setAdmissionFilter(e.target.value)}
              style={{ borderColor: '#D6CEE2', fontSize: '0.9rem' }}
            >
              <option value="todos">Admisión: Todos</option>
              <option value="abierto">Ingreso Abierto</option>
              <option value="convocatoria">Con Convocatoria previa</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="col-6 col-md-4">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ borderColor: '#D6CEE2', fontSize: '0.9rem' }}
            >
              <option value="name-asc">Ordenar: Nombre A-Z</option>
              <option value="name-desc">Ordenar: Nombre Z-A</option>
              <option value="members-desc">Ordenar: Mayor número de miembros</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="d-flex flex-wrap align-items-center gap-1.5 pt-2 border-top">
          <span className="small text-muted me-2 d-none d-sm-inline">
            <FontAwesomeIcon icon={faSliders} className="me-1" />
            Categorías:
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

      {/* RESULTS HEADER */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="small text-muted">
          Mostrando <strong>{filteredClubs.length}</strong> {filteredClubs.length === 1 ? 'club oficial' : 'clubes oficiales'}
        </div>
        {(search || category !== 'Todas' || admissionFilter !== 'todos') && (
          <button
            type="button"
            className="btn btn-link btn-sm text-decoration-none p-0 d-flex align-items-center gap-1"
            style={{ color: '#6B2FA8', fontSize: '0.84rem' }}
            onClick={handleResetFilters}
          >
            <FontAwesomeIcon icon={faRotateRight} />
            <span>Limpiar filtros</span>
          </button>
        )}
      </div>

      {/* CLUBS GRID */}
      {filteredClubs.length === 0 ? (
        /* Empty State (Mockup 3.2_modal_sin_resultados.png) */
        <div
          className="card border rounded-4 p-5 text-center shadow-sm"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
        >
          <div
            className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 mx-auto"
            style={{ width: '64px', height: '64px', backgroundColor: '#F0E9F9', color: '#6B2FA8', fontSize: '1.8rem' }}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </div>
          <h5 className="fw-bold mb-2" style={{ color: '#1E1728' }}>
            No se encontraron clubes
          </h5>
          <p className="text-muted small mb-4 mx-auto" style={{ maxWidth: '420px' }}>
            No hay clubes que coincidan con los criterios de búsqueda seleccionados. Intenta cambiar los filtros o el texto.
          </p>
          <div>
            <button
              type="button"
              className="btn btn-primary rounded-pill px-4 btn-sm"
              style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
              onClick={handleResetFilters}
            >
              Restablecer filtros
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {filteredClubs.map((club) => {
            const userMem = getMembershipForClub(club.id);
            const isMember = userMem && userMem.status === 'activo';
            const isPending = userMem && userMem.status === 'pendiente';

            return (
              <div key={club.id} className="col-12 col-md-6 col-lg-4">
                <div
                  className="card h-100 border rounded-4 overflow-hidden shadow-sm d-flex flex-column hover-shadow transition"
                  style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
                >
                  {/* Banner header */}
                  <div
                    style={{
                      height: '84px',
                      background: 'linear-gradient(135deg, #6B2FA8 0%, #4F2280 100%)',
                      position: 'relative'
                    }}
                  >
                    <div className="position-absolute" style={{ bottom: '-22px', left: '20px' }}>
                      <ClubInitialsBadge initials={club.shortName} size={48} />
                    </div>
                  </div>

                  <div className="card-body pt-4 px-3 pb-3 d-flex flex-column flex-grow-1">
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

                    <p className="text-muted small flex-grow-1 mb-3" style={{ minHeight: '44px', lineHeight: 1.5 }}>
                      {club.description}
                    </p>

                    <div className="pt-2 border-top d-flex align-items-center justify-content-between">
                      <div>
                        {isMember ? (
                          <span className="badge bg-success-subtle text-success rounded-pill fw-semibold" style={{ fontSize: '0.72rem' }}>
                            <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
                            Miembro
                          </span>
                        ) : isPending ? (
                          <span className="badge bg-warning-subtle text-warning rounded-pill fw-semibold" style={{ fontSize: '0.72rem' }}>
                            Pendiente
                          </span>
                        ) : (
                          <span className="small fw-semibold" style={{ color: '#6B2FA8', fontSize: '0.78rem' }}>
                            {club.admissionType === 'abierto' ? 'Ingreso abierto' : 'Convocatoria'}
                          </span>
                        )}
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <Link
                          to={`/club/${club.id}`}
                          className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                          style={{ borderColor: '#E6E1EE', fontSize: '0.8rem', color: '#6E6580' }}
                        >
                          Ver ficha
                        </Link>
                        {!isMember && !isPending && club.admissionType !== 'cerrado' && (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm rounded-pill px-3"
                            style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8', fontSize: '0.8rem' }}
                            onClick={() => setSelectedClubForModal(club)}
                          >
                            <FontAwesomeIcon icon={faPaperPlane} className="me-1" />
                            {club.admissionType === 'abierto' ? 'Unirme' : 'Postular'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Admission Modal */}
      {selectedClubForModal && (
        <MembershipModal
          isOpen={!!selectedClubForModal}
          onClose={() => setSelectedClubForModal(null)}
          club={selectedClubForModal}
          onSuccess={() => setSelectedClubForModal(null)}
        />
      )}
    </div>
  );
};
