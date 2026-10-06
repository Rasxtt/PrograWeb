import React, { useState } from 'react';
import { Club } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { X, CheckCircle2, AlertCircle, Sparkles, Send, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MembershipModalProps {
  club: Club;
  onClose: () => void;
  onSuccess: () => void;
}

export const MembershipModal: React.FC<MembershipModalProps> = ({ club, onClose, onSuccess }) => {
  const { currentUser } = useAuth();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (question: string, value: string) => {
    setAnswers(prev => ({ ...prev, [question]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (currentUser.isBlocked) {
      setError(`No puedes postular a clubes: tu cuenta está temporalmente sancionada (${currentUser.blockReason}).`);
      return;
    }

    // Validate that all custom questions are answered
    if (club.customQuestions && club.customQuestions.length > 0) {
      for (const q of club.customQuestions) {
        if (!answers[q] || answers[q].trim().length < 5) {
          setError(`Por favor responde a la pregunta: "${q}" con mayor detalle.`);
          return;
        }
      }
    }

    storageService.applyToClub(club.id, currentUser.id, answers);
    onSuccess();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--color-surface-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src={club.logoUrl}
              alt={club.name}
              style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover' }}
            />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                {club.admissionType === 'open' ? 'Inscripción a' : 'Postulación a'} {club.name}
              </h3>
              <span className={`badge badge-cat-${club.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`} style={{ fontSize: '0.72rem' }}>
                {club.category}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--color-text-muted)', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          {!currentUser ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔒</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>
                Inicia sesión para postular
              </h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
                Debes identificarte con tu cuenta institucional de alumno Ulima (@aloe.ulima.edu.pe) para registrar tu solicitud.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <Link to="/login" className="btn btn-primary btn-sm">
                  <LogIn size={15} />
                  <span>Iniciar sesión</span>
                </Link>
                <Link to="/registro" className="btn btn-outline btn-sm">
                  Crear cuenta
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{
                  backgroundColor: 'var(--color-danger-soft)',
                  borderLeft: '4px solid var(--color-danger)',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-danger)',
                  fontSize: '0.85rem',
                  marginBottom: '16px'
                }}>
                  {error}
                </div>
              )}

              {/* Requirements block */}
              <div style={{
                backgroundColor: 'var(--color-surface-subtle)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                fontSize: '0.85rem'
              }}>
                <div style={{ fontWeight: 700, marginBottom: '8px', color: 'var(--color-text)' }}>
                  Requisitos de Admisión del Club:
                </div>
                <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--color-text-muted)' }}>
                  {club.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>

              {/* Custom questions form */}
              {club.customQuestions && club.customQuestions.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '12px', color: 'var(--color-primary)' }}>
                    Preguntas de Evaluación para Postulantes:
                  </div>

                  {club.customQuestions.map((q, idx) => (
                    <div key={idx} className="form-group">
                      <label className="form-label" style={{ fontSize: '0.85rem' }}>
                        {idx + 1}. {q}
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Escribe tu respuesta aquí..."
                        value={answers[q] || ''}
                        onChange={e => handleInputChange(q, e.target.value)}
                        required
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Applicant data preview */}
              <div style={{
                borderTop: '1px solid var(--color-border)',
                paddingTop: '14px',
                marginBottom: '20px',
                fontSize: '0.82rem',
                color: 'var(--color-text-muted)'
              }}>
                Postulando como: <strong>{currentUser.fullName}</strong> ({currentUser.code}) • {currentUser.career} ({currentUser.cycle}.° ciclo).
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={onClose} className="btn btn-outline btn-sm">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Send size={15} />
                  <span>{club.admissionType === 'open' ? 'Confirmar Inscripción' : 'Enviar Solicitud'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
