import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faHouse, faRightToBracket } from '@fortawesome/free-solid-svg-icons';

export const ForbiddenPage = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center py-5 px-3 flex-grow-1"
      style={{ backgroundColor: '#FBFAFD' }}
    >
      <div
        className="card border shadow-sm rounded-4 p-4 p-sm-5 text-center w-100"
        style={{ maxWidth: '520px', backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
      >
        <div
          className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
          style={{ width: '72px', height: '72px', backgroundColor: '#FEF2F2', color: '#B91C1C', fontSize: '2.5rem' }}
        >
          <FontAwesomeIcon icon={faBan} />
        </div>
        <h2 className="fw-bold mb-2" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
          403 - Acceso Denegado
        </h2>
        <p className="text-muted small mb-4 px-2" style={{ lineHeight: 1.6 }}>
          No cuentas con los permisos necesarios para visualizar o gestionar este módulo. Si eres miembro de la directiva de un club o requieres autorización institucional, ponte en contacto con la Dirección de Bienestar Estudiantil.
        </p>
        <div className="d-flex flex-wrap align-items-center justify-content-center gap-2">
          <Link
            to="/"
            className="btn btn-outline-secondary rounded-pill px-4 btn-sm d-flex align-items-center gap-2"
          >
            <FontAwesomeIcon icon={faHouse} />
            <span>Ir al Inicio</span>
          </Link>
          <Link
            to="/login"
            className="btn btn-primary rounded-pill px-4 btn-sm d-flex align-items-center gap-2"
            style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
          >
            <FontAwesomeIcon icon={faRightToBracket} />
            <span>Iniciar Sesión</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
