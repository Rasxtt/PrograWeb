import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { Image, Save, Sparkles } from 'lucide-react';

export const ClubImagesEditPage: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const { showToast } = useToast();

  const id = clubId || 'club-robotica';
  const club = storageService.getClubById(id);

  if (!club) return <div className="container">Club no encontrado.</div>;

  const [logoUrl, setLogoUrl] = useState(club.logoUrl);
  const [bannerUrl, setBannerUrl] = useState(club.bannerUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.updateClub({
      ...club,
      logoUrl,
      bannerUrl
    });
    showToast('Imágenes del club actualizadas exitosamente', 'success');
  };

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Imágenes e Identidad Visual</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          Configura el logotipo oficial y la imagen de portada que encabezará la ficha pública
        </p>
      </div>

      <div className="card" style={{ padding: '32px', maxWidth: '820px' }}>
        <form onSubmit={handleSubmit}>
          {/* Banner Field & Preview */}
          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label">Banner de Portada (Proporción 16:9 recomendada)</label>
            <input
              type="url"
              value={bannerUrl}
              onChange={e => setBannerUrl(e.target.value)}
              placeholder="https://..."
              required
            />
            <span className="form-hint">Resolución recomendada: 1200 x 400 px</span>

            <div style={{
              marginTop: '12px',
              height: '180px',
              borderRadius: 'var(--radius-lg)',
              backgroundImage: `url(${bannerUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '1px solid var(--color-border)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '12px',
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem'
              }}>
                Previsualización de Portada
              </div>
            </div>
          </div>

          {/* Logo Field & Preview */}
          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label">Logotipo Oficial (Proporción 1:1 cuadrada)</label>
            <input
              type="url"
              value={logoUrl}
              onChange={e => setLogoUrl(e.target.value)}
              placeholder="https://..."
              required
            />
            <span className="form-hint">Resolución recomendada: 400 x 400 px</span>

            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img
                src={logoUrl}
                alt="Logo preview"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: 'var(--radius-md)',
                  objectFit: 'cover',
                  border: '2px solid var(--color-border)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              />
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Se mostrará en el directorio de clubes y cabecera del club.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px' }}>
              <Save size={16} />
              <span>Guardar Imágenes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
