import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  Calendar,
  Clock,
  MapPin,
  Mail,
  MessageSquare,
  Award,
  CheckCircle2,
  Share2,
  Globe,
  ExternalLink,
  ChevronRight,
  Shield,
  Heart,
  Pin,
  Send
} from 'lucide-react';
import { MembershipModal } from '../../components/clubs/MembershipModal';

export const ClubDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, activeRole } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'info' | 'activities' | 'members' | 'board'>('info');
  const [showApplyModal, setShowApplyModal] = useState(false);

  // New comment input per post
  const [newComments, setNewComments] = useState<Record<string, string>>({});
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');

  const club = id ? storageService.getClubById(id) : undefined;

  if (!club) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Club no encontrado</h2>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '8px', marginBottom: '20px' }}>
          El club solicitado no existe o ha sido retirado temporalmente.
        </p>
        <Link to="/directorio" className="btn btn-primary">
          Regresar al Directorio
        </Link>
      </div>
    );
  }

  const activities = storageService.getActivitiesByClubId(club.id);
  const memberships = storageService.getMembershipsByClubId(club.id).filter(m => m.status === 'accepted');
  const boardPosts = storageService.getPostsByClubId(club.id);

  // Current user membership in this club
  const currentMembership = currentUser
    ? storageService.getMembershipsByUserId(currentUser.id).find(m => m.clubId === club.id)
    : null;

  const isMember = currentMembership?.status === 'accepted';
  const isPending = currentMembership?.status === 'pending';
  const isClubLeader = currentUser && (club.directiveLeaderId === currentUser.id || currentUser.managedClubId === club.id);

  const handleLikePost = (postId: string) => {
    if (!currentUser) {
      showToast('Inicia sesión para interactuar con las publicaciones', 'info');
      return;
    }
    storageService.togglePostLike(postId, currentUser.id);
    navigate('.', { replace: true }); // refresh
  };

  const handleAddComment = (postId: string) => {
    if (!currentUser) {
      showToast('Inicia sesión para comentar', 'info');
      return;
    }
    const content = newComments[postId];
    if (!content || !content.trim()) return;

    storageService.addComment({
      postId,
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      authorAvatar: currentUser.avatarUrl,
      content: content.trim()
    });

    setNewComments(prev => ({ ...prev, [postId]: '' }));
    showToast('Comentario publicado', 'success');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newPostTitle.trim() || !newPostContent.trim()) return;

    storageService.createPost({
      clubId: club.id,
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      authorRole: isClubLeader ? 'Presidenta del Club' : 'Miembro Activo',
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      isPinned: false
    });

    setNewPostTitle('');
    setNewPostContent('');
    showToast('¡Publicación agregada al tablón!', 'success');
  };

  const handleTogglePin = (postId: string) => {
    storageService.togglePostPin(postId);
    showToast('Estado fijado actualizado', 'info');
    navigate('.', { replace: true });
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', paddingBottom: '60px' }}>
      {/* HERO BANNER */}
      <div style={{
        height: '280px',
        backgroundImage: `url(${club.bannerUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(30, 23, 40, 0.9) 0%, rgba(30, 23, 40, 0.4) 100%)'
        }} />
      </div>

      {/* HEADER PROFILE BAR */}
      <div className="container" style={{ position: 'relative', marginTop: '-70px', marginBottom: '28px' }}>
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <img
                src={club.logoUrl}
                alt={club.name}
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: 'var(--radius-lg)',
                  border: '4px solid #fff',
                  boxShadow: 'var(--shadow-md)',
                  objectFit: 'cover'
                }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{club.name}</h1>
                  <span className={`badge badge-cat-${club.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}>
                    {club.category}
                  </span>
                </div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginTop: '4px' }}>
                  "{club.tagline}"
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '10px', fontSize: '0.82rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={14} color="var(--color-primary)" /> {club.memberCount} miembros
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} color="var(--color-primary)" /> {club.meetingDays.join(', ')} ({club.meetingTime})
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} color="var(--color-primary)" /> {club.meetingLocation}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              {isClubLeader ? (
                <Link to={`/gestion-club/${club.id}/perfil`} className="btn btn-secondary">
                  <Shield size={16} />
                  <span>Gestionar mi Club</span>
                </Link>
              ) : isMember ? (
                <span className="badge badge-success" style={{ padding: '10px 18px', fontSize: '0.9rem' }}>
                  <CheckCircle2 size={16} />
                  <span>Eres miembro activo</span>
                </span>
              ) : isPending ? (
                <span className="badge badge-warning" style={{ padding: '10px 18px', fontSize: '0.9rem' }}>
                  <span>⏳ Postulación en revisión</span>
                </span>
              ) : (
                <button onClick={() => setShowApplyModal(true)} className="btn btn-primary">
                  {club.admissionType === 'open' ? 'Unirme al Club' : 'Postular al Club'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="container" style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: '2px'
        }}>
          {[
            { id: 'info', label: 'Sobre el club' },
            { id: 'activities', label: `Actividades (${activities.length})` },
            { id: 'members', label: `Miembros (${memberships.length})` },
            { id: 'board', label: `Tablón Social (${boardPosts.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '10px 20px',
                fontSize: '0.92rem',
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderBottom: activeTab === tab.id ? '3px solid var(--color-primary)' : '3px solid transparent',
                borderRadius: '6px 6px 0 0',
                transition: 'var(--transition)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENTS */}
      <div className="container">
        {/* TAB 1: SOBRE EL CLUB */}
        {activeTab === 'info' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>
                  Descripción de la Agrupación
                </h3>
                <p style={{ color: 'var(--color-text)', lineHeight: 1.7, fontSize: '0.94rem' }}>
                  {club.description}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="card" style={{ padding: '20px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--color-primary)' }}>
                    Misión
                  </h4>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                    {club.mission}
                  </p>
                </div>

                <div className="card" style={{ padding: '20px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--color-primary)' }}>
                    Visión
                  </h4>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                    {club.vision}
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar with Requirements & Contact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="card" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
                  Requisitos de Admisión
                </h4>
                <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  {club.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
                  Contacto y Canales
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)' }}>
                    <Mail size={16} color="var(--color-primary)" />
                    <span>{club.contactEmail}</span>
                  </div>
                  {club.socialLinks.instagram && (
                    <a href={club.socialLinks.instagram} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)' }}>
                      <Globe size={16} color="#E1306C" />
                      <span>Instagram Oficial</span>
                    </a>
                  )}
                  {club.socialLinks.linkedin && (
                    <a href={club.socialLinks.linkedin} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)' }}>
                      <Share2 size={16} color="#0A66C2" />
                      <span>LinkedIn / Redes</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVIDADES */}
        {activeTab === 'activities' && (
          <div>
            {activities.length === 0 ? (
              <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                <p style={{ color: 'var(--color-text-muted)' }}>Este club aún no ha programado actividades para el ciclo actual.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {activities.map(act => (
                  <div key={act.id} className="card card-hover" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span className="badge badge-primary">{act.modality}</span>
                      <span className="badge badge-success">{act.capacity - act.enrolledCount} vacantes libres</span>
                    </div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>{act.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '14px', flex: 1 }}>
                      {act.description}
                    </p>
                    <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '14px' }}>
                      📅 {act.date} • {act.startTime} hrs | 📍 {act.location}
                    </div>
                    <Link to={`/actividades/${act.id}`} className="btn btn-primary btn-sm">
                      Ver Detalles e Inscribirme
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MIEMBROS */}
        {activeTab === 'members' && (
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '18px' }}>
              Directiva y Miembros Activos ({memberships.length})
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              {memberships.map(mem => {
                const user = storageService.getUserById(mem.userId);
                if (!user) return null;
                const isLeader = mem.roleInClub === 'Presidente';
                return (
                  <div key={mem.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: isLeader ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: isLeader ? 'var(--color-primary-soft)' : 'var(--color-surface)'
                  }}>
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user.career}</div>
                      <span className={`badge ${isLeader ? 'badge-primary' : 'badge-info'}`} style={{ fontSize: '0.7rem', marginTop: '4px' }}>
                        {mem.roleInClub}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: TABLÓN SOCIAL (HU-6) */}
        {activeTab === 'board' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Box to create new announcement (if member or directive) */}
              {(isMember || isClubLeader) && (
                <div className="card" style={{ padding: '20px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MessageSquare size={16} color="var(--color-primary)" />
                    <span>Publicar en el Tablón del Club</span>
                  </h4>
                  <form onSubmit={handleCreatePost}>
                    <input
                      type="text"
                      placeholder="Título del comunicado o anuncio..."
                      value={newPostTitle}
                      onChange={e => setNewPostTitle(e.target.value)}
                      style={{ marginBottom: '10px' }}
                      required
                    />
                    <textarea
                      rows={3}
                      placeholder="Comparte novedades, convocatorias internas o avances de proyectos con el club..."
                      value={newPostContent}
                      onChange={e => setNewPostContent(e.target.value)}
                      style={{ marginBottom: '12px' }}
                      required
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button type="submit" className="btn btn-primary btn-sm">
                        <Send size={14} />
                        <span>Publicar</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Feed of posts */}
              {boardPosts.length === 0 ? (
                <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                  <p style={{ color: 'var(--color-text-muted)' }}>No hay publicaciones en el tablón todavía.</p>
                </div>
              ) : (
                boardPosts.map(post => {
                  const comments = storageService.getCommentsByPostId(post.id);
                  const isLiked = currentUser ? post.likedBy.includes(currentUser.id) : false;

                  return (
                    <div key={post.id} className="card" style={{
                      padding: '24px',
                      borderLeft: post.isPinned ? '5px solid var(--color-primary)' : '1px solid var(--color-border)'
                    }}>
                      {/* Post Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          {post.isPinned && (
                            <span className="badge badge-primary" style={{ marginBottom: '6px', fontSize: '0.72rem' }}>
                              <Pin size={11} /> Fijado por Directiva
                            </span>
                          )}
                          <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text)' }}>
                            {post.title}
                          </h4>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                            Por <strong>{post.authorName}</strong> ({post.authorRole}) • {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        {/* Directiva Pin Control */}
                        {isClubLeader && (
                          <button
                            onClick={() => handleTogglePin(post.id)}
                            className="btn btn-outline btn-sm"
                            style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                          >
                            <Pin size={12} />
                            <span>{post.isPinned ? 'Desfijar' : 'Fijar'}</span>
                          </button>
                        )}
                      </div>

                      {/* Content */}
                      <p style={{ color: 'var(--color-text)', lineHeight: 1.6, fontSize: '0.92rem', marginBottom: '16px' }}>
                        {post.content}
                      </p>

                      {/* Interactions bar */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        borderTop: '1px solid var(--color-border-subtle)',
                        paddingTop: '12px',
                        marginBottom: '16px',
                        fontSize: '0.85rem'
                      }}>
                        <button
                          onClick={() => handleLikePost(post.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: isLiked ? 'var(--color-danger)' : 'var(--color-text-muted)',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <Heart size={16} fill={isLiked ? 'var(--color-danger)' : 'none'} />
                          <span>{post.likesCount} Me gusta</span>
                        </button>
                        <span style={{ color: 'var(--color-text-muted)' }}>
                          💬 {comments.length} comentarios
                        </span>
                      </div>

                      {/* Comments List */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: 'var(--color-surface-subtle)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                        {comments.map(c => (
                          <div key={c.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <img
                              src={c.authorAvatar}
                              alt={c.authorName}
                              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div style={{ flex: 1, backgroundColor: '#FFFFFF', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-subtle)' }}>
                              <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--color-text)' }}>
                                {c.authorName}
                              </div>
                              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                                {c.content}
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Add Comment Input */}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                          <input
                            type="text"
                            placeholder="Escribe un comentario..."
                            value={newComments[post.id] || ''}
                            onChange={e => setNewComments({ ...newComments, [post.id]: e.target.value })}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddComment(post.id);
                              }
                            }}
                            style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="btn btn-primary btn-sm"
                          >
                            <Send size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Sidebar Guidelines */}
            <div className="card" style={{ padding: '20px', height: 'fit-content' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px' }}>
                Normas de Convivencia en el Tablón
              </h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '12px' }}>
                Este espacio es de uso exclusivo para coordinaciones y consultas de los miembros del club. Se exige respeto mutuo y cumplimiento del Código de Ética Ulima.
              </p>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                Moderado por la Directiva del Club y Bienestar Estudiantil.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Membership Modal */}
      {showApplyModal && (
        <MembershipModal
          club={club}
          onClose={() => setShowApplyModal(false)}
          onSuccess={() => {
            setShowApplyModal(false);
            showToast('¡Tu postulación ha sido registrada con éxito!', 'success');
            navigate('.', { replace: true });
          }}
        />
      )}
    </div>
  );
};
