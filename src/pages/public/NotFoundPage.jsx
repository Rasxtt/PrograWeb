import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompass, faHouse } from '@fortawesome/free-solid-svg-icons';

export const NotFoundPage = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center py-5 px-3 flex-grow-1"
      style={{ backgroundColor: '#FBFAFD' }}
    >
      <div
        className="card border shadow-sm rounded-4 p-4 p-sm-5 text-center w-100"
        style={{ maxWidth: '500px', backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
      >
        <div
          className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
          style={{ width: '72px', height: '72px', backgroundColor: '#F0E9F9', color: '#6B2FA8', fontSize: '2.5rem' }}
        >
          <FontAwesomeIcon icon={faCompass} />
        </div>
        <h2 className="fw-bold mb-2" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
          404 - Página No Encontrada
        </h2>
        <p className="text-muted small mb-4 px-2" style={{ lineHeight: 1.6 }}>
          La página o recurso que estás buscando no se encuentra disponible o ha cambiado de dirección.
        </p>
        <div>
          <Link
            to="/"
            className="btn btn-primary rounded-pill px-4 btn-sm d-inline-flex align-items-center gap-2"
            style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
          >
            <FontAwesomeIcon icon={faHouse} />
            <span>Volver al Inicio</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
