import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { UserPlus, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    code: '',
    email: '',
    fullName: '',
    career: 'Ingeniería de Sistemas',
    cycle: 1,
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const [error, setError] = useState<string | null>(null);

  const careers = [
    'Administración',
    'Arquitectura',
    'Comunicación',
    'Contabilidad y Finanzas',
    'Derecho',
    'Economía',
    'Ingeniería Civil',
    'Ingeniería Industrial',
    'Ingeniería de Sistemas',
    'Marketing',
    'Nutrición y Dietética',
    'Psicología'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 8) {
      setError('La contraseña debe tener un mínimo de 8 caracteres.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden. Por favor verifícalas.');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Debes aceptar las normas del Reglamento de Convivencia Estudiantil Ulima.');
      return;
    }

    const result = register({
      code: formData.code,
      email: formData.email,
      fullName: formData.fullName,
      career: formData.career,
      cycle: Number(formData.cycle)
    });

    if (!result.success) {
      setError(result.error || 'Error al registrar la cuenta');
    } else {
      showToast('¡Cuenta creada exitosamente! Bienvenido a Vida Universitaria', 'success');
      navigate('/directorio');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px', display: 'flex', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '560px', width: '100%', padding: '36px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Registro de Estudiante</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            Únete a la comunidad de agrupaciones y clubes estudiantiles de la Universidad de Lima
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'var(--color-danger-soft)',
            borderLeft: '4px solid var(--color-danger)',
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-danger)',
            fontSize: '0.85rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Código de Alumno</label>
              <input
                type="text"
                placeholder="20240182"
                maxLength={8}
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                required
              />
              <span className="form-hint">8 dígitos numéricos</span>
            </div>

            <div className="form-group">
              <label className="form-label">Correo Institucional</label>
              <input
                type="email"
                placeholder="u20240182@aloe.ulima.edu.pe"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <span className="form-hint">@aloe.ulima.edu.pe</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nombres y Apellidos Completos</label>
            <input
              type="text"
              placeholder="Ej. Rodrigo Salazar Mendoza"
              value={formData.fullName}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Carrera Profesional</label>
              <select
                value={formData.career}
                onChange={e => setFormData({ ...formData, career: e.target.value })}
              >
                {careers.map((c, idx) => (
                  <option key={idx} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Ciclo Actual</label>
              <select
                value={formData.cycle}
                onChange={e => setFormData({ ...formData, cycle: Number(e.target.value) })}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <option key={n} value={n}>{n}.° ciclo</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirmar Contraseña</label>
              <input
                type="password"
                placeholder="Repite la contraseña"
                value={formData.confirmPassword}
                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '6px', marginBottom: '20px' }}>
            <input
              type="checkbox"
              id="acceptTerms"
              checked={formData.acceptTerms}
              onChange={e => setFormData({ ...formData, acceptTerms: e.target.checked })}
              style={{ width: 'auto', marginTop: '4px' }}
            />
            <label htmlFor="acceptTerms" style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
              He leído y me comprometo a respetar las disposiciones del Reglamento de Agrupaciones Estudiantiles y Normas de Convivencia Ulima.
            </label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
            <UserPlus size={18} />
            <span>Completar Registro de Estudiante</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.86rem', color: 'var(--color-text-muted)' }}>
          ¿Ya tienes cuenta institucional?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
};
