import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Club, ClubCategory } from '../../types';
import {
  Search,
  Filter,
  Users,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { MembershipModal } from '../../components/clubs/MembershipModal';

export const ClubDirectoryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const queryParam = searchParams.get('q') || '';
  const categoryParam = (searchParams.get('cat') as ClubCategory) || 'Todas';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [admissionFilter, setAdmissionFilter] = useState<'all' | 'open' | 'application'>('all');
  const [selectedDay, setSelectedDay] = useState<string>('all');

  // Modal de postulación
  const [selectedClubForModal, setSelectedClubForModal] = useState<Club | null>(null);

  const allClubs = storageService.getClubs().filter(c => c.status === 'published');
  const userMemberships = currentUser ? storageService.getMembershipsByUserId(currentUser.id) : [];

  const categories = ['Todas', 'Tecnología', 'Académico', 'Social', 'Arte', 'Deportes', 'Cultura'];
  const weekDays = ['all', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábados'];

  const filteredClubs = useMemo(() => {
    return allClubs.filter(club => {
      // Búsqueda por texto
      const matchesSearch =
        searchQuery === '' ||
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Categoría
      const matchesCategory =
        selectedCategory === 'Todas' || club.category === selectedCategory;

      // Modalidad de ingreso
      const matchesAdmission =
        admissionFilter === 'all' ||
        (admissionFilter === 'open' && club.admissionType === 'open') ||
        (admissionFilter === 'application' && club.admissionType !== 'open');

      // Día de reunión
      const matchesDay =
        selectedDay === 'all' || club.meetingDays.includes(selectedDay);

      return matchesSearch && matchesCategory && matchesAdmission && matchesDay;
    });
  }, [allClubs, searchQuery, selectedCategory, admissionFilter, selectedDay]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Todas');
    setAdmissionFilter('all');
    setSelectedDay('all');
    setSearchParams({});
  };

  const getMembershipStatusForClub = (clubId: string) => {
    const mem = userMemberships.find(m => m.clubId === clubId);
    return mem ? mem.status : null;
  };

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800 }}>Directorio de Clubes Estudiantiles</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
          Explora agrupaciones oficiales, proyectos en curso y encuentra el club afín a tus intereses
        </p>
      </div>

      {/* Filter and Search Bar Container */}
      <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
        {/* Search input */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Buscar por nombre, palabra clave o lema del club..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <select
              value={admissionFilter}
              onChange={e => setAdmissionFilter(e.target.value as any)}
              style={{ width: 'auto', minWidth: '170px' }}
            >
              <option value="all">Todas las convocatorias</option>
              <option value="open">Ingreso Libre</option>
              <option value="application">Por Postulación</option>
            </select>

            <select
              value={selectedDay}
              onChange={e => setSelectedDay(e.target.value)}
              style={{ width: 'auto', minWidth: '150px' }}
            >
              <option value="all">Cualquier día</option>
              <option value="Lunes">Reuniones: Lunes</option>
              <option value="Martes">Reuniones: Martes</option>
              <option value="Miércoles">Reuniones: Miércoles</option>
              <option value="Jueves">Reuniones: Jueves</option>
              <option value="Viernes">Reuniones: Viernes</option>
              <option value="Sábados">Reuniones: Sábados</option>
            </select>

            {(searchQuery || selectedCategory !== 'Todas' || admissionFilter !== 'all' || selectedDay !== 'all') && (
              <button
                onClick={handleClearFilters}
                className="btn btn-outline"
                style={{ fontSize: '0.85rem', padding: '8px 14px' }}
              >
                <RotateCcw size={14} />
                <span>Limpiar filtros</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Bar */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map((cat, idx) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '7px 18px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--color-surface-hover)',
                  color: isSelected ? '#FFFFFF' : 'var(--color-text)',
                  border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  transition: 'var(--transition)'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)' }}>
          Mostrando <strong>{filteredClubs.length}</strong> {filteredClubs.length === 1 ? 'club registrado' : 'clubes registrados'}
        </div>
      </div>

      {/* Grid of Clubs */}
      {filteredClubs.length === 0 ? (
        <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔍</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
            No se encontraron clubes con los filtros aplicados
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
            Intenta modificando tu término de búsqueda o restableciendo los filtros de categoría y días.
          </p>
          <button onClick={handleClearFilters} className="btn btn-primary btn-sm">
            Restablecer todos los filtros
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px'
        }}>
          {filteredClubs.map(club => {
            const status = getMembershipStatusForClub(club.id);

            return (
              <div key={club.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Banner with Category Badge */}
                <div style={{
                  height: '140px',
                  backgroundImage: `url(${club.bannerUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)'
                  }} />
                  <span
                    className={`badge badge-cat-${club.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}
                    style={{ position: 'absolute', top: '12px', right: '12px', fontWeight: 700 }}
                  >
                    {club.category}
                  </span>
                </div>

                {/* Content */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Logo & Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '-36px', marginBottom: '12px' }}>
                    <img
                      src={club.logoUrl}
                      alt={club.name}
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: 'var(--radius-md)',
                        border: '3px solid #fff',
                        boxShadow: 'var(--shadow-sm)',
                        objectFit: 'cover'
                      }}
                    />
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text)' }}>
                        {club.name}
                      </h3>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={13} /> {club.memberCount} integrantes activos
                      </span>
                    </div>
                  </div>

                  {/* Tagline */}
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--color-primary)',
                    marginBottom: '10px'
                  }}>
                    "{club.tagline}"
                  </div>

                  {/* Description */}
                  <p style={{
                    fontSize: '0.86rem',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.5,
                    marginBottom: '16px',
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {club.description}
                  </p>

                  {/* Meeting schedule tag */}
                  <div style={{
                    backgroundColor: 'var(--color-surface-subtle)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    color: 'var(--color-text)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '18px'
                  }}>
                    <Clock size={14} color="var(--color-primary)" />
                    <span>Reuniones: {club.meetingDays.join(', ')} ({club.meetingTime})</span>
                  </div>

                  {/* Action Bar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--color-border-subtle)',
                    paddingTop: '14px',
                    gap: '10px'
                  }}>
                    <Link to={`/clubes/${club.id}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                      Ver ficha
                    </Link>

                    {status === 'accepted' ? (
                      <span className="badge badge-success" style={{ padding: '8px 12px' }}>
                        ✓ Eres Miembro
                      </span>
                    ) : status === 'pending' ? (
                      <span className="badge badge-warning" style={{ padding: '8px 12px' }}>
                        ⏳ Postulación en revisión
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedClubForModal(club)}
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1 }}
                      >
                        {club.admissionType === 'open' ? 'Unirme al club' : 'Postular'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de postulación */}
      {selectedClubForModal && (
        <MembershipModal
          club={selectedClubForModal}
          onClose={() => setSelectedClubForModal(null)}
          onSuccess={() => {
            setSelectedClubForModal(null);
            showToast('¡Tu solicitud ha sido procesada exitosamente!', 'success');
          }}
        />
      )}
    </div>
  );
};
