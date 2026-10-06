import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import {
  Bell,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Shield,
  Layers,
  Calendar,
  Compass,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const Header: React.FC = () => {
  const { currentUser, activeRole, switchRole, logout } = useAuth();
  const navigate = useNavigate();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const notifications = currentUser ? storageService.getNotificationsByUserId(currentUser.id) : [];
  const unreadNotifs = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
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
      <header style={{
        backgroundColor: 'var(--color-admin-bg)',
        borderBottom: '1px solid #2F243F',
        height: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
        color: '#FFFFFF'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo Admin */}
          <Link to="/admin/tablero" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              backgroundColor: 'var(--color-primary)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.05rem',
              color: '#FFFFFF'
            }}>
              VU
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-headings)',
                fontWeight: 700,
                fontSize: '1.05rem',
                lineHeight: 1.1,
                color: '#FFFFFF'
              }}>
                Vida Universitaria
              </div>
              <div style={{
                fontSize: '0.72rem',
                color: 'var(--color-accent)',
                fontWeight: 600,
                letterSpacing: '0.5px'
              }}>
                ADMINISTRACIÓN BIENESTAR ESTUDIANTIL
              </div>
            </div>
          </Link>

          {/* Nav Admin */}
          <nav aria-label="Navegación principal de administración" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <NavLink
              to="/admin/tablero"
              style={({ isActive }) => ({
                fontSize: '0.92rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#FFFFFF' : '#A99DBE',
                borderBottom: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
                padding: '6px 2px'
              })}
            >
              Tablero
            </NavLink>
            <NavLink
              to="/admin/clubes"
              style={({ isActive }) => ({
                fontSize: '0.92rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#FFFFFF' : '#A99DBE',
                borderBottom: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
                padding: '6px 2px'
              })}
            >
              Clubes
            </NavLink>
            <NavLink
              to="/admin/usuarios"
              style={({ isActive }) => ({
                fontSize: '0.92rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#FFFFFF' : '#A99DBE',
                borderBottom: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
                padding: '6px 2px'
              })}
            >
              Usuarios
            </NavLink>
            <NavLink
              to="/admin/reportes"
              style={({ isActive }) => ({
                fontSize: '0.92rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#FFFFFF' : '#A99DBE',
                borderBottom: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
                padding: '6px 2px'
              })}
            >
              Reportes
            </NavLink>
          </nav>

          {/* Admin Avatar & Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{
              backgroundColor: 'rgba(23, 162, 162, 0.18)',
              color: 'var(--color-accent)',
              fontSize: '0.78rem',
              fontWeight: 600,
              padding: '4px 12px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid rgba(23, 162, 162, 0.3)'
            }}>
              Bienestar Estudiantil
            </span>

            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-accent)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}>
              AD
            </div>

            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              style={{
                color: '#A99DBE',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex'
              }}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>
    );
  }

  // STANDARD HEADER (VISITOR, STUDENT, DIRECTIVE)
  return (
    <header style={{
      backgroundColor: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      height: 'var(--header-height)',
      display: 'flex',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'var(--color-primary)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.1rem',
            color: '#FFFFFF',
            boxShadow: '0 2px 8px rgba(107, 47, 168, 0.3)'
          }}>
            VU
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-headings)',
              fontWeight: 700,
              fontSize: '1.15rem',
              lineHeight: 1.1,
              color: 'var(--color-text)'
            }}>
              Vida Universitaria
            </div>
            <div style={{
              fontSize: '0.72rem',
              color: 'var(--color-primary)',
              fontWeight: 600,
              letterSpacing: '0.5px'
            }}>
              UNIVERSIDAD DE LIMA
            </div>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav aria-label="Navegación principal de usuario" style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
          <NavLink
            to="/directorio"
            style={({ isActive }) => ({
              fontSize: '0.92rem',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
              borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
              padding: '6px 2px'
            })}
          >
            Directorio
          </NavLink>
          <NavLink
            to="/cartelera"
            style={({ isActive }) => ({
              fontSize: '0.92rem',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
              borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
              padding: '6px 2px'
            })}
          >
            Cartelera
          </NavLink>

          {currentUser && (
            <>
              <NavLink
                to="/mis-clubes"
                style={({ isActive }) => ({
                  fontSize: '0.92rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                  borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                  padding: '6px 2px'
                })}
              >
                Mis clubes
              </NavLink>
              <NavLink
                to="/mis-inscripciones"
                style={({ isActive }) => ({
                  fontSize: '0.92rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                  borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                  padding: '6px 2px'
                })}
              >
                Mis inscripciones
              </NavLink>
            </>
          )}
        </nav>

        {/* Right Section Actions & User Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* VISITOR BUTTONS */}
          {!currentUser ? (
            <>
              <Link to="/registro-club" className="btn btn-secondary btn-sm">
                Registrar mi club
              </Link>
              <Link to="/login" className="btn btn-outline btn-sm">
                Iniciar sesión
              </Link>
              <Link to="/registro" className="btn btn-primary btn-sm">
                Crear cuenta
              </Link>
            </>
          ) : (
            <>
              {/* DIRECTIVE ROLE PILL SWITCHER */}
              {(currentUser.role === 'directive' || currentUser.managedClubId) && (
                <div style={{
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}>
                  <button
                    onClick={() => switchRole('student')}
                    style={{
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      backgroundColor: activeRole === 'student' ? 'var(--color-primary)' : 'transparent',
                      color: activeRole === 'student' ? '#FFFFFF' : 'var(--color-text-muted)',
                      transition: 'var(--transition)'
                    }}
                  >
                    Estudiante
                  </button>
                  <button
                    onClick={() => switchRole('directive')}
                    style={{
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      backgroundColor: activeRole === 'directive' ? 'var(--color-primary)' : 'transparent',
                      color: activeRole === 'directive' ? '#FFFFFF' : 'var(--color-text-muted)',
                      transition: 'var(--transition)'
                    }}
                  >
                    Directiva
                  </button>
                </div>
              )}

              {/* NOTIFICATION BELL */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    setShowNotifMenu(!showNotifMenu);
                    setShowUserMenu(false);
                  }}
                  style={{
                    position: 'relative',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: showNotifMenu ? 'var(--color-primary-soft)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-text-muted)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <Bell size={18} />
                  {unreadNotifs > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      backgroundColor: 'var(--color-accent)',
                      color: '#FFFFFF',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid var(--color-surface)'
                    }}>
                      {unreadNotifs}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '46px',
                    right: '0',
                    width: '340px',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-modal)',
                    padding: '12px',
                    zIndex: 200,
                    animation: 'slideUp 0.15s ease-out'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingBottom: '8px',
                      borderBottom: '1px solid var(--color-border-subtle)',
                      marginBottom: '8px'
                    }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Notificaciones</span>
                      <span className="badge badge-primary">{unreadNotifs} nuevas</span>
                    </div>

                    <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                          No tienes notificaciones pendientes.
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n.id}
                            onClick={() => handleMarkAsRead(n.id)}
                            style={{
                              padding: '10px',
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: n.isRead ? 'transparent' : 'var(--color-surface-subtle)',
                              cursor: 'pointer',
                              border: '1px solid var(--color-border-subtle)'
                            }}
                          >
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text)' }}>
                              {n.title}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                              {n.message}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* USER PROFILE DROPDOWN */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifMenu(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 10px 4px 4px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: showUserMenu ? 'var(--color-primary-soft)' : 'var(--color-surface-hover)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.1 }}>
                      {currentUser.fullName.split(' ')[0]} {currentUser.fullName.split(' ')[2] ? currentUser.fullName.split(' ')[2][0] + '.' : ''}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                      {currentUser.code}
                    </span>
                  </div>
                  <ChevronDown size={14} color="var(--color-text-muted)" />
                </button>

                {showUserMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '46px',
                    right: '0',
                    width: '220px',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-modal)',
                    padding: '6px',
                    zIndex: 200,
                    animation: 'slideUp 0.15s ease-out'
                  }}>
                    <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{currentUser.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{currentUser.career}</div>
                    </div>

                    <Link
                      to="/mi-cuenta"
                      onClick={() => setShowUserMenu(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        fontSize: '0.85rem',
                        color: 'var(--color-text)',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      <UserIcon size={16} color="var(--color-primary)" />
                      <span>Mi perfil</span>
                    </Link>

                    {currentUser.managedClubId && (
                      <Link
                        to={`/gestion-club/${currentUser.managedClubId}/perfil`}
                        onClick={() => {
                          switchRole('directive');
                          setShowUserMenu(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 10px',
                          fontSize: '0.85rem',
                          color: 'var(--color-text)',
                          borderRadius: 'var(--radius-sm)'
                        }}
                      >
                        <Shield size={16} color="var(--color-accent)" />
                        <span>Gestión de mi club</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        fontSize: '0.85rem',
                        color: 'var(--color-danger)',
                        width: '100%',
                        textAlign: 'left',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      <LogOut size={16} />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
