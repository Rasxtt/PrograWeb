import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: '#1E1728',
      color: '#FFFFFF',
      paddingTop: '48px',
      paddingBottom: '32px',
      marginTop: 'auto',
      borderTop: '1px solid #2E243D'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '36px',
          marginBottom: '36px'
        }}>
          {/* Columna 1: Identidad Institucional */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                backgroundColor: 'var(--color-primary)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#fff',
                fontSize: '0.95rem'
              }}>
                VU
              </div>
              <span style={{ fontFamily: 'var(--font-headings)', fontWeight: 700, fontSize: '1.1rem' }}>
                Vida Universitaria
              </span>
            </div>
            <p style={{ color: '#A99DBE', fontSize: '0.86rem', lineHeight: 1.6, marginBottom: '12px' }}>
              Plataforma oficial de clubes, actividades y vida estudiantil de la Universidad de Lima.
            </p>
            <div style={{ color: '#887B9E', fontSize: '0.8rem' }}>
              Dirección de Bienestar Estudiantil
            </div>
          </div>

          {/* Columna 2: Navegación Rápida */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', marginBottom: '16px', fontWeight: 600 }}>
              Explorar Plataforma
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
              <li>
                <Link to="/directorio" style={{ color: '#A99DBE', transition: 'var(--transition)' }}>
                  Directorio de Clubes
                </Link>
              </li>
              <li>
                <Link to="/cartelera" style={{ color: '#A99DBE', transition: 'var(--transition)' }}>
                  Cartelera de Actividades
                </Link>
              </li>
              <li>
                <Link to="/registro-club" style={{ color: '#A99DBE', transition: 'var(--transition)' }}>
                  Registrar una Agrupación
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ color: '#A99DBE', transition: 'var(--transition)' }}>
                  Acceso para Estudiantes
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Información de Campus */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', marginBottom: '16px', fontWeight: 600 }}>
              Campus Monterrico
            </h4>
            <p style={{ color: '#A99DBE', fontSize: '0.86rem', lineHeight: 1.6, marginBottom: '8px' }}>
              Av. Javier Prado Este 4600, Santiago de Surco<br />
              Lima 15023, Perú
            </p>
            <p style={{ color: '#A99DBE', fontSize: '0.86rem' }}>
              Contacto: <span style={{ color: 'var(--color-accent)' }}>bienestar@ulima.edu.pe</span>
            </p>
          </div>

          {/* Columna 4: Normativa y Soporte */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', marginBottom: '16px', fontWeight: 600 }}>
              Normativa Institucional
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
              <li>
                <a href="#reglamento" style={{ color: '#A99DBE' }}>
                  Reglamento de Agrupaciones Estudiantiles
                </a>
              </li>
              <li>
                <a href="#codigo-etica" style={{ color: '#A99DBE' }}>
                  Código de Ética y Convivencia
                </a>
              </li>
              <li>
                <a href="#mesa-ayuda" style={{ color: '#A99DBE' }}>
                  Mesa de Ayuda Tecnológica
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra inferior */}
        <div style={{
          borderTop: '1px solid #2E243D',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          fontSize: '0.8rem',
          color: '#887B9E'
        }}>
          <div>
            © 2026 Universidad de Lima. Todos los derechos reservados.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Términos de Uso</span>
            <span>Política de Privacidad</span>
            <span>Portal Ulima</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
