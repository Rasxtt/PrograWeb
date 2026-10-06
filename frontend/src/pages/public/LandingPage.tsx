import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { ClubCategory } from '../../types';
import {
  Search,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  Compass,
  Award,
  ChevronRight,
  MapPin,
  Clock
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const clubs = storageService.getClubs().filter(c => c.status === 'published');
  const activities = storageService.getActivities().filter(a => a.status === 'scheduled').slice(0, 3);

  const categories: { name: ClubCategory; icon: string; count: number; colorClass: string }[] = [
    { name: 'Tecnología', icon: '💻', count: clubs.filter(c => c.category === 'Tecnología').length, colorClass: 'badge-cat-tecnologia' },
    { name: 'Académico', icon: '📚', count: clubs.filter(c => c.category === 'Académico').length, colorClass: 'badge-cat-academico' },
    { name: 'Social', icon: '🤝', count: clubs.filter(c => c.category === 'Social').length, colorClass: 'badge-cat-social' },
    { name: 'Arte', icon: '🎭', count: clubs.filter(c => c.category === 'Arte').length, colorClass: 'badge-cat-arte' },
    { name: 'Deportes', icon: '⚽', count: clubs.filter(c => c.category === 'Deportes').length, colorClass: 'badge-cat-deportes' },
    { name: 'Cultura', icon: '🎨', count: clubs.filter(c => c.category === 'Cultura').length, colorClass: 'badge-cat-cultura' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/directorio?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/directorio');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* HERO SECTION */}
      <section style={{
        background: 'linear-gradient(135deg, #4F2280 0%, #6B2FA8 60%, #17A2A2 100%)',
        color: '#FFFFFF',
        paddingTop: '64px',
        paddingBottom: '80px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative circles */}
        <div style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-60px',
          left: '10%',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'rgba(23, 162, 162, 0.15)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '860px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.16)',
            padding: '6px 16px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '20px',
            backdropFilter: 'blur(8px)'
          }}>
            <Sparkles size={16} color="#FFD166" />
            <span>Convocatorias Abiertas • Período Académico 2026-2</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
            color: '#FFFFFF',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '20px',
            letterSpacing: '-0.5px'
          }}>
            Descubre tu pasión y potencia tu vida en el campus
          </h1>

          <p style={{
            fontSize: '1.12rem',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '36px',
            lineHeight: 1.6,
            maxWidth: '720px',
            marginInline: 'auto'
          }}>
            Únete a más de 25 agrupaciones y clubes estudiantiles reconocidos por la Universidad de Lima. Desarrolla proyectos reales, compite y forja amistades para toda la vida.
          </p>

          {/* Quick Search Box */}
          <form onSubmit={handleSearchSubmit} style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-pill)',
            padding: '6px 8px 6px 20px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 12px 36px rgba(30, 23, 40, 0.25)',
            maxWidth: '620px',
            marginInline: 'auto',
            gap: '12px'
          }}>
            <Search size={20} color="var(--color-text-muted)" />
            <input
              type="text"
              placeholder="Buscar clubes por nombre, tecnología, debate, deporte..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                padding: '10px 0',
                fontSize: '0.96rem',
                outline: 'none',
                color: 'var(--color-text)',
                backgroundColor: 'transparent'
              }}
            />
            <button type="submit" className="btn btn-primary" style={{ borderRadius: 'var(--radius-pill)', padding: '12px 24px' }}>
              Explorar
            </button>
          </form>
        </div>
      </section>

      {/* STATS STRIP */}
      <section style={{
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: '24px 0'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-headings)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              +{clubs.length}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Clubes Estudiantiles Oficiales
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-headings)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-accent)' }}>
              +1,400
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Estudiantes Activos en el Campus
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-headings)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
              +85
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Actividades y Talleres al Semestre
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-headings)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-success)' }}>
              100%
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Reconocimiento Bienestar Ulima
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES PILLS */}
      <section style={{ padding: '60px 0 40px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-text)' }}>
                Explora por Categorías
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                Encuentra la agrupación adecuada según tus intereses personales y profesionales.
              </p>
            </div>
            <Link to="/directorio" className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
              <span>Ver todas</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px'
          }}>
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                to={`/directorio?cat=${encodeURIComponent(cat.name)}`}
                className="card card-hover"
                style={{
                  padding: '20px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '2rem' }}>{cat.icon}</span>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text)' }}>
                  {cat.name}
                </span>
                <span className={`badge ${cat.colorClass}`}>
                  {cat.count} {cat.count === 1 ? 'club' : 'clubes'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED CLUBS */}
      <section style={{ padding: '30px 0 60px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-text)' }}>
                Clubes Destacados del Semestre
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                Agrupaciones con convocatorias abiertas y proyectos de alto impacto.
              </p>
            </div>
            <Link to="/directorio" className="btn btn-outline btn-sm">
              Ver directorio completo
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {clubs.slice(0, 3).map(club => (
              <div key={club.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
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
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)'
                  }} />
                  <span
                    className={`badge badge-cat-${club.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}
                    style={{ position: 'absolute', top: '12px', right: '12px', fontWeight: 700 }}
                  >
                    {club.category}
                  </span>
                </div>

                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '-36px', marginBottom: '12px' }}>
                    <img
                      src={club.logoUrl}
                      alt={club.name}
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: 'var(--radius-md)',
                        border: '3px solid #fff',
                        boxShadow: 'var(--shadow-sm)',
                        objectFit: 'cover'
                      }}
                    />
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>
                        {club.name}
                      </h3>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={13} /> {club.memberCount} integrantes activos
                      </span>
                    </div>
                  </div>

                  <p style={{
                    fontSize: '0.88rem',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.5,
                    marginBottom: '18px',
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {club.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--color-border-subtle)',
                    paddingTop: '14px'
                  }}>
                    <span className="badge badge-success">
                      {club.admissionType === 'open' ? 'Ingreso Libre' : 'Convocatoria Abierta'}
                    </span>
                    <Link to={`/clubes/${club.id}`} className="btn btn-primary btn-sm">
                      Ver club
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UPCOMING ACTIVITIES BILLBOARD PREVIEW */}
      <section style={{ backgroundColor: 'var(--color-surface-subtle)', padding: '60px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-text)' }}>
                Próximas Actividades en Cartelera
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                Talleres, hackathons, conferencias y torneos abiertos a todos los alumnos.
              </p>
            </div>
            <Link to="/cartelera" className="btn btn-secondary btn-sm">
              Ver cartelera completa
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {activities.map(act => {
              const club = storageService.getClubById(act.clubId);
              const spotsLeft = act.capacity - act.enrolledCount;
              return (
                <div key={act.id} className="card card-hover" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span className={`badge badge-cat-${act.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}>
                      {act.category}
                    </span>
                    <span className={`badge ${spotsLeft <= 0 ? 'badge-warning' : 'badge-accent'}`}>
                      {spotsLeft <= 0 ? 'Lista de espera' : `${spotsLeft} cupos libres`}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px', lineHeight: 1.3 }}>
                    {act.title}
                  </h3>

                  <div style={{ fontSize: '0.82rem', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '14px' }}>
                    Organiza: {club?.name || 'Club Ulima'}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: 'var(--color-text-muted)', marginBottom: '18px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={15} color="var(--color-primary)" />
                      <span>{act.date} • {act.startTime} - {act.endTime} hrs</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={15} color="var(--color-primary)" />
                      <span>{act.location} ({act.modality})</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '14px' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                      Capacidad: {act.capacity}
                    </span>
                    <Link to={`/actividades/${act.id}`} className="btn btn-primary btn-sm">
                      Detalles e Inscripción
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA BANNER: REGISTRAR UN CLUB */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, #1E1728 0%, #35264B 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '48px 40px',
            color: '#FFFFFF',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '30px'
          }}>
            <div style={{ maxWidth: '600px' }}>
              <span className="badge badge-primary" style={{ marginBottom: '12px', backgroundColor: 'rgba(107, 47, 168, 0.4)', color: '#D8B8FF' }}>
                ¿Tienes una iniciativa extracurricular?
              </span>
              <h2 style={{ fontSize: '1.9rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '12px' }}>
                Funda tu propio Club Estudiantil en la Ulima
              </h2>
              <p style={{ color: '#D3C9DF', fontSize: '0.95rem', lineHeight: 1.6 }}>
                La Dirección de Bienestar Estudiantil brinda asesoría estatutaria, espacios físicos en campus y financiamiento para actividades oficiales.
              </p>
            </div>
            <Link to="/registro-club" className="btn btn-accent btn-lg" style={{ borderRadius: 'var(--radius-md)' }}>
              Iniciar Solicitud de Registro
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
