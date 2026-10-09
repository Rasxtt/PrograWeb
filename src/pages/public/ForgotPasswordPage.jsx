import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faKey,
  faEnvelope,
  faShieldHalved,
  faCheckCircle,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password, 4: Done
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Countdown timer for Step 2
  useEffect(() => {
    let interval = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timer]);

  // Handle Step 1
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim().toLowerCase().endsWith('@aloe.ulima.edu.pe')) {
      setError('Por favor ingresa un correo institucional válido (@aloe.ulima.edu.pe).');
      return;
    }
    setStep(2);
    setTimer(60);
    setCanResend(false);
  };

  // Handle Step 2 Code Input
  const handleCodeChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    setError('');
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Debes ingresar el código completo de 6 dígitos.');
      return;
    }
    setStep(3);
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(60);
    setCanResend(false);
    setCode(['', '', '', '', '', '']);
    setError('');
  };

  // Handle Step 3 Password
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setStep(4);
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center py-5 px-3 flex-grow-1"
      style={{ backgroundColor: '#FBFAFD' }}
    >
      <div
        className="card border shadow-sm rounded-4 p-4 p-sm-5 w-100"
        style={{ maxWidth: '480px', backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
      >
        {/* Step Indicator */}
        <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
          <span
            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
            style={{
              width: '28px',
              height: '28px',
              backgroundColor: step >= 1 ? '#6B2FA8' : '#D6CEE2',
              fontSize: '0.8rem'
            }}
          >
            1
          </span>
          <span style={{ width: '20px', height: '2px', backgroundColor: step >= 2 ? '#6B2FA8' : '#E6E1EE' }} />
          <span
            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
            style={{
              width: '28px',
              height: '28px',
              backgroundColor: step >= 2 ? '#6B2FA8' : '#D6CEE2',
              fontSize: '0.8rem'
            }}
          >
            2
          </span>
          <span style={{ width: '20px', height: '2px', backgroundColor: step >= 3 ? '#6B2FA8' : '#E6E1EE' }} />
          <span
            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
            style={{
              width: '28px',
              height: '28px',
              backgroundColor: step >= 3 ? '#6B2FA8' : '#D6CEE2',
              fontSize: '0.8rem'
            }}
          >
            3
          </span>
        </div>

        {error && (
          <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3">
            {error}
          </div>
        )}

        {/* STEP 1: Enter institutional email */}
        {step === 1 && (
          <div>
            <div className="text-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center text-white rounded-4 shadow-sm mb-3"
                style={{ width: '52px', height: '52px', backgroundColor: '#6B2FA8', fontSize: '1.3rem' }}
              >
                <FontAwesomeIcon icon={faKey} />
              </div>
              <h4 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
                Recuperar Contraseña
              </h4>
              <p className="text-muted small mb-0">
                Ingresa tu correo institucional para recibir un código de verificación seguro.
              </p>
            </div>

            <form onSubmit={handleEmailSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold" style={{ color: '#1E1728' }}>
                  Correo institucional (@aloe.ulima.edu.pe)
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="ejemplo@aloe.ulima.edu.pe"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ borderColor: '#D6CEE2' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 rounded-pill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 mb-3"
                style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
              >
                <FontAwesomeIcon icon={faEnvelope} />
                <span>Enviar código de recuperación</span>
              </button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-decoration-none small d-inline-flex align-items-center gap-1"
                  style={{ color: '#6B2FA8' }}
                >
                  <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '0.75rem' }} />
                  Volver a iniciar sesión
                </Link>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: Enter 6-digit code */}
        {step === 2 && (
          <div>
            <div className="text-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center text-white rounded-4 shadow-sm mb-3"
                style={{ width: '52px', height: '52px', backgroundColor: '#6B2FA8', fontSize: '1.3rem' }}
              >
                <FontAwesomeIcon icon={faShieldHalved} />
              </div>
              <h4 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
                Código de Verificación
              </h4>
              <p className="text-muted small mb-0">
                Ingresa los 6 dígitos enviados a <strong>{email}</strong>
              </p>
            </div>

            <form onSubmit={handleVerifyCode}>
              <div className="d-flex justify-content-center gap-2 mb-4">
                {code.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`code-input-${idx}`}
                    type="text"
                    maxLength={1}
                    className="form-control text-center fw-bold fs-4"
                    style={{ width: '46px', height: '52px', borderColor: '#D6CEE2' }}
                    value={digit}
                    onChange={(e) => handleCodeChange(idx, e.target.value)}
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              <div className="text-center mb-3">
                {canResend ? (
                  <button
                    type="button"
                    className="btn btn-link btn-sm text-decoration-none fw-semibold"
                    style={{ color: '#6B2FA8' }}
                    onClick={handleResend}
                  >
                    Reenviar código ahora
                  </button>
                ) : (
                  <span className="small text-muted">
                    Podrás reenviar el código en {timer}s
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 rounded-pill py-2 fw-semibold mb-3"
                style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
              >
                Verificar código
              </button>

              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-link btn-sm text-decoration-none small text-muted"
                  onClick={() => setStep(1)}
                >
                  Cambiar correo ingresado
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: Set new password */}
        {step === 3 && (
          <div>
            <div className="text-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center text-white rounded-4 shadow-sm mb-3"
                style={{ width: '52px', height: '52px', backgroundColor: '#6B2FA8', fontSize: '1.3rem' }}
              >
                <FontAwesomeIcon icon={faKey} />
              </div>
              <h4 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
                Nueva Contraseña
              </h4>
              <p className="text-muted small mb-0">
                Elige una contraseña segura para tu cuenta estudiantil.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold" style={{ color: '#1E1728' }}>
                  Nueva contraseña (mínimo 6 caracteres)
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  style={{ borderColor: '#D6CEE2' }}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold" style={{ color: '#1E1728' }}>
                  Confirmar nueva contraseña
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{ borderColor: '#D6CEE2' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 rounded-pill py-2 fw-semibold mb-3"
                style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
              >
                Actualizar contraseña
              </button>
            </form>
          </div>
        )}

        {/* STEP 4: Success confirmation */}
        {step === 4 && (
          <div className="text-center py-2">
            <div
              className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: '64px', height: '64px', backgroundColor: '#EDFDF5', color: '#0E7047', fontSize: '2.2rem' }}
            >
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <h4 className="fw-bold mb-2" style={{ color: '#1E1728' }}>
              ¡Contraseña Actualizada!
            </h4>
            <p className="text-muted small mb-4">
              Tu contraseña ha sido restablecida correctamente. Ya puedes acceder con tus nuevas credenciales.
            </p>
            <button
              type="button"
              className="btn btn-primary w-100 rounded-pill py-2 fw-semibold"
              style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
              onClick={() => navigate('/login')}
            >
              Ir a Iniciar Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
