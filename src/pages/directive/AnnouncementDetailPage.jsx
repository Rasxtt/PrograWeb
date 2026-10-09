import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storageService } from '../../services/storageService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faComment,
  faPaperPlane,
  faTrash,
  faClock,
  faThumbtack
} from '@fortawesome/free-solid-svg-icons';

export const AnnouncementDetailPage = () => {
  const { clubId, postId } = useParams();
  const { currentUser, activeRole } = useAuth();

  const club = storageService.getClubById(clubId || 'club-robotica') || storageService.getClubs()[0];
  const post = storageService.getBoardPostById(postId || 'post-1') || storageService.getBoardPosts()[0];

  const [commentText, setCommentText] = useState('');
  const [, setRefresh] = useState(0);

  if (!post || !club) return null;

  const comments = storageService.getCommentsByPostId(post.id);
  const isDirective = activeRole === 'directive' || activeRole === 'admin';

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    storageService.addComment({
      postId: post.id,
      userId: currentUser ? currentUser.id : 'user-anon',
      userName: currentUser ? currentUser.fullName : 'Estudiante Ulima',
      userRole: isDirective ? 'Directiva' : 'Estudiante',
      content: commentText.trim()
    });

    setCommentText('');
    setRefresh(r => r + 1);
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('¿Seguro que deseas eliminar este comentario?')) {
      storageService.deleteComment(commentId);
      setRefresh(r => r + 1);
    }
  };

  return (
    <div className="container py-4 pb-5" style={{ maxWidth: '820px' }}>
      <div className="mb-3">
        <Link
          to={`/tablon/${club.id}`}
          className="text-decoration-none small text-muted d-inline-flex align-items-center gap-1.5"
        >
          <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '0.75rem' }} />
          <span>Volver al tablón del {club.name}</span>
        </Link>
      </div>

      {/* ANNOUNCEMENT CARD */}
      <div
        className="card border rounded-4 p-4 shadow-sm bg-white mb-4"
        style={{ borderColor: post.isPinned ? '#B5305F' : '#E6E1EE' }}
      >
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
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

        <h4 className="fw-bold mb-2" style={{ fontFamily: "'Outfit', sans-serif", color: '#1E1728' }}>
          {post.title}
        </h4>

        <p className="small text-muted mb-0" style={{ lineHeight: 1.7, fontSize: '0.92rem', whiteSpace: 'pre-line' }}>
          {post.content}
        </p>
      </div>

      {/* COMMENTS SECTION (Mockup 6.2) */}
      <div
        className="card border rounded-4 p-4 shadow-sm bg-white"
        style={{ borderColor: '#E6E1EE' }}
      >
        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#1E1728' }}>
          <FontAwesomeIcon icon={faComment} style={{ color: '#6B2FA8' }} />
          <span>Comentarios ({comments.length})</span>
        </h5>

        {/* Comment input form */}
        <form onSubmit={handleAddComment} className="mb-4">
          <div className="mb-2">
            <textarea
              rows={2}
              className="form-control form-control-sm"
              placeholder="Escribe una consulta o comentario para la directiva..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            />
          </div>
          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary btn-sm rounded-pill px-4 fw-semibold d-flex align-items-center gap-1.5"
              style={{ backgroundColor: '#6B2FA8', borderColor: '#6B2FA8' }}
            >
              <FontAwesomeIcon icon={faPaperPlane} style={{ fontSize: '0.75rem' }} />
              <span>Publicar comentario</span>
            </button>
          </div>
        </form>

        {/* Comment Thread */}
        <div className="d-flex flex-column gap-3">
          {comments.length === 0 ? (
            <div className="text-center py-4 text-muted small">
              Aún no hay comentarios en este anuncio. Sé el primero en opinar.
            </div>
          ) : (
            comments.map((comm) => {
              const canDelete = isDirective || (currentUser && currentUser.id === comm.userId);

              return (
                <div key={comm.id} className="p-3 rounded-3 bg-light border position-relative">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                        style={{ width: '28px', height: '28px', backgroundColor: '#6B2FA8', fontSize: '0.72rem' }}
                      >
                        {comm.userName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <span className="fw-semibold small" style={{ color: '#1E1728' }}>
                          {comm.userName}
                        </span>
                        <span className="badge bg-secondary-subtle text-secondary ms-1.5" style={{ fontSize: '0.65rem' }}>
                          {comm.userRole}
                        </span>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                        {new Date(comm.createdAt).toLocaleDateString()}
                      </span>
                      {canDelete && (
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-danger p-0"
                          title="Eliminar comentario"
                          onClick={() => handleDeleteComment(comm.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} style={{ fontSize: '0.75rem' }} />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="small text-muted mb-0 ps-4" style={{ fontSize: '0.84rem' }}>
                    {comm.content}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
