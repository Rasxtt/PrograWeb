import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX, Home, ArrowLeft } from 'lucide-react';

export const ForbiddenPage: React.FC = () => {
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
        backgroundColor: 'var(--color-danger-soft)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-danger)',
        marginBottom: '20px'
      }}>
        <ShieldX size={42} />
      </div>

      <div style={{
        fontFamily: 'var(--font-headings)',
        fontSize: '4.5rem',
        fontWeight: 800,
        color: 'var(--color-danger)',
        lineHeight: 1
      }}>
        403
      </div>

      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '8px', marginBottom: '12px' }}>
        Acceso Restringido o Denegado
      </h1>

      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.98rem', maxWidth: '500px', marginBottom: '28px', lineHeight: 1.6 }}>
        No cuentas con los permisos o rol requerido para acceder a este panel de administración o sección privada del club.
      </p>

      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary" style={{ gap: '8px' }}>
          <Home size={16} />
          <span>Ir a Inicio</span>
        </Link>
        <Link to="/directorio" className="btn btn-secondary" style={{ gap: '8px' }}>
          <ArrowLeft size={16} />
          <span>Regresar a Directorio</span>
        </Link>
      </div>
    </div>
  );
};
