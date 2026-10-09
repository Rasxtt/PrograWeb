import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { storageService } from '../../services/storageService.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faChevronDown,
  faRightFromBracket,
  faUser,
  faGraduationCap,
  faBars,
  faXmark
} from '@fortawesome/free-solid-svg-icons';

export const Header = () => {
  const { currentUser, activeRole, switchRole, logout } = useAuth();
  const navigate = useNavigate();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const notifications = currentUser ? storageService.getNotificationsByUserId(currentUser.id) : [];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id) => {
    storageService.markNotificationAsRead(id);
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
    navigate('/');
  };

  // ADMIN HEADER
  if (activeRole === 'admin') {
    return (
      <header
        style={{
          backgroundColor: '#1E1728',
          borderBottom: '1px solid #2F243F',
          minHeight: '68px',
          color: '#FFFFFF'
        }}
      >
        <div className="container py-2 d-flex align-items-center justify-content-between">
          {/* Logo Admin */}
          <Link to="/admin/tablero" className="text-decoration-none d-flex align-items-center gap-2">
            <div
              className="d-flex align-items-center justify-content-center text-white fw-bold rounded-3"
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: '#6B2FA8',
                fontSize: '1rem'
              }}
            >
              VU
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  lineHeight: 1.1,
                  color: '#FFFFFF'
                }}
              >
                Vida Universitaria
              </div>
              <div
                style={{
                  fontSize: '0.68rem',
                  color: '#17A2A2',
                  fontWeight: 600,
                  letterSpacing: '0.5px'
                }}
              >
                ADMINISTRACIÓN BIENESTAR ESTUDIANTIL
              </div>
            </div>
          </Link>

          {/* Nav Admin */}
          <nav className="d-none d-md-flex align-items-center gap-3">
            <NavLink
              to="/admin/tablero"
              className={({ isActive }) =>
                `text-decoration-none small fw-semibold py-2 px-1 border-bottom-2 ${
                  isActive ? 'text-white border-bottom border-2 border-info' : 'text-light opacity-75'
                }`
              }
              style={{ fontSize: '0.9rem' }}
            >
              Tablero
            </NavLink>
            <NavLink
              to="/admin/clubes"
              className={({ isActive }) =>
                `text-decoration-none small fw-semibold py-2 px-1 border-bottom-2 ${
                  isActive ? 'text-white border-bottom border-2 border-info' : 'text-light opacity-75'
                }`
              }
              style={{ fontSize: '0.9rem' }}
            >
              Clubes
            </NavLink>
            <NavLink
              to="/admin/usuarios"
              className={({ isActive }) =>
                `text-decoration-none small fw-semibold py-2 px-1 border-bottom-2 ${
                  isActive ? 'text-white border-bottom border-2 border-info' : 'text-light opacity-75'
                }`
              }
              style={{ fontSize: '0.9rem' }}
            >
              Usuarios
            </NavLink>
            <NavLink
              to="/admin/reportes"
              className={({ isActive }) =>
                `text-decoration-none small fw-semibold py-2 px-1 border-bottom-2 ${
                  isActive ? 'text-white border-bottom border-2 border-info' : 'text-light opacity-75'
                }`
              }
              style={{ fontSize: '0.9rem' }}
            >
              Reportes
            </NavLink>
          </nav>

          {/* User Admin info */}
          <div className="d-flex align-items-center gap-2">
            <div className="d-flex align-items-center gap-2 text-white">
              <span className="small d-none d-sm-inline opacity-90">Bienestar Estudiantil</span>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                style={{
                  width: '34px',
                  height: '34px',
                  backgroundColor: '#17A2A2',
                  fontSize: '0.8rem'
                }}
              >
                AD
              </div>
            </div>
            <button
              type="button"
              className="btn btn-outline-light btn-sm rounded-pill ms-2"
              onClick={handleLogout}
              title="Cerrar sesión"
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
            </button>
          </div>
        </div>
      </header>
    );
  }

  // PUBLIC, STUDENT & DIRECTIVE HEADER
  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E6E1EE',
        minHeight: '68px',
        position: 'sticky',
        top: 0,
        zIndex: 1020
      }}
    >
      <div className="container py-2 d-flex align-items-center justify-content-between">
        {/* Brand logo */}
        <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center text-white rounded-3 shadow-sm"
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
                fontSize: '1.2rem',
                lineHeight: 1.1,
                color: '#6B2FA8'
              }}
            >
              Vida Universitaria
            </div>
            <div
              style={{
                fontSize: '0.72rem',
                color: '#6E6580',
                fontWeight: 500
              }}
            >
              Universidad de Lima
            </div>
          </div>
        </Link>

        {/* Center Nav */}
        <nav className="d-none d-lg-flex align-items-center gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-decoration-none fw-semibold small ${
                isActive ? 'text-primary' : 'text-secondary'
              }`
            }
            style={({ isActive }) => ({
              color: isActive ? '#6B2FA8' : '#6E6580',
              borderBottom: isActive ? '2px solid #6B2FA8' : '2px solid transparent',
              padding: '6px 2px'
            })}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/directorio"
            className={({ isActive }) =>
              `text-decoration-none fw-semibold small ${
                isActive ? 'text-primary' : 'text-secondary'
              }`
            }
            style={({ isActive }) => ({
              color: isActive ? '#6B2FA8' : '#6E6580',
              borderBottom: isActive ? '2px solid #6B2FA8' : '2px solid transparent',
              padding: '6px 2px'
            })}
          >
            Directorio
          </NavLink>
          <NavLink
            to="/cartelera"
            className={({ isActive }) =>
              `text-decoration-none fw-semibold small ${
                isActive ? 'text-primary' : 'text-secondary'
              }`
            }
            style={({ isActive }) => ({
              color: isActive ? '#6B2FA8' : '#6E6580',
              borderBottom: isActive ? '2px solid #6B2FA8' : '2px solid transparent',
              padding: '6px 2px'
            })}
          >
            Cartelera
          </NavLink>

          {(activeRole === 'student' || activeRole === 'directive') && (
            <>
              <NavLink
                to={activeRole === 'directive' ? '/mis-clubes-directiva' : '/mis-clubes'}
                className={({ isActive }) =>
                  `text-decoration-none fw-semibold small ${
                    isActive ? 'text-primary' : 'text-secondary'
                  }`
                }
                style={({ isActive }) => ({
                  color: isActive ? '#6B2FA8' : '#6E6580',
                  borderBottom: isActive ? '2px solid #6B2FA8' : '2px solid transparent',
                  padding: '6px 2px'
                })}
              >
                Mis clubes
              </NavLink>
              <NavLink
                to="/mis-inscripciones"
                className={({ isActive }) =>
                  `text-decoration-none fw-semibold small ${
                    isActive ? 'text-primary' : 'text-secondary'
                  }`
                }
                style={({ isActive }) => ({
                  color: isActive ? '#6B2FA8' : '#6E6580',
                  borderBottom: isActive ? '2px solid #6B2FA8' : '2px solid transparent',
                  padding: '6px 2px'
                })}
              >
                Mis inscripciones
              </NavLink>
            </>
          )}
        </nav>

        {/* Right Actions */}
        <div className="d-flex align-items-center gap-3">
          {/* Role switcher Pill toggle (When user is student or directive) */}
          {(activeRole === 'student' || activeRole === 'directive') && (
            <div
              className="p-1 rounded-pill d-none d-md-flex align-items-center"
              style={{ backgroundColor: '#F0E9F9', border: '1px solid #E6E1EE' }}
            >
              <button
                type="button"
                className={`btn btn-sm rounded-pill fw-semibold border-0 ${
                  activeRole === 'student' ? 'text-white' : 'text-muted'
                }`}
                style={{
                  backgroundColor: activeRole === 'student' ? '#6B2FA8' : 'transparent',
                  fontSize: '0.76rem',
                  padding: '4px 12px'
                }}
                onClick={() => {
                  switchRole('student');
                  window.location.href = '/mis-clubes';
                }}
              >
                Estudiante
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-pill fw-semibold border-0 ${
                  activeRole === 'directive' ? 'text-white' : 'text-muted'
                }`}
                style={{
                  backgroundColor: activeRole === 'directive' ? '#6B2FA8' : 'transparent',
                  fontSize: '0.76rem',
                  padding: '4px 12px'
                }}
                onClick={() => {
                  switchRole('directive');
                  window.location.href = '/mis-clubes-directiva';
                }}
              >
                Directiva
              </button>
            </div>
          )}

          {/* Authenticated user items */}
          {currentUser && activeRole !== 'visitor' ? (
            <div className="d-flex align-items-center gap-2">
              {/* Avisos Notification dropdown */}
              <div className="position-relative">
                <button
                  type="button"
                  className="btn btn-sm btn-light rounded-pill position-relative d-flex align-items-center gap-1.5"
                  style={{
                    backgroundColor: '#FBFAFD',
                    border: '1px solid #E6E1EE',
                    color: '#1E1728',
                    fontSize: '0.82rem',
                    padding: '6px 12px'
                  }}
                  onClick={() => setShowNotifMenu(!showNotifMenu)}
                >
                  <FontAwesomeIcon icon={faBell} style={{ color: '#6B2FA8' }} />
                  <span className="d-none d-sm-inline">Avisos</span>
                  {unreadCount > 0 && (
                    <span
                      className="badge rounded-pill text-white"
                      style={{ backgroundColor: '#B5305F', fontSize: '0.7rem' }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifMenu && (
                  <div
                    className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg p-2"
                    style={{
                      width: '320px',
                      zIndex: 1050,
                      border: '1px solid #E6E1EE'
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between p-2 border-bottom">
                      <span className="fw-bold small" style={{ color: '#1E1728' }}>Avisos y Notificaciones</span>
                      <span className="text-muted small">{unreadCount} pendientes</span>
                    </div>
                    <div className="overflow-auto" style={{ maxHeight: '280px' }}>
                      {notifications.length === 0 ? (
                        <div className="p-3 text-center text-muted small">No tienes avisos nuevos</div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className="p-2 border-bottom hover-bg-light cursor-pointer"
                            style={{
                              backgroundColor: notif.isRead ? '#FFFFFF' : '#FBF9FE',
                              cursor: 'pointer'
                            }}
                            onClick={() => {
                              handleMarkAsRead(notif.id);
                              setShowNotifMenu(false);
                              if (notif.link) navigate(notif.link);
                            }}
                          >
                            <div className="fw-semibold small" style={{ color: '#1E1728' }}>
                              {notif.title}
                            </div>
                            <div className="text-muted" style={{ fontSize: '0.74rem' }}>
                              {notif.message}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar dropdown */}
              <div className="position-relative">
                <button
                  type="button"
                  className="btn btn-sm btn-light rounded-pill d-flex align-items-center gap-2"
                  style={{
                    backgroundColor: '#FBFAFD',
                    border: '1px solid #E6E1EE',
                    padding: '4px 10px 4px 6px'
                  }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                    style={{
                      width: '30px',
                      height: '30px',
                      backgroundColor: '#6B2FA8',
                      fontSize: '0.76rem'
                    }}
                  >
                    {currentUser.fullName
                      .split(' ')
                      .map(n => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <span
                    className="small fw-semibold d-none d-sm-inline"
                    style={{ color: '#1E1728', maxWidth: '120px' }}
                  >
                    {currentUser.fullName}
                  </span>
                  <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '0.7rem', color: '#6E6580' }} />
                </button>

                {showUserMenu && (
                  <div
                    className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg p-2"
                    style={{
                      width: '210px',
                      zIndex: 1050,
                      border: '1px solid #E6E1EE'
                    }}
                  >
                    <div className="p-2 border-bottom">
                      <div className="fw-bold small text-truncate" style={{ color: '#1E1728' }}>
                        {currentUser.fullName}
                      </div>
                      <div className="text-muted text-truncate" style={{ fontSize: '0.72rem' }}>
                        {currentUser.email}
                      </div>
                    </div>
                    <Link
                      to="/mi-cuenta"
                      className="d-flex align-items-center gap-2 p-2 text-decoration-none small text-dark rounded hover-bg-light"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FontAwesomeIcon icon={faUser} style={{ color: '#6B2FA8' }} />
                      Mi cuenta
                    </Link>
                    <button
                      type="button"
                      className="w-100 text-start d-flex align-items-center gap-2 p-2 btn btn-link text-decoration-none small text-danger rounded hover-bg-light"
                      onClick={handleLogout}
                    >
                      <FontAwesomeIcon icon={faRightFromBracket} />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Visitor CTA buttons */
            <div className="d-flex align-items-center gap-2">
              <Link
                to="/registrar-club"
                className="btn btn-link text-decoration-none small fw-semibold d-none d-sm-inline"
                style={{ color: '#6B2FA8', fontSize: '0.86rem' }}
              >
                Registrar mi club
              </Link>
              <Link
                to="/login"
                className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                style={{
                  borderColor: '#E6E1EE',
                  color: '#1E1728',
                  fontSize: '0.84rem'
                }}
              >
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                className="btn btn-primary btn-sm rounded-pill px-3"
                style={{
                  backgroundColor: '#6B2FA8',
                  borderColor: '#6B2FA8',
                  fontSize: '0.84rem'
                }}
              >
                Crear cuenta
              </Link>
            </div>
          )}

          {/* Mobile menu toggle button */}
          <button
            type="button"
            className="btn btn-light btn-sm d-lg-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FontAwesomeIcon icon={isMobileMenuOpen ? faXmark : faBars} />
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {isMobileMenuOpen && (
        <div className="d-lg-none border-top bg-white p-3 shadow-sm">
          <nav className="d-flex flex-column gap-2 mb-3">
            <Link
              to="/"
              className="text-decoration-none p-2 rounded text-dark fw-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              to="/directorio"
              className="text-decoration-none p-2 rounded text-dark fw-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Directorio de Clubes
            </Link>
            <Link
              to="/cartelera"
              className="text-decoration-none p-2 rounded text-dark fw-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Cartelera de Actividades
            </Link>
            {(activeRole === 'student' || activeRole === 'directive') && (
              <>
                <Link
                  to={activeRole === 'directive' ? '/mis-clubes-directiva' : '/mis-clubes'}
                  className="text-decoration-none p-2 rounded text-dark fw-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mis Clubes
                </Link>
                <Link
                  to="/mis-inscripciones"
                  className="text-decoration-none p-2 rounded text-dark fw-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mis Inscripciones
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
