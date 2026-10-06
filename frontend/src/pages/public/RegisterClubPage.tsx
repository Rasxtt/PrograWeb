import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ClubCategory } from '../../types';
import { Sparkles, Send, CheckCircle2, ShieldAlert } from 'lucide-react';

export const RegisterClubPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: 'Tecnología' as ClubCategory,
    tagline: '',
    description: '',
    mission: '',
    vision: '',
    meetingDays: ['Miércoles'],
    meetingTime: '17:00 - 19:00',
    meetingLocation: 'Campus Monterrico',
    contactEmail: currentUser ? currentUser.email : ''
  });

  const categories: ClubCategory[] = ['Cultura', 'Deportes', 'Tecnología', 'Social', 'Académico', 'Arte'];
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábados'];

  const handleToggleDay = (day: string) => {
    if (formData.meetingDays.includes(day)) {
      if (formData.meetingDays.length > 1) {
        setFormData({ ...formData, meetingDays: formData.meetingDays.filter(d => d !== day) });
      }
    } else {
      setFormData({ ...formData, meetingDays: [...formData.meetingDays, day] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      showToast('Debes iniciar sesión con tu cuenta de estudiante para postular un club', 'info');
      navigate('/login');
      return;
    }

    if (currentUser.isBlocked) {
      showToast(`Tu cuenta se encuentra sancionada: ${currentUser.blockReason}`, 'danger');
      return;
    }

    const newClub = storageService.createClub({
      code: formData.code.trim().toUpperCase(),
      name: formData.name.trim(),
      tagline: formData.tagline.trim(),
      description: formData.description.trim(),
      category: formData.category,
      mission: formData.mission.trim(),
      vision: formData.vision.trim(),
      status: 'under_review',
      logoUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&auto=format&fit=crop&q=80',
      meetingDays: formData.meetingDays,
      meetingTime: formData.meetingTime,
      meetingLocation: formData.meetingLocation,
      contactEmail: formData.contactEmail,
      socialLinks: {},
      admissionType: 'application',
      requirements: [
        'Ser alumno regular matriculado en la Universidad de Lima',
        'Compromiso con el plan de actividades'
      ],
      customQuestions: [
        '¿Por qué te interesa formar parte de esta agrupación?'
      ],
      directiveLeaderId: currentUser.id
    });

    storageService.addAuditLog(
      currentUser.email,
      'Solicitud de Fundación de Club',
      newClub.name,
      'Presentación de expediente para revisión de Bienestar Estudiantil'
    );

    showToast('¡Expediente de nuevo club enviado a Bienestar Estudiantil para revisión!', 'success');
    navigate('/directorio');
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px', display: 'flex', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '780px', width: '100%', padding: '36px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
            Expediente de Fundación
          </span>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800 }}>Registrar una Nueva Agrupación Estudiantil</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Envía tu propuesta a la Dirección de Bienestar Estudiantil para su reconocimiento oficial en el campus
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Nombre Propuesto para el Club</label>
              <input
                type="text"
                placeholder="Ej. Club de Inteligencia Artificial y Ciencia de Datos"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Siglas / Acrónimo</label>
              <input
                type="text"
                placeholder="Ej. CIACD"
                maxLength={6}
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Categoría Temática</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as any })}
              >
                {categories.map((c, idx) => (
                  <option key={idx} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Lema o Frase Distintiva</label>
              <input
                type="text"
                placeholder="Ej. Innovando con algoritmos para el futuro del país"
                value={formData.tagline}
                onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descripción de la Agrupación y Objetivos</label>
            <textarea
              rows={3}
              placeholder="Detalla las actividades principales, proyectos y justificación del club..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Misión</label>
              <textarea
                rows={2}
                placeholder="Propósito central..."
                value={formData.mission}
                onChange={e => setFormData({ ...formData, mission: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Visión</label>
              <textarea
                rows={2}
                placeholder="Meta a largo plazo..."
                value={formData.vision}
                onChange={e => setFormData({ ...formData, vision: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Días Propuestos de Reunión</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
              {days.map((d, idx) => {
                const isSelected = formData.meetingDays.includes(d);
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleToggleDay(d)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--color-surface-hover)',
                      color: isSelected ? '#fff' : 'var(--color-text)',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                      cursor: 'pointer'
                    }}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Horario Tentativo</label>
              <input
                type="text"
                placeholder="Ej. 18:00 - 20:00"
                value={formData.meetingTime}
                onChange={e => setFormData({ ...formData, meetingTime: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Espacio Sugerido</label>
              <input
                type="text"
                placeholder="Ej. Pabellón V - Laboratorio 201"
                value={formData.meetingLocation}
                onChange={e => setFormData({ ...formData, meetingLocation: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }}>
            <Send size={16} />
            <span>Enviar Propuesta a Bienestar Estudiantil</span>
          </button>
        </form>
      </div>
    </div>
  );
};
