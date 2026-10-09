import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { storageService } from '../../services/storageService.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserGraduate,
  faUserShield,
  faUserGear,
  faEye,
  faRotateRight,
  faChevronUp,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';

export const RoleSwitcher = () => {
  const { activeRole, switchRole, currentUser, refreshUsers } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleResetData = () => {
    if (window.confirm('¿Reiniciar todos los datos a los valores iniciales del Seed?')) {
      storageService.resetToSeed();
      refreshUsers();
      window.location.reload();
    }
  };

  return (
    <div
      className="position-fixed bottom-0 end-0 m-3 shadow-lg"
      style={{
        zIndex: 1060,
        borderRadius: '16px',
        backgroundColor: '#1E1728',
        color: '#FFFFFF',
        border: '1px solid #3D2D52',
        maxWidth: '320px'
      }}
    >
      {/* Header bar of switcher */}
      <div
        className="d-flex align-items-center justify-content-between px-3 py-2 cursor-pointer"
        style={{ cursor: 'pointer', borderBottom: isExpanded ? '1px solid #3D2D52' : 'none' }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="d-flex align-items-center gap-2">
          <span
            className="badge rounded-pill"
            style={{
              backgroundColor:
                activeRole === 'admin' ? '#17A2A2' :
                activeRole === 'directive' ? '#C2681C' :
                activeRole === 'student' ? '#6B2FA8' : '#6E6580'
            }}
          >
            {activeRole === 'admin' ? 'Admin' :
             activeRole === 'directive' ? 'Directiva' :
             activeRole === 'student' ? 'Estudiante' : 'Visitante'}
          </span>
          <span className="small text-truncate" style={{ maxWidth: '140px', color: '#E6E1EE' }}>
            {currentUser ? currentUser.fullName : 'Sin sesión'}
          </span>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-link text-white p-0"
          style={{ textDecoration: 'none' }}
        >
          <FontAwesomeIcon icon={isExpanded ? faChevronDown : faChevronUp} />
        </button>
      </div>

      {/* Expanded body */}
      {isExpanded && (
        <div className="p-3">
          <p className="small text-muted mb-2" style={{ color: '#A99DBE' }}>
            Selecciona un rol para probar las 7 Historias de Usuario:
          </p>
          <div className="d-grid gap-2 mb-3">
            <button
              type="button"
              className={`btn btn-sm text-start d-flex align-items-center gap-2 ${
                activeRole === 'visitor' ? 'btn-primary' : 'btn-outline-light'
              }`}
              style={{
                backgroundColor: activeRole === 'visitor' ? '#6B2FA8' : 'transparent',
                borderColor: '#3D2D52'
              }}
              onClick={() => {
                switchRole('visitor');
                setIsExpanded(false);
                window.location.href = '/';
              }}
            >
              <FontAwesomeIcon icon={faEye} />
              <div>
                <div className="fw-bold">Visitante (Público)</div>
                <div className="small opacity-75">Landing, Directorio, Login, Registro</div>
              </div>
            </button>

            <button
              type="button"
              className={`btn btn-sm text-start d-flex align-items-center gap-2 ${
                activeRole === 'student' ? 'btn-primary' : 'btn-outline-light'
              }`}
              style={{
                backgroundColor: activeRole === 'student' ? '#6B2FA8' : 'transparent',
                borderColor: '#3D2D52'
              }}
              onClick={() => {
                switchRole('student');
                setIsExpanded(false);
                window.location.href = '/mis-clubes';
              }}
            >
              <FontAwesomeIcon icon={faUserGraduate} />
              <div>
                <div className="fw-bold">Estudiante: Camila Quispe</div>
                <div className="small opacity-75">Mis Clubes, Inscripciones, Tablón</div>
              </div>
            </button>

            <button
              type="button"
              className={`btn btn-sm text-start d-flex align-items-center gap-2 ${
                activeRole === 'directive' ? 'btn-primary' : 'btn-outline-light'
              }`}
              style={{
                backgroundColor: activeRole === 'directive' ? '#6B2FA8' : 'transparent',
                borderColor: '#3D2D52'
              }}
              onClick={() => {
                switchRole('directive');
                setIsExpanded(false);
                window.location.href = '/mis-clubes-directiva';
              }}
            >
              <FontAwesomeIcon icon={faUserShield} />
              <div>
                <div className="fw-bold">Directiva: Sofía Vega</div>
                <div className="small opacity-75">Club Robótica, Solicitudes, Actividades</div>
              </div>
            </button>

            <button
              type="button"
              className={`btn btn-sm text-start d-flex align-items-center gap-2 ${
                activeRole === 'admin' ? 'btn-primary' : 'btn-outline-light'
              }`}
              style={{
                backgroundColor: activeRole === 'admin' ? '#17A2A2' : 'transparent',
                borderColor: '#3D2D52'
              }}
              onClick={() => {
                switchRole('admin');
                setIsExpanded(false);
                window.location.href = '/admin/tablero';
              }}
            >
              <FontAwesomeIcon icon={faUserGear} />
              <div>
                <div className="fw-bold">Admin: Bienestar Estudiantil</div>
                <div className="small opacity-75">Métricas, Clubes, Usuarios, Moderación</div>
              </div>
            </button>
          </div>

          <div className="pt-2 border-top" style={{ borderColor: '#3D2D52' }}>
            <button
              type="button"
              className="btn btn-outline-warning btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
              onClick={handleResetData}
            >
              <FontAwesomeIcon icon={faRotateRight} />
              Reiniciar Datos Demo (Seed)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
