import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { Save, Plus, Trash2, HelpCircle } from 'lucide-react';

export const ClubAdmissionEditPage: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const { showToast } = useToast();

  const id = clubId || 'club-robotica';
  const club = storageService.getClubById(id);

  if (!club) return <div className="container">Club no encontrado.</div>;

  const [admissionType, setAdmissionType] = useState(club.admissionType);
  const [requirements, setRequirements] = useState<string[]>(club.requirements || []);
  const [newRequirement, setNewRequirement] = useState('');
  const [customQuestions, setCustomQuestions] = useState<string[]>(club.customQuestions || []);
  const [newQuestion, setNewQuestion] = useState('');

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      setCustomQuestions([...customQuestions, newQuestion.trim()]);
      setNewQuestion('');
    }
  };

  const handleRemoveQuestion = (index: number) => {
    setCustomQuestions(customQuestions.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.updateClub({
      ...club,
      admissionType,
      requirements,
      customQuestions
    });
    showToast('Configuración de admisión actualizada exitosamente', 'success');
  };

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Modalidad de Ingreso y Requisitos</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          Define el proceso de convocatoria, requisitos para postulantes y preguntas personalizadas
        </p>
      </div>

      <div className="card" style={{ padding: '32px', maxWidth: '820px' }}>
        <form onSubmit={handleSubmit}>
          {/* Admission Type Selector */}
          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label">Tipo de Convocatoria</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginTop: '6px' }}>
              {[
                { id: 'open', title: 'Ingreso Libre', desc: 'Los estudiantes se integran de forma inmediata sin revisión.' },
                { id: 'application', title: 'Por Postulación', desc: 'El comité evalúa el perfil y respuestas antes de admitir.' },
                { id: 'limited', title: 'Cupo Limitado', desc: 'Convocatoria con prueba técnica o vacantes restringidas.' }
              ].map(opt => (
                <div
                  key={opt.id}
                  onClick={() => setAdmissionType(opt.id as any)}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid',
                    borderColor: admissionType === opt.id ? 'var(--color-primary)' : 'var(--color-border)',
                    backgroundColor: admissionType === opt.id ? 'var(--color-primary-soft)' : 'var(--color-surface)',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: admissionType === opt.id ? 'var(--color-primary)' : 'var(--color-text)' }}>
                    {opt.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    {opt.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements List Editor */}
          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label">Requisitos de Membresía</label>
            <span className="form-hint" style={{ marginBottom: '10px', display: 'block' }}>
              Los requisitos que debe cumplir el alumno para postular:
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
              {requirements.map((req, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-surface-subtle)',
                  border: '1px solid var(--color-border-subtle)',
                  fontSize: '0.86rem'
                }}>
                  <span>• {req}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(idx)}
                    style={{ color: 'var(--color-danger)', padding: '4px' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Agregar nuevo requisito..."
                value={newRequirement}
                onChange={e => setNewRequirement(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRequirement();
                  }
                }}
              />
              <button type="button" onClick={handleAddRequirement} className="btn btn-secondary">
                <Plus size={16} />
                <span>Agregar</span>
              </button>
            </div>
          </div>

          {/* Custom Questions Editor */}
          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label">Preguntas de Formulario para Postulantes</label>
            <span className="form-hint" style={{ marginBottom: '10px', display: 'block' }}>
              Preguntas que responderá el estudiante al enviar su postulación:
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
              {customQuestions.map((q, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-surface-subtle)',
                  border: '1px solid var(--color-border-subtle)',
                  fontSize: '0.86rem'
                }}>
                  <span><strong>{idx + 1}.</strong> {q}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(idx)}
                    style={{ color: 'var(--color-danger)', padding: '4px' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Ej. ¿En qué proyectos o tecnologías te gustaría participar?..."
                value={newQuestion}
                onChange={e => setNewQuestion(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddQuestion();
                  }
                }}
              />
              <button type="button" onClick={handleAddQuestion} className="btn btn-secondary">
                <Plus size={16} />
                <span>Agregar</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px' }}>
              <Save size={16} />
              <span>Guardar Configuración de Ingreso</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
