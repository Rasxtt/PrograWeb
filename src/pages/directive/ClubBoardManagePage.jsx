import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storageService } from '../../services/storageService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { ContextBar } from '../../components/layout/ContextBar.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faThumbtack,
  faComment,
  faBullhorn,
  faPaperPlane,
  faTrash,
  faClock
} from '@fortawesome/free-solid-svg-icons';

export const ClubBoardManagePage = () => {
  const { id } = useParams();
  const { currentUser, activeRole } = useAuth();
  const clubId = id || 'club-robotica';
  const club = storageService.getClubById(clubId) || storageService.getClubs()[0];

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('general'); // 'general' | 'importante' | 'urgente'
  const [isPinned, setIsPinned] = useState(false);
  const [, setRefresh] = useState(0);

  if (!club) return null;

  const isDirective = activeRole === 'directive' || activeRole === 'admin';
  const posts = storageService.getBoardPosts(club.id).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    storageService.createBoardPost({
      clubId: club.id,
      title,
      content,
      authorName: currentUser ? currentUser.fullName : 'Mesa Directiva',
      authorRole: isDirective ? 'Directiva' : 'Miembro',
      priority,
      isPinned
    });

    setTitle('');
    setContent('');
    setPriority('general');
    setIsPinned(false);
    setRefresh(r => r + 1);
  };

  const handleTogglePin = (postId) => {
    storageService.togglePinPost(postId);
    setRefresh(r => r + 1);
  };

  const handleDeletePost = (postId) => {
    if (window.confirm('¿Seguro que deseas eliminar este anuncio?')) {
      storageService.deleteBoardPost(postId);
      setRefresh(r => r + 1);
    }
  };

  return (
    <div>
      {isDirective && <ContextBar />}

      <div className="container py-4 pb-5" style={{ maxWidth: '880px' }}>
        <div className="mb-4">
          <span className="badge px-3 py-1.5 rounded-pill mb-2 fw-semibold" style={{ backgroundColor: '#F0E9F9', color: '#6B2FA8' }}>
            COMUNICACIÓN INTERNA
          </span>
          <h3 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
            Tablón de Anuncios Oficiales
          </h3>
          <p className="text-muted small mb-0">
            {club.name} — Comunicados, convocatorias internas y avisos de mesa directiva
          </p>
        </div>

        {/* CREATE POST FORM (Visible to directive) */}
        {isDirective && (
          <div
            className="card border rounded-4 p-4 mb-4 shadow-sm"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E1EE' }}
          >
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#1E1728' }}>
              <FontAwesomeIcon icon={faBullhorn} style={{ color: '#6B2FA8' }} />
              <span>Publicar Nuevo Anuncio</span>
            </h5>

            <form onSubmit={handleCreatePost}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Título del anuncio o comunicado..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <textarea
                  rows={3}
                  className="form-control"
                  placeholder="Escribe el mensaje detallado para los miembros del club..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-2 border-top">
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center gap-2">
                    <span className="small text-muted fw-semibold">Prioridad:</span>
                    <select
                      className="form-select form-select-sm"
                      style={{ width: '130px' }}
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="general">General</option>
                      <option value="importante">Importante</option>
                      <option value="urgente">Urgente</option>
                    </select>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="pinCheck"
                      checked={isPinned}
                      onChange={(e) => setIsPinned(e.target.checked)}
                    />
                    <label className="form-check-label small" htmlFor="pinCheck">
                      Fijar al inicio
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-sm rounded-pill px-4 fw-semibold d-flex align-items-center gap-2"
                  style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                  <span>Publicar anuncio</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* POSTS LIST */}
        <div className="d-flex flex-column gap-3">
          {posts.length === 0 ? (
            <div className="p-5 text-center text-muted bg-white border rounded-4 shadow-sm">
              No hay comunicados publicados en el tablón en este momento.
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="card border rounded-4 p-4 shadow-sm bg-white"
                style={{
                  borderColor: post.isPinned ? '#B5305F' : '#E6E1EE',
                  borderWidth: post.isPinned ? '2px' : '1px'
                }}
              >
                <div className="d-flex flex-wrap align-items-start justify-content-between gap-2 mb-2">
                  <div className="d-flex align-items-center gap-2">
                    {post.isPinned && (
                      <span className="badge bg-danger-subtle text-danger rounded-pill d-flex align-items-center gap-1" style={{ fontSize: '0.72rem' }}>
                        <FontAwesomeIcon icon={faThumbtack} /> Fijado
                      </span>
                    )}
                    <span
                      className={`badge rounded-pill text-uppercase fw-semibold ${
                        post.priority === 'urgente'
                          ? 'bg-danger text-white'
                          : post.priority === 'importante'
                          ? 'bg-warning text-dark'
                          : 'bg-light text-muted border'
                      }`}
                      style={{ fontSize: '0.68rem', padding: '3px 8px' }}
                    >
                      {post.priority}
                    </span>
                    <span className="small text-muted">
                      {post.authorName} · <span className="text-secondary">{post.authorRole}</span>
                    </span>
                  </div>

                  <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
                    <FontAwesomeIcon icon={faClock} className="me-1" />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h5 className="fw-bold mb-2" style={{ color: '#1E1728' }}>
                  {post.title}
                </h5>

                <p className="small text-muted mb-3" style={{ lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {post.content}
                </p>

                <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                  <Link
                    to={`/tablon/${club.id}/anuncio/${post.id}`}
                    className="btn btn-outline-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-1.5"
                    style={{ borderColor: '#6B2FA8', color: '#6B2FA8', fontSize: '0.8rem' }}
                  >
                    <FontAwesomeIcon icon={faComment} />
                    <span>{post.commentCount || 0} comentarios</span>
                  </Link>

                  {isDirective && (
                    <div className="d-flex align-items-center gap-1">
                      <button
                        type="button"
                        className="btn btn-sm btn-light rounded-circle text-muted"
                        title={post.isPinned ? 'Desfijar' : 'Fijar al inicio'}
                        onClick={() => handleTogglePin(post.id)}
                      >
                        <FontAwesomeIcon icon={faThumbtack} style={{ color: post.isPinned ? '#B5305F' : 'inherit' }} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-light rounded-circle text-danger"
                        title="Eliminar comunicado"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
