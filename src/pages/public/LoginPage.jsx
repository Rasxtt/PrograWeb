import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faRightToBracket, faUserCheck } from '@fortawesome/free-solid-svg-icons';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, switchUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Por favor ingresa tu correo institucional.');
      return;
    }

    setLoading(true);
    const result = login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Credenciales inválidas.');
    }
  };

  const handleQuickLogin = (userId) => {
    switchUser(userId);
    navigate('/');
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center py-5 px-3 flex-grow-1"
      style={{ backgroundColor: '#FBFAFD' }}
    >
      <div
        className="card border shadow-sm rounded-4 p-4 p-sm-5 w-100"
        style={{ maxWidth: '460px', backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
      >
        {/* Brand Icon */}
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center text-white rounded-4 shadow-sm mb-3"
            style={{ width: '52px', height: '52px', backgroundColor: '#6B2FA8', fontSize: '1.4rem' }}
          >
            <FontAwesomeIcon icon={faGraduationCap} />
          </div>
          <h3 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
            Iniciar sesión
          </h3>
          <p className="text-muted small mb-0">
            Ingresa con tu correo institucional de la Universidad de Lima
          </p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3" role="alert">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold" style={{ color: '#1E1728' }}>
              Correo institucional (@aloe.ulima.edu.pe)
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="codigo@aloe.ulima.edu.pe"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ borderColor: '#D6CEE2' }}
            />
          </div>

          <div className="mb-3">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <label className="form-label small fw-semibold mb-0" style={{ color: '#1E1728' }}>
                Contraseña
              </label>
              <Link
                to="/recuperar-password"
                className="text-decoration-none small"
                style={{ color: '#6B2FA8', fontSize: '0.8rem' }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ borderColor: '#D6CEE2' }}
            />
          </div>

          <div className="form-check mb-4">
            <input
              className="form-check-input"
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label className="form-check-label small text-muted" htmlFor="rememberMe">
              Recordar sesión en este equipo
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 rounded-pill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
            style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
            disabled={loading}
          >
            <FontAwesomeIcon icon={faRightToBracket} />
            <span>Iniciar sesión</span>
          </button>
        </form>

        {/* Quick Demo Access Box */}
        <div className="mt-4 pt-3 border-top">
          <div className="small fw-bold text-muted mb-2 text-center" style={{ fontSize: '0.75rem' }}>
            ACCESO RÁPIDO PARA PRUEBAS (DEMO):
          </div>
          <div className="d-flex flex-column gap-1.5">
            <button
              type="button"
              className="btn btn-outline-light btn-sm text-start text-dark border d-flex align-items-center justify-content-between px-3 py-1.5 rounded-3"
              style={{ fontSize: '0.78rem', backgroundColor: '#FBFAFD', borderColor: '#E6E1EE' }}
              onClick={() => handleQuickLogin('user-camila')}
            >
              <span><strong>Camila Q.</strong> (Estudiante)</span>
              <FontAwesomeIcon icon={faUserCheck} style={{ color: '#6B2FA8' }} />
            </button>
            <button
              type="button"
              className="btn btn-outline-light btn-sm text-start text-dark border d-flex align-items-center justify-content-between px-3 py-1.5 rounded-3"
              style={{ fontSize: '0.78rem', backgroundColor: '#FBFAFD', borderColor: '#E6E1EE' }}
              onClick={() => handleQuickLogin('user-sofia')}
            >
              <span><strong>Sofía Vega</strong> (Directiva Robótica)</span>
              <FontAwesomeIcon icon={faUserCheck} style={{ color: '#C2681C' }} />
            </button>
            <button
              type="button"
              className="btn btn-outline-light btn-sm text-start text-dark border d-flex align-items-center justify-content-between px-3 py-1.5 rounded-3"
              style={{ fontSize: '0.78rem', backgroundColor: '#FBFAFD', borderColor: '#E6E1EE' }}
              onClick={() => handleQuickLogin('user-admin')}
            >
              <span><strong>Bienestar Estudiantil</strong> (Administrador)</span>
              <FontAwesomeIcon icon={faUserCheck} style={{ color: '#17A2A2' }} />
            </button>
          </div>
        </div>

        {/* Link to register */}
        <div className="text-center mt-4 pt-2">
          <span className="small text-muted">¿No tienes cuenta activa? </span>
          <Link
            to="/registro"
            className="small fw-semibold text-decoration-none"
            style={{ color: '#6B2FA8' }}
          >
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
};
