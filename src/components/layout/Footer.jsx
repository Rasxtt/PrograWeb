import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#1E1728',
        color: '#FFFFFF',
        borderTop: '1px solid #2F243F',
        marginTop: 'auto'
      }}
      className="py-5"
    >
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand Info */}
          <div className="col-12 col-md-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="d-flex align-items-center justify-content-center text-white rounded-3"
                style={{
                  width: '38px',
                  height: '38px',
                  backgroundColor: '#6B2FA8',
                  fontSize: '1.1rem'
                }}
              >
                <FontAwesomeIcon icon={faGraduationCap} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: '1.15rem',
                    color: '#FFFFFF'
                  }}
                >
                  Vida Universitaria
                </div>
                <div style={{ fontSize: '0.72rem', color: '#17A2A2', fontWeight: 600 }}>
                  UNIVERSIDAD DE LIMA
                </div>
              </div>
            </div>
            <p className="small mb-3" style={{ color: '#A99DBE', lineHeight: 1.6 }}>
              Plataforma oficial para la integración, gestión y difusión de clubes y actividades estudiantiles. Conéctate con tus pasiones y enriquece tu experiencia universitaria.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="col-6 col-md-2 offset-md-1">
            <h6 className="fw-bold mb-3" style={{ color: '#FFFFFF', fontSize: '0.9rem' }}>
              Navegación
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <Link to="/directorio" className="text-decoration-none" style={{ color: '#A99DBE' }}>
                  Directorio de Clubes
                </Link>
              </li>
              <li>
                <Link to="/cartelera" className="text-decoration-none" style={{ color: '#A99DBE' }}>
                  Cartelera de Actividades
                </Link>
              </li>
              <li>
                <Link to="/registrar-club" className="text-decoration-none" style={{ color: '#A99DBE' }}>
                  Registrar mi Club
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-decoration-none" style={{ color: '#A99DBE' }}>
                  Iniciar Sesión
                </Link>
              </li>
            </ul>
          </div>

          {/* Institutional Links */}
          <div className="col-6 col-md-2">
            <h6 className="fw-bold mb-3" style={{ color: '#FFFFFF', fontSize: '0.9rem' }}>
              Institucional
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <span style={{ color: '#A99DBE' }}>Bienestar Estudiantil</span>
              </li>
              <li>
                <span style={{ color: '#A99DBE' }}>Reglamento de Clubes</span>
              </li>
              <li>
                <span style={{ color: '#A99DBE' }}>Campus Monterrico</span>
              </li>
              <li>
                <span style={{ color: '#A99DBE' }}>Mesa de Ayuda</span>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="col-12 col-md-3">
            <h6 className="fw-bold mb-3" style={{ color: '#FFFFFF', fontSize: '0.9rem' }}>
              Contacto
            </h6>
            <p className="small mb-2" style={{ color: '#A99DBE' }}>
              Av. Javier Prado Este 4600, Santiago de Surco, Lima - Perú
            </p>
            <p className="small mb-1" style={{ color: '#A99DBE' }}>
              Correo: <a href="mailto:vidauniversitaria@ulima.edu.pe" style={{ color: '#17A2A2' }}>vidauniversitaria@ulima.edu.pe</a>
            </p>
            <p className="small" style={{ color: '#A99DBE' }}>
              Teléfono: (511) 437-6767 anexo 31400
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div
          className="pt-3 border-top d-flex flex-wrap align-items-center justify-content-between gap-2"
          style={{ borderColor: '#2F243F' }}
        >
          <div className="small" style={{ color: '#7E6F94', fontSize: '0.78rem' }}>
            © 2026 Universidad de Lima. Todos los derechos reservados. Tema 9: Vida Universitaria.
          </div>
          <div className="d-flex align-items-center gap-3 small" style={{ color: '#7E6F94', fontSize: '0.78rem' }}>
            <span>Términos de Servicio</span>
            <span>•</span>
            <span>Privacidad</span>
            <span>•</span>
            <span>Seguridad</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
