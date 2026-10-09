import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faGraduationCap, faUserPlus } from '@fortawesome/free-solid-svg-icons';

const CAREERS = [
  'Ingeniería de Sistemas',
  'Ingeniería Industrial',
  'Ingeniería Civil',
  'Administración',
  'Economía',
  'Contabilidad y Finanzas',
  'Comunicación',
  'Derecho',
  'Psicología',
  'Arquitectura',
  'Marketing',
  'Negocios Internacionales'
];

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [career, setCareer] = useState(CAREERS[0]);
  const [cycle, setCycle] = useState('5');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Auto-fill email based on student code if empty or matching pattern
  const handleCodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 8);
    setCode(val);
    if (val.length === 8 && !email) {
      setEmail(`u${val}@aloe.ulima.edu.pe`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (code.length !== 8) {
      setError('El código de alumno debe contener 8 dígitos numéricos.');
      return;
    }

    if (!email.toLowerCase().endsWith('@aloe.ulima.edu.pe')) {
      setError('El correo debe pertenecer al dominio @aloe.ulima.edu.pe.');
      return;
    }

    if (!fullName.trim()) {
      setError('Por favor ingresa tus nombres y apellidos completos.');
      return;
    }

    if (password && password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!agreeTerms) {
      setError('Debes aceptar los términos y condiciones institucionales.');
      return;
    }

    const res = register({
      code,
      email,
      fullName,
      career,
      cycle: Number(cycle),
      password
    });

    if (res.success) {
      setShowSuccessModal(true);
    } else {
      setError(res.error || 'Error al crear la cuenta.');
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center py-5 px-3 flex-grow-1"
      style={{ backgroundColor: '#FBFAFD' }}
    >
      <div
        className="card border shadow-sm rounded-4 p-4 p-sm-5 w-100"
        style={{ maxWidth: '560px', backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
      >
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center text-white rounded-4 shadow-sm mb-3"
            style={{ width: '52px', height: '52px', backgroundColor: '#6B2FA8', fontSize: '1.4rem' }}
          >
            <FontAwesomeIcon icon={faGraduationCap} />
          </div>
          <h3 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
            Crear cuenta estudiantil
          </h3>
          <p className="text-muted small mb-0">
            Regístrate con tu correo institucional @aloe.ulima.edu.pe
          </p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* Código */}
            <div className="col-12 col-sm-6">
              <label className="form-label small fw-semibold" style={{ color: '#1E1728' }}>
                Código de Alumno (8 dígitos) *
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="20221458"
                value={code}
                onChange={handleCodeChange}
                required
                maxLength={8}
                style={{ borderColor: '#D6CEE2' }}
              />
            </div>

            {/* Correo */}
            <div className="col-12 col-sm-6">
              <label className="form-label small fw-semibold" style={{ color: '#1E1728' }}>
                Correo Institucional *
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="usuario@aloe.ulima.edu.pe"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ borderColor: '#D6CEE2' }}
              />
            </div>

            {/* Nombres */}
            <div className="col-12">
              <label className="form-label small fw-semibold" style={{ color: '#1E1728' }}>
                Nombres y Apellidos Completos *
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej. Camila Quispe Rodríguez"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{ borderColor: '#D6CEE2' }}
              />
            </div>

            {/* Carrera */}
            <div className="col-12 col-sm-8">
              <label className="form-label small fw-semibold" style={{ color: '#1E1728' }}>
                Carrera *
              </label>
              <select
                className="form-select"
                value={career}
                onChange={(e) => setCareer(e.target.value)}
                style={{ borderColor: '#D6CEE2' }}
              >
                {CAREERS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Ciclo */}
            <div className="col-12 col-sm-4">
              <label className="form-label small fw-semibold" style={{ color: '#1E1728' }}>
                Ciclo Actual *
              </label>
              <select
                className="form-select"
                value={cycle}
                onChange={(e) => setCycle(e.target.value)}
                style={{ borderColor: '#D6CEE2' }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                  <option key={num} value={num}>Ciclo {num}</option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div className="col-12 col-sm-6">
              <label className="form-label small fw-semibold" style={{ color: '#1E1728' }}>
                Contraseña
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ borderColor: '#D6CEE2' }}
              />
            </div>

            {/* Confirm Password */}
            <div className="col-12 col-sm-6">
              <label className="form-label small fw-semibold" style={{ color: '#1E1728' }}>
                Confirmar Contraseña
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ borderColor: '#D6CEE2' }}
              />
            </div>

            {/* Terms checkbox */}
            <div className="col-12">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                />
                <label className="form-check-label small text-muted" htmlFor="agreeTerms">
                  Acepto el Reglamento General de Clubes y Actividades Estudiantiles de la Universidad de Lima.
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="col-12 pt-2">
              <button
                type="submit"
                className="btn btn-primary w-100 rounded-pill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
                style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
              >
                <FontAwesomeIcon icon={faUserPlus} />
                <span>Crear mi cuenta</span>
              </button>
            </div>
          </div>
        </form>

        <div className="text-center mt-4 pt-2">
          <span className="small text-muted">¿Ya tienes cuenta? </span>
          <Link
            to="/login"
            className="small fw-semibold text-decoration-none"
            style={{ color: '#6B2FA8' }}
          >
            Inicia sesión aquí
          </Link>
        </div>
      </div>

      {/* SUCCESS MODAL (Mockup 1.3_msg_cuenta_creada.png) */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate('/');
        }}
        title="¡Cuenta creada exitosamente!"
        maxWidth="460px"
      >
        <div className="text-center py-3">
          <div
            className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: '64px', height: '64px', backgroundColor: '#EDFDF5', color: '#0E7047', fontSize: '2.2rem' }}
          >
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>
          <h5 className="fw-bold mb-2" style={{ color: '#1E1728' }}>
            ¡Bienvenido a Vida Universitaria!
          </h5>
          <p className="text-muted small mb-4 px-2">
            Hemos registrado tu perfil de estudiante de la Universidad de Lima. Tu sesión se ha iniciado automáticamente.
          </p>
          <button
            type="button"
            className="btn btn-primary rounded-pill px-4 py-2 w-100 fw-semibold"
            style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
            onClick={() => {
              setShowSuccessModal(false);
              navigate('/');
            }}
          >
            Comenzar a explorar
          </button>
        </div>
      </Modal>
    </div>
  );
};
