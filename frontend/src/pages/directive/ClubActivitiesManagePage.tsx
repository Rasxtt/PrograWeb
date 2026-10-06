import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { Activity, ActivityModality, ClubCategory } from '../../types';
import {
  Calendar,
  Clock,
  Plus,
  Users,
  FileSpreadsheet,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye
} from 'lucide-react';

export const ClubActivitiesManagePage: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const { showToast } = useToast();

  const id = clubId || 'club-robotica';
  const club = storageService.getClubById(id);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '17:00',
    endTime: '19:00',
    location: 'Campus Monterrico - Laboratorio FabLab',
    modality: 'Presencial' as ActivityModality,
    capacity: 30,
    tags: 'Taller, Robótica'
  });

  if (!club) return <div className="container">Club no encontrado.</div>;

  const activities = storageService.getActivitiesByClubId(club.id);

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();

    storageService.createActivity({
      clubId: club.id,
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: club.category,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: formData.location.trim(),
      modality: formData.modality,
      capacity: Number(formData.capacity),
      status: 'scheduled',
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    });

    showToast('¡Nueva actividad creada y publicada en la cartelera!', 'success');
    setShowCreateModal(false);
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '17:00',
      endTime: '19:00',
      location: 'Campus Monterrico - Laboratorio FabLab',
      modality: 'Presencial',
      capacity: 30,
      tags: 'Taller, Innovación'
    });
  };

  const handleCancelActivity = (actId: string, title: string) => {
    if (window.confirm(`¿Estás seguro de que deseas cancelar "${title}"?`)) {
      const act = storageService.getActivityById(actId);
      if (act) {
        act.status = 'cancelled';
        storageService.updateActivity(act);
        showToast('Actividad cancelada', 'info');
      }
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Gestión de Actividades del Club</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Programa talleres, torneos y registra la asistencia de los alumnos inscritos
          </p>
        </div>

        <button onClick={() => setShowCreateModal(true)} className="btn btn-primary" style={{ gap: '8px' }}>
          <Plus size={16} />
          <span>Crear Nueva Actividad</span>
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>
            No has programado ninguna actividad para este club todavía.
          </p>
          <button onClick={() => setShowCreateModal(true)} className="btn btn-primary btn-sm">
            Crear la primera actividad
          </button>
        </div>
      ) : (
        <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface-subtle)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '14px 20px' }}>Actividad</th>
                <th style={{ padding: '14px 20px' }}>Fecha y Horario</th>
                <th style={{ padding: '14px 20px' }}>Modalidad</th>
                <th style={{ padding: '14px 20px' }}>Inscritos / Aforo</th>
                <th style={{ padding: '14px 20px' }}>Estado</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {activities.map(act => {
                const spotsLeft = act.capacity - act.enrolledCount;
                return (
                  <tr key={act.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{act.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>📍 {act.location}</div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div>{act.date}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{act.startTime} - {act.endTime} hrs</div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span className="badge badge-info">{act.modality}</span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: 700 }}>{act.enrolledCount} / {act.capacity}</div>
                      <div style={{ fontSize: '0.72rem', color: spotsLeft <= 0 ? 'var(--color-warning)' : 'var(--color-success)' }}>
                        {spotsLeft <= 0 ? 'Cupos llenos' : `${spotsLeft} disponibles`}
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span className={`badge ${act.status === 'scheduled' ? 'badge-success' : act.status === 'completed' ? 'badge-info' : 'badge-danger'}`}>
                        {act.status === 'scheduled' ? 'Programada' : act.status === 'completed' ? 'Finalizada' : 'Cancelada'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <Link
                          to={`/gestion-club/${club.id}/actividades/${act.id}/asistencia`}
                          className="btn btn-secondary btn-sm"
                          style={{ gap: '6px' }}
                          title="Control de Asistencia"
                        >
                          <FileSpreadsheet size={14} />
                          <span>Asistencia</span>
                        </Link>

                        <Link to={`/actividades/${act.id}`} className="btn btn-outline btn-sm" title="Ver en cartelera">
                          <Eye size={14} />
                        </Link>

                        {act.status === 'scheduled' && (
                          <button
                            onClick={() => handleCancelActivity(act.id, act.title)}
                            className="btn btn-outline btn-sm"
                            style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                            title="Cancelar actividad"
                          >
                            <XCircle size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE ACTIVITY MODAL */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>
              Crear Nueva Actividad para {club.name}
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.86rem', marginBottom: '20px' }}>
              El evento se publicará inmediatamente en la cartelera general de Vida Universitaria.
            </p>

            <form onSubmit={handleCreateActivity}>
              <div className="form-group">
                <label className="form-label">Título de la Actividad</label>
                <input
                  type="text"
                  placeholder="Ej. Taller de Impresión 3D y Corte Láser"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descripción Detallada</label>
                <textarea
                  rows={3}
                  placeholder="Explica de qué trata la actividad, requerimientos previos y temas a abordar..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Fecha</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Hora Inicio</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Hora Fin</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Modalidad</label>
                  <select
                    value={formData.modality}
                    onChange={e => setFormData({ ...formData, modality: e.target.value as any })}
                  >
                    <option value="Presencial">Presencial</option>
                    <option value="Virtual">Virtual</option>
                    <option value="Híbrida">Híbrida</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Aforo Máximo (Cupos)</label>
                  <input
                    type="number"
                    min={5}
                    max={500}
                    value={formData.capacity}
                    onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Ubicación / Sala / Enlace</label>
                <input
                  type="text"
                  placeholder="Ej. Pabellón V - FabLab (Lab 302) o Enlace Teams"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Etiquetas (separadas por coma)</label>
                <input
                  type="text"
                  placeholder="Ej. Arduino, Taller, FabLab"
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-outline btn-sm">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Publicar en Cartelera
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
