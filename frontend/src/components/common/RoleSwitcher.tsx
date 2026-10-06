import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { Users, RotateCcw, ChevronDown, ShieldAlert, Award, UserCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const RoleSwitcher: React.FC = () => {
  const { currentUser, switchUser, switchRole, activeRole, refreshUsers } = useAuth();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const personas = [
    {
      id: null,
      name: 'Visitante (Público)',
      role: 'visitor',
      badge: 'Público',
      desc: 'Navegación anónima sin sesión'
    },
    {
      id: 'user-camila',
      name: 'Camila Andrade Quispe',
      role: 'student',
      badge: 'Estudiante',
      desc: 'Ing. Industrial - Miembro Debate'
    },
    {
      id: 'user-lucia',
      name: 'Lucía Mendoza Ríos',
      role: 'directive',
      badge: 'Directiva',
      desc: 'Presidenta Club de Robótica'
    },
    {
      id: 'user-admin',
      name: 'Bienestar Estudiantil',
      role: 'admin',
      badge: 'Admin Ulima',
      desc: 'Supervisión de Clubes y Métricas'
    },
    {
      id: 'user-carlos',
      name: 'Carlos Morales (Bloqueado)',
      role: 'student',
      badge: 'Sancionado',
      desc: 'Prueba de pantalla de cuenta bloqueada'
    }
  ];

  const handleSelectPersona = (p: typeof personas[0]) => {
    switchUser(p.id);
    if (p.id === 'user-lucia') {
      switchRole('directive');
    }
    setIsOpen(false);
    showToast(`Cambiado a perfil: ${p.name}`, 'info');
  };

  const handleResetData = () => {
    if (window.confirm('¿Deseas restablecer todos los datos al catálogo inicial de prueba?')) {
      storageService.resetToSeed();
      refreshUsers();
      showToast('Datos restablecidos al catálogo inicial con éxito', 'success');
      window.location.reload();
    }
  };

  return (
    <aside aria-label="Selector de perfiles de evaluación" style={{
      position: 'fixed',
      bottom: '18px',
      left: '18px',
      zIndex: 9999,
      fontFamily: 'var(--font-body)'
    }}>
      <div style={{
        backgroundColor: 'var(--color-surface)',
        border: '1.5px solid var(--color-primary)',
        borderRadius: 'var(--radius-pill)',
        padding: '6px 14px',
        boxShadow: '0 8px 24px rgba(30, 23, 40, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: currentUser?.isBlocked ? 'var(--color-danger)' : 'var(--color-success)'
        }} />
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--color-text)'
          }}
        >
          <Users size={16} color="var(--color-primary)" />
          <span>
            {currentUser ? currentUser.fullName.split(' ')[0] : 'Visitante'}
            {' '}({currentUser?.isBlocked ? 'Bloqueado' : activeRole === 'directive' ? 'Directiva' : activeRole === 'admin' ? 'Admin' : activeRole === 'student' ? 'Estudiante' : 'Público'})
          </span>
          <ChevronDown size={14} />
        </button>

        <button
          onClick={handleResetData}
          title="Restablecer datos de prueba"
          style={{
            display: 'flex',
            alignItems: 'center',
            color: 'var(--color-text-muted)',
            padding: '4px',
            borderRadius: '4px'
          }}
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '50px',
          left: '0',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-modal)',
          width: '320px',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          animation: 'slideUp 0.15s ease-out'
        }}>
          <div style={{
            padding: '8px 12px 6px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: 'var(--color-text-muted)',
            borderBottom: '1px solid var(--color-border-subtle)'
          }}>
            Cambio Rápido de Persona (Demo Docente)
          </div>

          {personas.map((p, idx) => {
            const isSelected = (!p.id && !currentUser) || (currentUser && currentUser.id === p.id);
            return (
              <button
                key={idx}
                onClick={() => handleSelectPersona(p)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isSelected ? 'var(--color-primary-soft)' : 'transparent',
                  textAlign: 'left',
                  width: '100%'
                }}
              >
                <div>
                  <div style={{
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: isSelected ? 'var(--color-primary)' : 'var(--color-text)'
                  }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {p.desc}
                  </div>
                </div>
                <span className={`badge ${
                  p.role === 'admin' ? 'badge-primary' :
                  p.role === 'directive' ? 'badge-warning' :
                  p.id === 'user-carlos' ? 'badge-danger' : 'badge-info'
                }`} style={{ fontSize: '0.7rem' }}>
                  {p.badge}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </aside>
  );
};
