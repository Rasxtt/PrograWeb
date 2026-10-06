import seedData from '../data/seedData.json';
import {
  User,
  Club,
  Membership,
  Activity,
  Registration,
  BoardPost,
  PostComment,
  UserNotification,
  AdminAuditLog,
  ClubStatus,
  MembershipStatus,
  AttendanceStatus,
  RoleInClub
} from '../types';

const STORAGE_KEYS = {
  USERS: 'vu_ulima_users',
  CURRENT_USER: 'vu_ulima_current_user',
  CLUBS: 'vu_ulima_clubs',
  MEMBERSHIPS: 'vu_ulima_memberships',
  ACTIVITIES: 'vu_ulima_activities',
  REGISTRATIONS: 'vu_ulima_registrations',
  BOARD_POSTS: 'vu_ulima_board_posts',
  POST_COMMENTS: 'vu_ulima_post_comments',
  NOTIFICATIONS: 'vu_ulima_notifications',
  AUDIT_LOGS: 'vu_ulima_audit_logs',
  INITIALIZED: 'vu_ulima_initialized_v1'
};

export const storageService = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      this.resetToSeed();
    }
  },

  resetToSeed() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(seedData.users));
    localStorage.setItem(STORAGE_KEYS.CLUBS, JSON.stringify(seedData.clubs));
    localStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify(seedData.memberships));
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(seedData.activities));
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(seedData.registrations));
    localStorage.setItem(STORAGE_KEYS.BOARD_POSTS, JSON.stringify(seedData.boardPosts));
    localStorage.setItem(STORAGE_KEYS.POST_COMMENTS, JSON.stringify(seedData.postComments));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(seedData.notifications));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(seedData.auditLogs));
    
    // Default current user: Camila (Estudiante)
    const defaultUser = seedData.users.find(u => u.id === 'user-camila');
    if (defaultUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(defaultUser));
    }
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  },

  // USERS
  getUsers(): User[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  getUserById(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  },

  getUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  updateUser(user: User): User {
    const users = this.getUsers().map(u => (u.id === user.id ? user : u));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    const current = this.getCurrentUser();
    if (current && current.id === user.id) {
      this.setCurrentUser(user);
    }
    return user;
  },

  createUser(userData: Omit<User, 'id'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return newUser;
  },

  setUserBlockStatus(userId: string, isBlocked: boolean, reason?: string, adminEmail?: string): User | null {
    const user = this.getUserById(userId);
    if (!user) return null;
    user.isBlocked = isBlocked;
    user.blockReason = isBlocked ? (reason || 'Sanción disciplinaria administrativa') : undefined;
    this.updateUser(user);

    if (adminEmail) {
      this.addAuditLog(
        adminEmail,
        isBlocked ? 'Bloqueo de Cuenta' : 'Desbloqueo de Cuenta',
        `${user.fullName} (${user.email})`,
        reason
      );
    }
    return user;
  },

  // CURRENT USER SESSION
  getCurrentUser(): User | null {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  // CLUBS
  getClubs(): Club[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.CLUBS);
    return data ? JSON.parse(data) : [];
  },

  getClubById(id: string): Club | undefined {
    return this.getClubs().find(c => c.id === id);
  },

  updateClub(club: Club): Club {
    const clubs = this.getClubs().map(c => (c.id === club.id ? club : c));
    localStorage.setItem(STORAGE_KEYS.CLUBS, JSON.stringify(clubs));
    return club;
  },

  createClub(clubData: Omit<Club, 'id' | 'memberCount'>): Club {
    const clubs = this.getClubs();
    const newClub: Club = {
      ...clubData,
      id: `club-${Date.now()}`,
      memberCount: 1
    };
    clubs.push(newClub);
    localStorage.setItem(STORAGE_KEYS.CLUBS, JSON.stringify(clubs));
    return newClub;
  },

  updateClubStatus(clubId: string, status: ClubStatus, adminEmail?: string, reason?: string): Club | null {
    const club = this.getClubById(clubId);
    if (!club) return null;
    club.status = status;
    this.updateClub(club);

    if (adminEmail) {
      this.addAuditLog(
        adminEmail,
        `Cambio Estado de Club a '${status}'`,
        club.name,
        reason
      );
    }
    return club;
  },

  // MEMBERSHIPS
  getMemberships(): Membership[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.MEMBERSHIPS);
    return data ? JSON.parse(data) : [];
  },

  getMembershipsByUserId(userId: string): Membership[] {
    return this.getMemberships().filter(m => m.userId === userId);
  },

  getMembershipsByClubId(clubId: string): Membership[] {
    return this.getMemberships().filter(m => m.clubId === clubId);
  },

  applyToClub(clubId: string, userId: string, answers?: Record<string, string>): Membership {
    const memberships = this.getMemberships();
    const existing = memberships.find(m => m.clubId === clubId && m.userId === userId);
    if (existing) {
      if (existing.status === 'rejected') {
        existing.status = 'pending';
        existing.appliedAt = new Date().toISOString();
        existing.answers = answers;
        localStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify(memberships));
        return existing;
      }
      return existing;
    }

    const club = this.getClubById(clubId);
    const initialStatus: MembershipStatus = (club?.admissionType === 'open') ? 'accepted' : 'pending';

    const newMembership: Membership = {
      id: `mem-${Date.now()}`,
      clubId,
      userId,
      roleInClub: 'Miembro Activo',
      status: initialStatus,
      appliedAt: new Date().toISOString(),
      answers
    };

    memberships.push(newMembership);
    localStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify(memberships));

    if (initialStatus === 'accepted' && club) {
      club.memberCount += 1;
      this.updateClub(club);
    }

    // Create notification
    this.addNotification({
      userId,
      title: initialStatus === 'accepted' ? '¡Bienvenido al Club!' : 'Solicitud Enviada',
      message: initialStatus === 'accepted'
        ? `Ahora eres miembro de ${club?.name}.`
        : `Tu postulación a ${club?.name} ha sido enviada exitosamente.`,
      type: 'success',
      link: '/mis-clubes'
    });

    return newMembership;
  },

  updateMembershipStatus(membershipId: string, status: MembershipStatus, reason?: string): Membership | null {
    const memberships = this.getMemberships();
    const mem = memberships.find(m => m.id === membershipId);
    if (!mem) return null;
    
    const oldStatus = mem.status;
    mem.status = status;
    mem.reviewedAt = new Date().toISOString();
    if (reason) mem.rejectionReason = reason;

    localStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify(memberships));

    const club = this.getClubById(mem.clubId);
    if (club) {
      if (status === 'accepted' && oldStatus !== 'accepted') {
        club.memberCount += 1;
        this.updateClub(club);
      } else if (status !== 'accepted' && oldStatus === 'accepted') {
        club.memberCount = Math.max(0, club.memberCount - 1);
        this.updateClub(club);
      }
    }

    this.addNotification({
      userId: mem.userId,
      title: status === 'accepted' ? '¡Postulación Aceptada!' : 'Actualización de Postulación',
      message: status === 'accepted'
        ? `Has sido admitido en ${club?.name}.`
        : `Tu solicitud a ${club?.name} ha sido ${status === 'rejected' ? 'rechazada: ' + (reason || '') : status}.`,
      type: status === 'accepted' ? 'success' : 'warning',
      link: '/mis-clubes'
    });

    return mem;
  },

  updateMemberRole(membershipId: string, newRole: RoleInClub): Membership | null {
    const memberships = this.getMemberships();
    const mem = memberships.find(m => m.id === membershipId);
    if (!mem) return null;
    mem.roleInClub = newRole;
    localStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify(memberships));
    return mem;
  },

  // ACTIVITIES
  getActivities(): Activity[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return data ? JSON.parse(data) : [];
  },

  getActivityById(id: string): Activity | undefined {
    return this.getActivities().find(a => a.id === id);
  },

  getActivitiesByClubId(clubId: string): Activity[] {
    return this.getActivities().filter(a => a.clubId === clubId);
  },

  createActivity(activityData: Omit<Activity, 'id' | 'enrolledCount'>): Activity {
    const activities = this.getActivities();
    const newActivity: Activity = {
      ...activityData,
      id: `act-${Date.now()}`,
      enrolledCount: 0
    };
    activities.unshift(newActivity);
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    return newActivity;
  },

  updateActivity(activity: Activity): Activity {
    const activities = this.getActivities().map(a => (a.id === activity.id ? activity : a));
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    return activity;
  },

  // REGISTRATIONS & WAITLIST
  getRegistrations(): Registration[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
    return data ? JSON.parse(data) : [];
  },

  getRegistrationsByUserId(userId: string): Registration[] {
    return this.getRegistrations().filter(r => r.userId === userId && r.status !== 'cancelled');
  },

  getRegistrationsByActivityId(activityId: string): Registration[] {
    return this.getRegistrations().filter(r => r.activityId === activityId && r.status !== 'cancelled');
  },

  registerToActivity(activityId: string, user: User): { registration: Registration; isWaitlist: boolean } {
    const activity = this.getActivityById(activityId);
    if (!activity) throw new Error('Actividad no encontrada');

    const registrations = this.getRegistrations();
    const existing = registrations.find(r => r.activityId === activityId && r.userId === user.id && r.status !== 'cancelled');
    if (existing) {
      return { registration: existing, isWaitlist: existing.status === 'waitlist' };
    }

    const isFull = activity.enrolledCount >= activity.capacity;
    const status = isFull ? 'waitlist' : 'confirmed';
    const codePrefix = isFull ? 'WAIT' : 'ULIMA';
    const ticketCode = `${codePrefix}-${activity.title.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReg: Registration = {
      id: `reg-${Date.now()}`,
      activityId,
      userId: user.id,
      userName: user.fullName,
      userEmail: user.email,
      userCode: user.code,
      userCareer: user.career,
      status,
      registeredAt: new Date().toISOString(),
      ticketCode
    };

    registrations.push(newReg);
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));

    if (status === 'confirmed') {
      activity.enrolledCount += 1;
      this.updateActivity(activity);
    }

    this.addNotification({
      userId: user.id,
      title: isFull ? 'En lista de espera' : 'Inscripción confirmada',
      message: isFull
        ? `Los cupos para "${activity.title}" se agotaron. Estás en lista de espera y te notificaremos si se libera un cupo.`
        : `Tienes tu cupo confirmado para "${activity.title}". Pase: ${ticketCode}`,
      type: isFull ? 'warning' : 'success',
      link: '/mis-inscripciones'
    });

    return { registration: newReg, isWaitlist: isFull };
  },

  cancelRegistration(registrationId: string): boolean {
    const registrations = this.getRegistrations();
    const reg = registrations.find(r => r.id === registrationId);
    if (!reg) return false;

    const activity = this.getActivityById(reg.activityId);
    reg.status = 'cancelled';
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));

    // If it was confirmed, free up a spot and promote the first waitlisted user
    if (activity) {
      activity.enrolledCount = Math.max(0, activity.enrolledCount - 1);
      
      const waitlisted = registrations.find(r => r.activityId === activity.id && r.status === 'waitlist');
      if (waitlisted) {
        waitlisted.status = 'confirmed';
        waitlisted.ticketCode = `ULIMA-AUTO-${Math.floor(1000 + Math.random() * 9000)}`;
        activity.enrolledCount += 1;
        localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));

        this.addNotification({
          userId: waitlisted.userId,
          title: '¡Vacante asignada automáticamente!',
          message: `Se liberó un cupo para "${activity.title}". Tu pase digital es ${waitlisted.ticketCode}.`,
          type: 'success',
          link: '/mis-inscripciones'
        });
      }

      this.updateActivity(activity);
    }

    return true;
  },

  updateAttendance(registrationId: string, attendanceStatus: AttendanceStatus): Registration | null {
    const registrations = this.getRegistrations();
    const reg = registrations.find(r => r.id === registrationId);
    if (!reg) return null;
    reg.attendanceStatus = attendanceStatus;
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
    return reg;
  },

  exportAttendanceCSV(activityId: string): string {
    const activity = this.getActivityById(activityId);
    const registrations = this.getRegistrationsByActivityId(activityId);

    const headers = ['Código Ulima', 'Nombre Completo', 'Correo Institucional', 'Carrera', 'Estado Inscripción', 'Asistencia', 'Pase Ticket'];
    const rows = registrations.map(r => [
      `"${r.userCode}"`,
      `"${r.userName}"`,
      `"${r.userEmail}"`,
      `"${r.userCareer}"`,
      `"${r.status === 'confirmed' ? 'Confirmado' : 'Lista de espera'}"`,
      `"${r.attendanceStatus ? (r.attendanceStatus === 'present' ? 'Presente' : r.attendanceStatus === 'absent' ? 'Ausente' : r.attendanceStatus === 'late' ? 'Tardanza' : 'Justificado') : 'Sin marcar'}"`,
      `"${r.ticketCode}"`
    ]);

    const csvContent = [
      `"Reporte de Asistencia - ${activity?.title || 'Actividad'}"`,
      `"Fecha: ${activity?.date} | Modalidad: ${activity?.modality}"`,
      '',
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    return csvContent;
  },

  // BOARD POSTS & COMMENTS
  getPostsByClubId(clubId: string): BoardPost[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.BOARD_POSTS);
    const posts: BoardPost[] = data ? JSON.parse(data) : [];
    return posts
      .filter(p => p.clubId === clubId)
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  },

  createPost(postData: Omit<BoardPost, 'id' | 'createdAt' | 'likesCount' | 'likedBy'>): BoardPost {
    const posts: BoardPost[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOARD_POSTS) || '[]');
    const newPost: BoardPost = {
      ...postData,
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      likedBy: []
    };
    posts.unshift(newPost);
    localStorage.setItem(STORAGE_KEYS.BOARD_POSTS, JSON.stringify(posts));
    return newPost;
  },

  togglePostPin(postId: string): BoardPost | null {
    const posts: BoardPost[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOARD_POSTS) || '[]');
    const post = posts.find(p => p.id === postId);
    if (!post) return null;
    post.isPinned = !post.isPinned;
    localStorage.setItem(STORAGE_KEYS.BOARD_POSTS, JSON.stringify(posts));
    return post;
  },

  togglePostLike(postId: string, userId: string): BoardPost | null {
    const posts: BoardPost[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOARD_POSTS) || '[]');
    const post = posts.find(p => p.id === postId);
    if (!post) return null;
    
    const index = post.likedBy.indexOf(userId);
    if (index === -1) {
      post.likedBy.push(userId);
      post.likesCount += 1;
    } else {
      post.likedBy.splice(index, 1);
      post.likesCount = Math.max(0, post.likesCount - 1);
    }
    localStorage.setItem(STORAGE_KEYS.BOARD_POSTS, JSON.stringify(posts));
    return post;
  },

  deletePost(postId: string): boolean {
    const posts: BoardPost[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOARD_POSTS) || '[]');
    const filtered = posts.filter(p => p.id !== postId);
    localStorage.setItem(STORAGE_KEYS.BOARD_POSTS, JSON.stringify(filtered));
    return true;
  },

  getCommentsByPostId(postId: string): PostComment[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.POST_COMMENTS);
    const comments: PostComment[] = data ? JSON.parse(data) : [];
    return comments.filter(c => c.postId === postId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  addComment(commentData: Omit<PostComment, 'id' | 'createdAt'>): PostComment {
    const comments: PostComment[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.POST_COMMENTS) || '[]');
    const newComment: PostComment = {
      ...commentData,
      id: `com-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    comments.push(newComment);
    localStorage.setItem(STORAGE_KEYS.POST_COMMENTS, JSON.stringify(comments));
    return newComment;
  },

  deleteComment(commentId: string): boolean {
    const comments: PostComment[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.POST_COMMENTS) || '[]');
    const filtered = comments.filter(c => c.id !== commentId);
    localStorage.setItem(STORAGE_KEYS.POST_COMMENTS, JSON.stringify(filtered));
    return true;
  },

  // NOTIFICATIONS
  getNotificationsByUserId(userId: string): UserNotification[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const notifs: UserNotification[] = data ? JSON.parse(data) : [];
    return notifs.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  addNotification(notifData: Omit<UserNotification, 'id' | 'createdAt' | 'isRead'>): UserNotification {
    const notifs: UserNotification[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
    const newNotif: UserNotification = {
      ...notifData,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    notifs.unshift(newNotif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    return newNotif;
  },

  markNotificationAsRead(notifId: string): boolean {
    const notifs: UserNotification[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
    const notif = notifs.find(n => n.id === notifId);
    if (!notif) return false;
    notif.isRead = true;
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    return true;
  },

  // AUDIT LOGS
  getAuditLogs(): AdminAuditLog[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    const logs: AdminAuditLog[] = data ? JSON.parse(data) : [];
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  addAuditLog(adminEmail: string, action: string, target: string, reason?: string): AdminAuditLog {
    const logs: AdminAuditLog[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS) || '[]');
    const newLog: AdminAuditLog = {
      id: `audit-${Date.now()}`,
      adminEmail,
      action,
      target,
      timestamp: new Date().toISOString(),
      reason
    };
    logs.unshift(newLog);
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
    return newLog;
  }
};
