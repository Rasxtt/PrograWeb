import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faLock,
  faBell,
  faCheck,
  faGraduationCap,
  faShieldHalved
} from '@fortawesome/free-solid-svg-icons';

export const ProfilePage = () => {
  const { currentUser, updateCurrentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('datos'); // 'datos' | 'seguridad' | 'notificaciones'
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [career, setCareer] = useState(currentUser?.career || 'Ingeniería de Sistemas');
  const [cycle, setCycle] = useState(currentUser?.cycle || 7);
  const [bio, setBio] = useState(currentUser?.bio || 'Estudiante apasionada por la tecnología, el desarrollo de software y la robótica.');

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const [notifEmailActivities, setNotifEmailActivities] = useState(true);
  const [notifEmailClubs, setNotifEmailClubs] = useState(true);
  const [notifReminders, setNotifReminders] = useState(true);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSaveData = (e) => {
    e.preventDefault();
    setError('');
    updateCurrentUser({
      fullName,
      career,
      cycle: Number(cycle),
      bio
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    setError('');
    if (newPass.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPass !== confirmPass) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (!currentUser) {
    return (
      <div className="container py-5 text-center">
        <h4>Debes iniciar sesión para ver tu perfil</h4>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: '920px' }}>
      {/* Title & breadcrumb */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
          Mi cuenta
        </h2>
        <p className="text-muted small mb-0">
          Gestiona tu información institucional, seguridad y preferencias
        </p>
      </div>

      {savedSuccess && (
        <div className="alert alert-success d-flex align-items-center gap-2 py-2 px-3 small rounded-3 mb-4">
          <FontAwesomeIcon icon={faCheck} />
          <span>Cambios guardados exitosamente.</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger py-2 px-3 small rounded-3 mb-4">
          {error}
        </div>
      )}

      {/* Profile Overview Card */}
      <div
        className="card border rounded-4 p-4 mb-4 shadow-sm"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
      >
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#6B2FA8',
                fontSize: '1.4rem'
              }}
            >
              {currentUser.fullName
                .split(' ')
                .map(n => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div>
              <h4 className="fw-bold mb-1" style={{ color: '#1E1728' }}>
                {currentUser.fullName}
              </h4>
              <div className="text-muted small mb-2">{currentUser.email}</div>
              <div className="d-flex flex-wrap gap-2">
                <span
                  className="badge rounded-pill fw-medium"
                  style={{ backgroundColor: '#F0E9F9', color: '#6B2FA8', border: '1px solid #E6E1EE' }}
                >
                  {currentUser.career}
                </span>
                <span
                  className="badge rounded-pill fw-medium"
                  style={{ backgroundColor: '#EDFDF5', color: '#0E7047', border: '1px solid #C7F8DD' }}
                >
                  Ciclo {currentUser.cycle}
                </span>
                <span
                  className="badge rounded-pill fw-medium"
                  style={{ backgroundColor: '#EFF6FF', color: '#2563A8', border: '1px solid #BFDBFE' }}
                >
                  Código: {currentUser.code || '20211590'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card border rounded-4 shadow-sm overflow-hidden" style={{ borderColor: '#E6E1EE' }}>
        <div className="border-bottom bg-light px-3 pt-2 d-flex gap-2">
          <button
            type="button"
            className={`btn btn-sm border-0 fw-semibold pb-2.5 px-3 rounded-0 border-bottom-2 ${
              activeTab === 'datos'
                ? 'border-bottom border-3 border-primary text-primary'
                : 'text-secondary'
            }`}
            style={{
              borderColor: activeTab === 'datos' ? '#6B2FA8' : 'transparent',
              color: activeTab === 'datos' ? '#6B2FA8' : '#6E6580'
            }}
            onClick={() => setActiveTab('datos')}
          >
            <FontAwesomeIcon icon={faUser} className="me-2" />
            Datos Personales
          </button>
          <button
            type="button"
            className={`btn btn-sm border-0 fw-semibold pb-2.5 px-3 rounded-0 border-bottom-2 ${
              activeTab === 'seguridad'
                ? 'border-bottom border-3 border-primary text-primary'
                : 'text-secondary'
            }`}
            style={{
              borderColor: activeTab === 'seguridad' ? '#6B2FA8' : 'transparent',
              color: activeTab === 'seguridad' ? '#6B2FA8' : '#6E6580'
            }}
            onClick={() => setActiveTab('seguridad')}
          >
            <FontAwesomeIcon icon={faLock} className="me-2" />
            Seguridad
          </button>
          <button
            type="button"
            className={`btn btn-sm border-0 fw-semibold pb-2.5 px-3 rounded-0 border-bottom-2 ${
              activeTab === 'notificaciones'
                ? 'border-bottom border-3 border-primary text-primary'
                : 'text-secondary'
            }`}
            style={{
              borderColor: activeTab === 'notificaciones' ? '#6B2FA8' : 'transparent',
              color: activeTab === 'notificaciones' ? '#6B2FA8' : '#6E6580'
            }}
            onClick={() => setActiveTab('notificaciones')}
          >
            <FontAwesomeIcon icon={faBell} className="me-2" />
            Notificaciones
          </button>
        </div>

        <div className="card-body p-4 bg-white">
          {/* TAB 1: DATOS PERSONALES */}
          {activeTab === 'datos' && (
            <form onSubmit={handleSaveData}>
              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold">Nombre Completo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold">Correo Institucional (No modificable)</label>
                  <input
                    type="email"
                    className="form-control bg-light"
                    value={currentUser.email}
                    disabled
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold">Carrera</label>
                  <input
                    type="text"
                    className="form-control"
                    value={career}
                    onChange={(e) => setCareer(e.target.value)}
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold">Ciclo Actual</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    className="form-control"
                    value={cycle}
                    onChange={(e) => setCycle(e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold">Intereses y Presentación breve</label>
                  <textarea
                    rows={3}
                    className="form-control"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
                <div className="col-12 pt-2">
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4 fw-semibold"
                    style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
                  >
                    Guardar cambios
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: SEGURIDAD */}
          {activeTab === 'seguridad' && (
            <form onSubmit={handleSavePassword} style={{ maxWidth: '440px' }}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Contraseña actual</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Nueva contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-semibold">Confirmar nueva contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary rounded-pill px-4 fw-semibold"
                style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
              >
                Actualizar contraseña
              </button>
            </form>
          )}

          {/* TAB 3: NOTIFICACIONES */}
          {activeTab === 'notificaciones' && (
            <div style={{ maxWidth: '580px' }}>
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="swAct"
                  checked={notifEmailActivities}
                  onChange={(e) => setNotifEmailActivities(e.target.checked)}
                />
                <label className="form-check-label fw-semibold small" htmlFor="swAct">
                  Notificaciones de actividades inscritas
                </label>
                <p className="text-muted small mb-0">
                  Recibir recordatorios y cambios de sede por correo electrónico.
                </p>
              </div>

              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="swClubs"
                  checked={notifEmailClubs}
                  onChange={(e) => setNotifEmailClubs(e.target.checked)}
                />
                <label className="form-check-label fw-semibold small" htmlFor="swClubs">
                  Avisos de directiva de mis clubes
                </label>
                <p className="text-muted small mb-0">
                  Recibir publicaciones y anuncios importantes del tablón.
                </p>
              </div>

              <div className="form-check form-switch mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="swRem"
                  checked={notifReminders}
                  onChange={(e) => setNotifReminders(e.target.checked)}
                />
                <label className="form-check-label fw-semibold small" htmlFor="swRem">
                  Recordatorios 24 horas antes
                </label>
                <p className="text-muted small mb-0">
                  Alerta con enlace y código QR de entrada a tu teléfono o correo.
                </p>
              </div>

              <button
                type="button"
                className="btn btn-primary rounded-pill px-4 fw-semibold"
                style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
                onClick={() => {
                  setSavedSuccess(true);
                  setTimeout(() => setSavedSuccess(false), 3000);
                }}
              >
                Guardar preferencias
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
