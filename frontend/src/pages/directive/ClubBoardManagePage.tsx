import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { MessageSquare, Pin, Trash2, Send, Heart, ShieldAlert } from 'lucide-react';

export const ClubBoardManagePage: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const id = clubId || 'club-robotica';
  const club = storageService.getClubById(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  if (!club) return <div className="container">Club no encontrado.</div>;

  const posts = storageService.getPostsByClubId(club.id);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !title.trim() || !content.trim()) return;

    storageService.createPost({
      clubId: club.id,
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      authorRole: 'Presidenta del Club',
      title: title.trim(),
      content: content.trim(),
      isPinned
    });

    setTitle('');
    setContent('');
    setIsPinned(false);
    showToast('¡Comunicado oficial publicado con éxito!', 'success');
  };

  const handleTogglePin = (postId: string) => {
    storageService.togglePostPin(postId);
    showToast('Estado fijado actualizado', 'info');
    window.location.reload();
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm('¿Deseas eliminar este comunicado del tablón?')) {
      storageService.deletePost(postId);
      showToast('Publicación eliminada', 'info');
      window.location.reload();
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('¿Deseas moderar y retirar este comentario inapropiado?')) {
      storageService.deleteComment(commentId);
      showToast('Comentario moderado y eliminado', 'info');
      window.location.reload();
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Gestión del Tablón y Moderación</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          Emite comunicados institucionales para los miembros del club y modera el hilo de comentarios
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '28px' }}>
        {/* Left Form: Create Official Announcement */}
        <div>
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={18} color="var(--color-primary)" />
              <span>Nuevo Comunicado</span>
            </h3>

            <form onSubmit={handleCreatePost}>
              <div className="form-group">
                <label className="form-label">Título del Comunicado</label>
                <input
                  type="text"
                  placeholder="Ej. Convocatoria para el torneo nacional..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cuerpo del Mensaje</label>
                <textarea
                  rows={5}
                  placeholder="Escribe las indicaciones, cronograma o novedades para los miembros..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                <input
                  type="checkbox"
                  id="pinToggle"
                  checked={isPinned}
                  onChange={e => setIsPinned(e.target.checked)}
                  style={{ width: 'auto' }}
                />
                <label htmlFor="pinToggle" style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--color-text)' }}>
                  📌 Fijar en la parte superior del tablón
                </label>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <Send size={15} />
                <span>Publicar Comunicado Oficial</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right List: Existing posts & moderation */}
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
            Publicaciones Activas ({posts.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {posts.map(post => {
              const comments = storageService.getCommentsByPostId(post.id);

              return (
                <div key={post.id} className="card" style={{
                  padding: '24px',
                  borderLeft: post.isPinned ? '5px solid var(--color-primary)' : '1px solid var(--color-border)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      {post.isPinned && (
                        <span className="badge badge-primary" style={{ marginBottom: '6px', fontSize: '0.72rem' }}>
                          📌 Fijado en portada
                        </span>
                      )}
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{post.title}</h4>
                      <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>
                        Publicado el {new Date(post.createdAt).toLocaleDateString()} por {post.authorName}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleTogglePin(post.id)}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                      >
                        <Pin size={12} />
                        <span>{post.isPinned ? 'Desfijar' : 'Fijar'}</span>
                      </button>

                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="btn btn-danger btn-sm"
                        style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <p style={{ color: 'var(--color-text)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '14px' }}>
                    {post.content}
                  </p>

                  {/* Comments moderation section */}
                  {comments.length > 0 && (
                    <div style={{
                      backgroundColor: 'var(--color-surface-subtle)',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      marginTop: '12px'
                    }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                        Moderación de Comentarios ({comments.length}):
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {comments.map(c => (
                          <div key={c.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: '#FFFFFF',
                            padding: '8px 12px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-border-subtle)',
                            fontSize: '0.82rem'
                          }}>
                            <div>
                              <strong>{c.authorName}:</strong> "{c.content}"
                            </div>
                            <button
                              onClick={() => handleDeleteComment(c.id)}
                              title="Moderar / Eliminar comentario"
                              style={{ color: 'var(--color-danger)', cursor: 'pointer', padding: '4px' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
