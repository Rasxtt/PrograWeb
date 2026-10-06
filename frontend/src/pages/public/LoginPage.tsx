import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ShieldAlert, LogIn, Sparkles, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchUser, switchRole } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = login(email, password);
    if (!result.success) {
      setError(result.error || 'Error al iniciar sesión');
    } else {
      showToast('¡Sesión iniciada con éxito!', 'success');
      if (email.includes('admin')) {
        navigate('/admin/tablero');
      } else {
        navigate('/directorio');
      }
    }
  };

  const handleQuickLogin = (userId: string, role?: 'student' | 'directive' | 'admin', targetUrl: string = '/directorio') => {
    switchUser(userId);
    if (role) switchRole(role);
    showToast(`Sesión iniciada como perfil de prueba`, 'success');
    navigate(targetUrl);
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px', display: 'flex', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '460px', width: '100%', padding: '36px 32px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.25rem',
            marginBottom: '12px'
          }}>
            VU
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Iniciar Sesión</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            Acceso único para estudiantes y agrupaciones de la Universidad de Lima
          </p>
        </div>

        {/* Error notification banner */}
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

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Correo Institucional Ulima</label>
            <input
              type="email"
              placeholder="u20211842@aloe.ulima.edu.pe"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <span className="form-hint">Debe pertenecer al dominio @aloe.ulima.edu.pe</span>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Contraseña</label>
              <a href="#recuperar" style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px', padding: '12px' }}>
            <LogIn size={18} />
            <span>Ingresar a Vida Universitaria</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.86rem', color: 'var(--color-text-muted)' }}>
          ¿No tienes una cuenta aún?{' '}
          <Link to="/registro" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            Crear mi cuenta de estudiante
          </Link>
        </div>

        {/* Evaluation Shortcut Box */}
        <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px dashed var(--color-border)',
          backgroundColor: 'var(--color-surface-subtle)',
          padding: '16px',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: 'var(--color-text-muted)',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Sparkles size={14} color="var(--color-primary)" />
            <span>Acceso Rápido de Evaluación Docente</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => handleQuickLogin('user-camila', 'student', '/directorio')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'flex-start', textAlign: 'left' }}
            >
              👩‍🎓 <strong>Camila Andrade</strong> (Estudiante • Ing. Industrial)
            </button>
            <button
              onClick={() => handleQuickLogin('user-lucia', 'directive', '/gestion-club/club-robotica/perfil')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'flex-start', textAlign: 'left' }}
            >
              👑 <strong>Lucía Mendoza</strong> (Directiva • Robótica Ulima)
            </button>
            <button
              onClick={() => handleQuickLogin('user-admin', 'admin', '/admin/tablero')}
              className="btn btn-outline btn-sm"
              style={{ justifyContent: 'flex-start', textAlign: 'left' }}
            >
              🏛️ <strong>Bienestar Estudiantil</strong> (Administrador Ulima)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
