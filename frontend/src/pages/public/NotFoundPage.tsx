import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="container" style={{
      padding: '80px 20px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-primary-soft)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-primary)',
        marginBottom: '20px'
      }}>
        <Compass size={42} />
      </div>

      <div style={{
        fontFamily: 'var(--font-headings)',
        fontSize: '4.5rem',
        fontWeight: 800,
        color: 'var(--color-primary)',
        lineHeight: 1
      }}>
        404
      </div>

      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '8px', marginBottom: '12px' }}>
        Página o Recurso No Encontrado
      </h1>

      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.98rem', maxWidth: '480px', marginBottom: '28px', lineHeight: 1.6 }}>
        La ruta solicitada no existe o el club/actividad que estás buscando ha sido reubicado o cancelado.
      </p>

      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary" style={{ gap: '8px' }}>
          <Home size={16} />
          <span>Volver al Inicio</span>
        </Link>
        <Link to="/directorio" className="btn btn-secondary" style={{ gap: '8px' }}>
          <Search size={16} />
          <span>Explorar Directorio de Clubes</span>
        </Link>
      </div>
    </div>
  );
};
