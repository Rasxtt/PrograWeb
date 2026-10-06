import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { Users, Clock, ArrowRight, CheckCircle2, AlertCircle, Compass } from 'lucide-react';

export const MyClubsPage: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <p>Inicia sesión para ver tus clubes y postulaciones.</p>
        <Link to="/login" className="btn btn-primary" style={{ marginTop: '14px' }}>
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  const allMemberships = storageService.getMembershipsByUserId(currentUser.id);
  const activeMemberships = allMemberships.filter(m => m.status === 'accepted');
  const pendingMemberships = allMemberships.filter(m => m.status === 'pending');
  const rejectedMemberships = allMemberships.filter(m => m.status === 'rejected');

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Mis Clubes y Postulaciones</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
            Agrupaciones a las que perteneces y estado de tus convocatorias activas
          </p>
        </div>
        <Link to="/directorio" className="btn btn-secondary">
          <Compass size={16} />
          <span>Explorar más clubes</span>
        </Link>
      </div>

      {/* ACTIVE CLUBS SECTION */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Clubes Activos</span>
          <span className="badge badge-success">{activeMemberships.length}</span>
        </h2>

        {activeMemberships.length === 0 ? (
          <div className="card" style={{ padding: '36px', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '14px' }}>
              Aún no perteneces a ningún club activo. ¡Explora el directorio e inscríbete en tus disciplinas favoritas!
            </p>
            <Link to="/directorio" className="btn btn-primary btn-sm">
              Ir al Directorio de Clubes
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {activeMemberships.map(mem => {
              const club = storageService.getClubById(mem.clubId);
              if (!club) return null;
              return (
                <div key={mem.id} className="card card-hover" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                    <img
                      src={club.logoUrl}
                      alt={club.name}
                      style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                    />
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{club.name}</h3>
                      <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                        {mem.roleInClub}
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '16px', flex: 1 }}>
                    "{club.tagline}"
                  </p>

                  <div style={{
                    backgroundColor: 'var(--color-surface-subtle)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.78rem',
                    color: 'var(--color-text)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '16px'
                  }}>
                    <Clock size={13} color="var(--color-primary)" />
                    <span>Reuniones: {club.meetingDays.join(', ')} ({club.meetingTime})</span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Link to={`/clubes/${club.id}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                      Ver Ficha
                    </Link>
                    <Link to={`/clubes/${club.id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                      Ir al Tablón
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PENDING APPLICATIONS SECTION */}
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Postulaciones en Revisión</span>
          <span className="badge badge-warning">{pendingMemberships.length}</span>
        </h2>

        {pendingMemberships.length === 0 ? (
          <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>
            No tienes convocatorias ni postulaciones pendientes en este momento.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {pendingMemberships.map(mem => {
              const club = storageService.getClubById(mem.clubId);
              if (!club) return null;
              return (
                <div key={mem.id} className="card" style={{ padding: '20px', borderLeft: '4px solid var(--color-warning)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                    <img
                      src={club.logoUrl}
                      alt={club.name}
                      style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                    />
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{club.name}</h3>
                      <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>
                        ⏳ En evaluación por el comité
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '14px' }}>
                    Fecha de envío: {new Date(mem.appliedAt).toLocaleDateString()}
                  </div>

                  {mem.answers && (
                    <div style={{
                      backgroundColor: 'var(--color-surface-subtle)',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      marginBottom: '14px'
                    }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '4px' }}>Tus respuestas enviadas:</div>
                      {Object.entries(mem.answers).map(([q, a], idx) => (
                        <div key={idx} style={{ marginBottom: '4px' }}>
                          <span style={{ color: 'var(--color-text-muted)' }}>• {q}:</span> <em>"{a}"</em>
                        </div>
                      ))}
                    </div>
                  )}

                  <Link to={`/clubes/${club.id}`} className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                    Ver ficha del club
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
