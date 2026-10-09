import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storageService } from '../../services/storageService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { CategoryBadge } from '../../components/common/CategoryBadge.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { ClubInitialsBadge } from '../../components/common/ClubInitialsBadge.jsx';
import { CalendarDateBadge } from '../../components/common/CalendarDateBadge.jsx';
import { MembershipModal } from '../../components/clubs/MembershipModal.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faEnvelope,
  faCalendarDays,
  faCheckCircle,
  faClock,
  faMapPin,
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons';

export const ClubDetailPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('info'); // 'info' | 'actividades' | 'directiva'
  const [isModalOpen, setIsModalOpen] = useState(false);

  const club = storageService.getClubById(id || 'club-robotica') || storageService.getClubs()[0];

  if (!club) {
    return (
      <div className="container py-5 text-center">
        <h3>Club no encontrado</h3>
        <Link to="/directorio" className="btn btn-primary rounded-pill mt-3">Volver al directorio</Link>
      </div>
    );
  }

  const membership = currentUser ? storageService.getUserMembershipInClub(currentUser.id, club.id) : null;
  const isMember = membership && membership.status === 'activo';
  const isPending = membership && membership.status === 'pendiente';

  const activities = storageService.getActivitiesByClubId(club.id).filter(a => a.status === 'publicada');
  const directiveMembers = storageService.getMembershipsByClubId(club.id).filter(m => m.roleInClub !== 'miembro' && m.status === 'activo');

  return (
    <div className="pb-5">
      {/* HERO BANNER */}
      <div
        style={{
          height: '180px',
          background:
            club.bannerPattern === 'diagonal'
              ? 'repeating-linear-gradient(45deg, #4F2280, #4F2280 25px, #6B2FA8 25px, #6B2FA8 50px)'
              : 'linear-gradient(135deg, #4F2280 0%, #6B2FA8 50%, #17A2A2 100%)',
          position: 'relative'
        }}
      />

      <div className="container" style={{ marginTop: '-60px' }}>
        {/* Main Club Header Card */}
        <div
          className="card border rounded-4 p-4 shadow-sm mb-4"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
        >
          <div className="d-flex flex-wrap align-items-start justify-content-between gap-3">
            <div className="d-flex align-items-start gap-3">
              <div style={{ marginTop: '-20px' }}>
                <ClubInitialsBadge initials={club.shortName} size={84} borderRadius="16px" />
              </div>
              <div>
                <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                  <h2 className="fw-bold mb-0" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
                    {club.name}
                  </h2>
                  <CategoryBadge category={club.category} />
                  <StatusBadge status={club.admissionType} />
                </div>
                <p className="text-muted small mb-2" style={{ fontStyle: 'italic' }}>
                  "{club.slogan || club.description}"
                </p>
                <div className="d-flex align-items-center gap-3 text-muted small">
                  <span className="d-flex align-items-center gap-1">
                    <FontAwesomeIcon icon={faUsers} style={{ color: '#6B2FA8' }} />
                    {club.memberCount || 24} miembros oficiales
                  </span>
                  <span>•</span>
                  <span>Facultad de Ingeniería y Ciencias</span>
                </div>
              </div>
            </div>

            {/* CTA Admission Button */}
            <div>
              {isMember ? (
                <div className="badge bg-success-subtle text-success p-2 px-3 rounded-pill d-flex align-items-center gap-1.5 border border-success-subtle">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <span>Eres miembro de este club</span>
                </div>
              ) : isPending ? (
                <div className="badge bg-warning-subtle text-warning p-2 px-3 rounded-pill d-flex align-items-center gap-1.5 border border-warning-subtle">
                  <FontAwesomeIcon icon={faClock} />
                  <span>Solicitud en evaluación</span>
                </div>
              ) : club.admissionType === 'cerrado' ? (
                <div className="badge bg-danger-subtle text-danger p-2 px-3 rounded-pill border border-danger-subtle">
                  Convocatoria cerrada
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2"
                  style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
                  onClick={() => setIsModalOpen(true)}
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                  <span>{club.admissionType === 'abierto' ? 'Unirme al club' : 'Solicitar ingreso'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-top mt-4 pt-3 d-flex gap-3">
            <button
              type="button"
              className={`btn btn-sm border-0 fw-semibold pb-2 px-2 rounded-0 border-bottom-2 ${
                activeTab === 'info' ? 'border-bottom border-3 border-primary text-primary' : 'text-secondary'
              }`}
              style={{
                borderColor: activeTab === 'info' ? '#6B2FA8' : 'transparent',
                color: activeTab === 'info' ? '#6B2FA8' : '#6E6580'
              }}
              onClick={() => setActiveTab('info')}
            >
              Información & Misión
            </button>
            <button
              type="button"
              className={`btn btn-sm border-0 fw-semibold pb-2 px-2 rounded-0 border-bottom-2 ${
                activeTab === 'actividades' ? 'border-bottom border-3 border-primary text-primary' : 'text-secondary'
              }`}
              style={{
                borderColor: activeTab === 'actividades' ? '#6B2FA8' : 'transparent',
                color: activeTab === 'actividades' ? '#6B2FA8' : '#6E6580'
              }}
              onClick={() => setActiveTab('actividades')}
            >
              Actividades ({activities.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm border-0 fw-semibold pb-2 px-2 rounded-0 border-bottom-2 ${
                activeTab === 'directiva' ? 'border-bottom border-3 border-primary text-primary' : 'text-secondary'
              }`}
              style={{
                borderColor: activeTab === 'directiva' ? '#6B2FA8' : 'transparent',
                color: activeTab === 'directiva' ? '#6B2FA8' : '#6E6580'
              }}
              onClick={() => setActiveTab('directiva')}
            >
              Directiva & Contacto
            </button>
          </div>
        </div>

        {/* TAB CONTENTS */}
        <div className="row g-4">
          {activeTab === 'info' && (
            <>
              <div className="col-12 col-lg-8">
                <div
                  className="card border rounded-4 p-4 shadow-sm mb-4"
                  style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
                >
                  <h5 className="fw-bold mb-3" style={{ color: '#1E1728' }}>
                    Acerca de la Agrupación
                  </h5>
                  <p className="small text-muted" style={{ lineHeight: 1.7, fontSize: '0.92rem' }}>
                    {club.detailedDescription || club.description}
                  </p>

                  <h6 className="fw-bold mt-4 mb-2" style={{ color: '#1E1728' }}>
                    Líneas de Trabajo y Proyectos
                  </h6>
                  <ul className="small text-muted ps-3 mb-0" style={{ lineHeight: 1.7 }}>
                    <li>Desarrollo de prototipos tecnológicos y circuitos electrónicos.</li>
                    <li>Preparación para competencias nacionales e internacionales.</li>
                    <li>Talleres de capacitación abiertos para la comunidad estudiantil.</li>
                    <li>Visitas técnicas a laboratorios y centros de investigación.</li>
                  </ul>
                </div>
              </div>

              <div className="col-12 col-lg-4">
                <div
                  className="card border rounded-4 p-4 shadow-sm mb-4"
                  style={{ backgroundColor: '#FBFAFD', borderColor: '#E6E1EE' }}
                >
                  <h6 className="fw-bold mb-3" style={{ color: '#1E1728' }}>
                    Requisitos de Postulación
                  </h6>
                  <p className="small text-muted mb-3">
                    {club.applicantMessage || 'Convocatoria abierta para estudiantes de la Universidad de Lima.'}
                  </p>
                  <div className="small text-muted mb-1"><strong>Carreras afines:</strong> {club.targetCareers || 'Todas las carreras'}</div>
                  <div className="small text-muted"><strong>Dedicación:</strong> 3-4 horas a la semana</div>
                </div>

                <div
                  className="card border rounded-4 p-4 shadow-sm"
                  style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
                >
                  <h6 className="fw-bold mb-3" style={{ color: '#1E1728' }}>
                    Canales Oficiales
                  </h6>
                  <ul className="list-unstyled d-flex flex-column gap-2 small mb-0">
                    <li className="d-flex align-items-center gap-2">
                      <FontAwesomeIcon icon={faEnvelope} style={{ color: '#6B2FA8' }} />
                      <span>{club.slug}@aloe.ulima.edu.pe</span>
                    </li>
                    {club.socialLinks?.instagram && (
                      <li className="text-muted">
                        Instagram: <span className="fw-semibold text-dark">{club.socialLinks.instagram}</span>
                      </li>
                    )}
                    {club.socialLinks?.linkedin && (
                      <li className="text-muted">
                        LinkedIn: <span className="fw-semibold text-dark">{club.socialLinks.linkedin}</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </>
          )}

          {activeTab === 'actividades' && (
            <div className="col-12">
              <div className="row g-3">
                {activities.length === 0 ? (
                  <div className="col-12 text-center py-5 text-muted">
                    No hay actividades programadas próximamente para este club.
                  </div>
                ) : (
                  activities.map((act) => (
                    <div key={act.id} className="col-12 col-md-6 col-lg-4">
                      <div
                        className="card h-100 border rounded-3 p-3 shadow-sm d-flex flex-column"
                        style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
                      >
                        <div className="d-flex align-items-start gap-3 mb-2">
                          <CalendarDateBadge dateString={act.date} />
                          <div className="flex-grow-1">
                            <h6 className="fw-bold mb-1" style={{ color: '#1E1728' }}>
                              {act.title}
                            </h6>
                            <span className="small text-muted d-flex align-items-center gap-1">
                              <FontAwesomeIcon icon={faMapPin} style={{ fontSize: '0.75rem', color: '#6B2FA8' }} />
                              {act.location}
                            </span>
                          </div>
                        </div>

                        <p className="text-muted small flex-grow-1 mb-3" style={{ fontSize: '0.82rem' }}>
                          {act.description}
                        </p>

                        <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                          <span className="small text-muted">
                            Cupos: {act.registeredCount}/{act.capacity}
                          </span>
                          <Link
                            to={`/actividad/${act.id}`}
                            className="btn btn-outline-primary btn-sm rounded-pill px-3"
                            style={{ borderColor: '#6B2FA8', color: '#6B2FA8', fontSize: '0.78rem' }}
                          >
                            Ver detalle
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'directiva' && (
            <div className="col-12">
              <div
                className="card border rounded-4 p-4 shadow-sm"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
              >
                <h5 className="fw-bold mb-3" style={{ color: '#1E1728' }}>
                  Mesa Directiva del Periodo 2026-2
                </h5>
                <div className="row g-3">
                  {directiveMembers.length === 0 ? (
                    <div className="col-12 text-muted small">No se registran cargos asignados actualmente.</div>
                  ) : (
                    directiveMembers.map((m) => (
                      <div key={m.id} className="col-12 col-sm-6 col-md-4">
                        <div className="border rounded-3 p-3 bg-light">
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                              style={{ width: '42px', height: '42px', backgroundColor: '#6B2FA8' }}
                            >
                              {m.userName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                            </div>
                            <div>
                              <div className="fw-bold small" style={{ color: '#1E1728' }}>{m.userName}</div>
                              <span className="badge bg-secondary-subtle text-secondary text-capitalize" style={{ fontSize: '0.7rem' }}>
                                {m.roleInClub}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <MembershipModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        club={club}
        onSuccess={() => setIsModalOpen(false)}
      />
    </div>
  );
};
