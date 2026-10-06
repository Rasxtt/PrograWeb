import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ClubCategory } from '../../types';
import { storageService } from '../../services/storageService';
import { User, Mail, GraduationCap, Calendar, Sparkles, Save, ShieldAlert } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateCurrentUser } = useAuth();
  const { showToast } = useToast();

  if (!currentUser) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <p>Debes iniciar sesión para consultar tu perfil.</p>
      </div>
    );
  }

  const [bio, setBio] = useState(currentUser.bio || '');
  const [interests, setInterests] = useState<ClubCategory[]>(currentUser.interests || []);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || '');

  const allCategories: ClubCategory[] = ['Cultura', 'Deportes', 'Tecnología', 'Social', 'Académico', 'Arte'];

  const toggleInterest = (cat: ClubCategory) => {
    if (interests.includes(cat)) {
      setInterests(interests.filter(c => c !== cat));
    } else {
      setInterests([...interests, cat]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      bio,
      interests,
      avatarUrl
    });
    showToast('Perfil actualizado correctamente', 'success');
  };

  const userMemberships = storageService.getMembershipsByUserId(currentUser.id);

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Mi Perfil de Estudiante</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          Información personal, preferencias de clubes y datos académicos Ulima
        </p>
      </div>

      {currentUser.isBlocked && (
        <div style={{
          backgroundColor: 'var(--color-danger-soft)',
          border: '1.5px solid var(--color-danger)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          marginBottom: '28px',
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-start'
        }}>
          <ShieldAlert size={28} color="var(--color-danger)" style={{ flexShrink: 0 }} />
          <div>
            <h3 style={{ color: 'var(--color-danger)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
              Cuenta con Sanción Disciplinaria Activa
            </h3>
            <p style={{ color: 'var(--color-text)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '8px' }}>
              <strong>Motivo registrado:</strong> {currentUser.blockReason || 'Infracción a las normas de convivencia.'}
            </p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
              Para regularizar tu condición, acércate a la Dirección de Bienestar Estudiantil (Edificio F, 2.° piso) o escribe a bienestar@ulima.edu.pe.
            </p>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        {/* Left Column: Academic ID Card */}
        <div className="card" style={{ padding: '28px', height: 'fit-content' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img
              src={avatarUrl || currentUser.avatarUrl}
              alt={currentUser.fullName}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid var(--color-primary-soft)',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '12px'
              }}
            />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{currentUser.fullName}</h2>
            <span className="badge badge-primary" style={{ marginTop: '4px' }}>
              {currentUser.role === 'directive' ? 'Directiva de Club' : currentUser.role === 'admin' ? 'Administrador' : 'Estudiante Regular'}
            </span>
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '18px', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <GraduationCap size={18} color="var(--color-primary)" />
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>Carrera</div>
                <div style={{ fontWeight: 600 }}>{currentUser.career}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={18} color="var(--color-primary)" />
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>Ciclo Académico</div>
                <div style={{ fontWeight: 600 }}>{currentUser.cycle}.° ciclo</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User size={18} color="var(--color-primary)" />
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>Código Ulima</div>
                <div style={{ fontWeight: 600 }}>{currentUser.code}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={18} color="var(--color-primary)" />
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>Correo Institucional</div>
                <div style={{ fontWeight: 600, wordBreak: 'break-all' }}>{currentUser.email}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Profile Settings */}
        <div className="card" style={{ padding: '28px' }}>
          <form onSubmit={handleSave}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>
              Personalización y Biografía
            </h3>

            <div className="form-group">
              <label className="form-label">URL de Fotografía / Avatar</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={e => setAvatarUrl(e.target.value)}
                placeholder="https://..."
              />
              <span className="form-hint">Enlace a imagen cuadrada para tu perfil institucional</span>
            </div>

            <div className="form-group">
              <label className="form-label">Sobre Mí (Biografía)</label>
              <textarea
                rows={4}
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Cuéntale a la comunidad cuáles son tus intereses, proyectos o motivaciones..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Intereses Temáticos de Clubes</label>
              <span className="form-hint" style={{ marginBottom: '8px', display: 'block' }}>
                Selecciona las áreas que te gustaría ver recomendadas en tu cartelera:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {allCategories.map((cat, idx) => {
                  const isSelected = interests.includes(cat);
                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => toggleInterest(cat)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        border: '1.5px solid',
                        borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                        backgroundColor: isSelected ? 'var(--color-primary-soft)' : 'transparent',
                        color: isSelected ? 'var(--color-primary)' : 'var(--color-text-muted)',
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                      }}
                    >
                      {cat} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }}>
              <Save size={16} />
              <span>Guardar Cambios</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
