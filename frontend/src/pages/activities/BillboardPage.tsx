import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { Activity, ClubCategory, ActivityModality } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Filter,
  Users,
  Sparkles,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

export const BillboardPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('cat') || 'Todas');
  const [selectedModality, setSelectedModality] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'upcoming'>('all');

  const allActivities = storageService.getActivities().filter(a => a.status === 'scheduled');
  const categories = ['Todas', 'Tecnología', 'Académico', 'Social', 'Arte', 'Deportes', 'Cultura'];

  const filteredActivities = useMemo(() => {
    return allActivities.filter(act => {
      const club = storageService.getClubById(act.clubId);

      const matchesSearch =
        searchQuery === '' ||
        act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (club && club.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'Todas' || act.category === selectedCategory;

      const matchesModality =
        selectedModality === 'all' || act.modality === selectedModality;

      return matchesSearch && matchesCategory && matchesModality;
    });
  }, [allActivities, searchQuery, selectedCategory, selectedModality]);

  const handleClear = () => {
    setSearchQuery('');
    setSelectedCategory('Todas');
    setSelectedModality('all');
    setDateFilter('all');
    setSearchParams({});
  };

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      {/* Title Banner */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800 }}>Cartelera General de Actividades</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
          Talleres, torneos, conferencias y hackathons organizados por los clubes Ulima
        </p>
      </div>

      {/* Filter Card */}
      <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Buscar por título de actividad o club organizador..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <select
              value={selectedModality}
              onChange={e => setSelectedModality(e.target.value)}
              style={{ width: 'auto', minWidth: '160px' }}
            >
              <option value="all">Todas las modalidades</option>
              <option value="Presencial">Presencial en Campus</option>
              <option value="Virtual">Virtual Teams / Zoom</option>
              <option value="Híbrida">Híbrida</option>
            </select>

            {(searchQuery || selectedCategory !== 'Todas' || selectedModality !== 'all') && (
              <button onClick={handleClear} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
                <RotateCcw size={14} />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
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

      {/* Activities Grid */}
      {filteredActivities.length === 0 ? (
        <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📅</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
            No hay actividades programadas con esos filtros
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '18px' }}>
            Prueba seleccionando otra categoría o limpiando la barra de búsqueda.
          </p>
          <button onClick={handleClear} className="btn btn-primary btn-sm">
            Ver todas las actividades
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px'
        }}>
          {filteredActivities.map(act => {
            const club = storageService.getClubById(act.clubId);
            const spotsRemaining = act.capacity - act.enrolledCount;
            const isFull = spotsRemaining <= 0;

            return (
              <div key={act.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Header tags */}
                <div style={{ padding: '20px 20px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className={`badge badge-cat-${act.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}>
                      {act.category}
                    </span>
                    <span className={`badge ${isFull ? 'badge-warning' : 'badge-success'}`}>
                      {isFull ? 'Lista de espera' : `${spotsRemaining} cupos libres`}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '8px' }}>
                    {act.title}
                  </h3>

                  <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '14px' }}>
                    Organiza: <Link to={`/clubes/${act.clubId}`} style={{ textDecoration: 'underline' }}>{club?.name || 'Club Ulima'}</Link>
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding: '0 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <p style={{
                    fontSize: '0.88rem',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.5,
                    marginBottom: '18px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {act.description}
                  </p>

                  <div style={{
                    backgroundColor: 'var(--color-surface-subtle)',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    fontSize: '0.82rem',
                    color: 'var(--color-text)',
                    marginBottom: '20px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={15} color="var(--color-primary)" />
                      <span>{act.date} • {act.startTime} - {act.endTime} hrs</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={15} color="var(--color-primary)" />
                      <span>{act.location} ({act.modality})</span>
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div style={{
                  padding: '14px 20px',
                  borderTop: '1px solid var(--color-border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    Aforo: {act.capacity} personas
                  </span>
                  <Link to={`/actividades/${act.id}`} className="btn btn-primary btn-sm">
                    {isFull ? 'Unirme a lista' : 'Inscribirme'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
