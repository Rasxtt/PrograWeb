import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { ClubCategory } from '../../types';
import { Save, CheckCircle2, Shield } from 'lucide-react';

export const ClubProfileEditPage: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const { showToast } = useToast();

  const id = clubId || 'club-robotica';
  const club = storageService.getClubById(id);

  if (!club) {
    return <div className="container" style={{ padding: '40px 0' }}>Club no encontrado.</div>;
  }

  const [formData, setFormData] = useState({
    name: club.name,
    tagline: club.tagline,
    category: club.category,
    description: club.description,
    mission: club.mission,
    vision: club.vision,
    contactEmail: club.contactEmail,
    meetingTime: club.meetingTime,
    meetingLocation: club.meetingLocation,
    instagram: club.socialLinks.instagram || '',
    linkedin: club.socialLinks.linkedin || '',
    discord: club.socialLinks.discord || ''
  });

  const categories: ClubCategory[] = ['Cultura', 'Deportes', 'Tecnología', 'Social', 'Académico', 'Arte'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = storageService.updateClub({
      ...club,
      name: formData.name,
      tagline: formData.tagline,
      category: formData.category,
      description: formData.description,
      mission: formData.mission,
      vision: formData.vision,
      contactEmail: formData.contactEmail,
      meetingTime: formData.meetingTime,
      meetingLocation: formData.meetingLocation,
      socialLinks: {
        instagram: formData.instagram,
        linkedin: formData.linkedin,
        discord: formData.discord
      }
    });

    showToast('Información general del club actualizada correctamente', 'success');
  };

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Información General del Club</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          Configura los datos institucionales visibles en la ficha pública y el directorio estudiantil
        </p>
      </div>

      <div className="card" style={{ padding: '32px', maxWidth: '820px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Nombre Oficial del Club</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

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
          </div>

          <div className="form-group">
            <label className="form-label">Lema o Frase Distintiva (Tagline)</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={e => setFormData({ ...formData, tagline: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Descripción General</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Misión</label>
              <textarea
                rows={3}
                value={formData.mission}
                onChange={e => setFormData({ ...formData, mission: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Visión</label>
              <textarea
                rows={3}
                value={formData.vision}
                onChange={e => setFormData({ ...formData, vision: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Horario de Reuniones</label>
              <input
                type="text"
                placeholder="Ej. 17:00 - 19:30"
                value={formData.meetingTime}
                onChange={e => setFormData({ ...formData, meetingTime: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ubicación / Aula / Laboratorio</label>
              <input
                type="text"
                placeholder="Ej. Edificio V - FabLab (Lab 302)"
                value={formData.meetingLocation}
                onChange={e => setFormData({ ...formData, meetingLocation: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Correo de Contacto</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Instagram Oficial</label>
              <input
                type="url"
                placeholder="https://instagram.com/..."
                value={formData.instagram}
                onChange={e => setFormData({ ...formData, instagram: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">LinkedIn / Servidor Discord</label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.linkedin || formData.discord}
                onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px' }}>
              <Save size={16} />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
