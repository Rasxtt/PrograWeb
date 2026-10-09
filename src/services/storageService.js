import seedData from '../data/seedData.json';

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
  INITIALIZED: 'vu_ulima_initialized_v2'
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
  getUsers() {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  getUserById(id) {
    return this.getUsers().find(u => u.id === id);
  },

  getUserByEmail(email) {
    return this.getUsers().find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  },

  updateUser(user) {
    const users = this.getUsers().map(u => (u.id === user.id ? user : u));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    const current = this.getCurrentUser();
    if (current && current.id === user.id) {
      this.setCurrentUser(user);
    }
    return user;
  },

  createUser(userData) {
    const users = this.getUsers();
    const newUser = {
      ...userData,
      id: `user-${Date.now()}`
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return newUser;
  },

  setUserBlockStatus(userId, isBlocked, reason, adminEmail) {
    const user = this.getUserById(userId);
    if (!user) return null;
    user.isBlocked = isBlocked;
    user.blockReason = isBlocked ? (reason || 'Sanción disciplinaria administrativa') : undefined;
    this.updateUser(user);

    this.addAuditLog({
      action: isBlocked ? 'BLOQUEAR_USUARIO' : 'DESBLOQUEAR_USUARIO',
      entityType: 'USUARIO',
      entityId: userId,
      entityName: user.fullName,
      performedBy: adminEmail || 'admin@aloe.ulima.edu.pe',
      details: isBlocked ? `Cuenta bloqueada: ${reason}` : 'Cuenta desbloqueada y reactivada'
    });

    return user;
  },

  // CURRENT USER & ROLE
  getCurrentUser() {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  // CLUBS
  getClubs() {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.CLUBS);
    return data ? JSON.parse(data) : [];
  },

  getClubById(id) {
    return this.getClubs().find(c => c.id === id);
  },

  getClubBySlug(slug) {
    return this.getClubs().find(c => c.slug === slug);
  },

  updateClub(club) {
    const clubs = this.getClubs().map(c => (c.id === club.id ? club : c));
    localStorage.setItem(STORAGE_KEYS.CLUBS, JSON.stringify(clubs));
    return club;
  },

  createClub(clubData) {
    const clubs = this.getClubs();
    const newClub = {
      ...clubData,
      id: `club-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    clubs.push(newClub);
    localStorage.setItem(STORAGE_KEYS.CLUBS, JSON.stringify(clubs));
    return newClub;
  },

  setClubStatus(clubId, status, reason, adminEmail) {
    const club = this.getClubById(clubId);
    if (!club) return null;
    club.status = status;
    club.suspensionReason = status === 'suspendido' ? (reason || 'Incumplimiento de normativas institucionales') : undefined;
    this.updateClub(club);

    this.addAuditLog({
      action: status === 'suspendido' ? 'SUSPENDER_CLUB' : 'ACTIVAR_CLUB',
      entityType: 'CLUB',
      entityId: clubId,
      entityName: club.name,
      performedBy: adminEmail || 'admin@aloe.ulima.edu.pe',
      details: status === 'suspendido' ? `Club suspendido por: ${reason}` : 'Club reactivado con éxito'
    });

    return club;
  },

  // MEMBERSHIPS
  getMemberships() {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.MEMBERSHIPS);
    return data ? JSON.parse(data) : [];
  },

  getMembershipsByUserId(userId) {
    return this.getMemberships().filter(m => m.userId === userId);
  },

  getMembershipsByClubId(clubId) {
    return this.getMemberships().filter(m => m.clubId === clubId);
  },

  getUserMembershipInClub(userId, clubId) {
    return this.getMemberships().find(m => m.userId === userId && m.clubId === clubId);
  },

  requestMembership(userId, clubId, motivation, experience) {
    const existing = this.getUserMembershipInClub(userId, clubId);
    if (existing) {
      if (existing.status === 'activo') {
        throw new Error('Ya eres miembro activo de este club.');
      }
      if (existing.status === 'pendiente') {
        throw new Error('Ya tienes una solicitud pendiente para este club.');
      }
    }

    const memberships = this.getMemberships();
    const user = this.getUserById(userId);
    const club = this.getClubById(clubId);

    const isAutoAccept = club?.admissionType === 'abierto';

    const newMembership = {
      id: `mem-${Date.now()}`,
      userId,
      userName: user ? user.fullName : 'Estudiante Ulima',
      userEmail: user ? user.email : '',
      clubId,
      clubName: club ? club.name : 'Club Universitario',
      roleInClub: 'miembro',
      status: isAutoAccept ? 'activo' : 'pendiente',
      joinedAt: new Date().toISOString(),
      motivation: motivation || 'Deseo participar en las actividades del club',
      experience: experience || 'Sin experiencia previa requerida'
    };

    memberships.push(newMembership);
    localStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify(memberships));

    // Update club member count if active
    if (isAutoAccept && club) {
      club.memberCount = (club.memberCount || 0) + 1;
      this.updateClub(club);
    }

    // Add notification
    this.addNotification({
      userId,
      title: isAutoAccept ? '¡Bienvenido al club!' : 'Solicitud de ingreso enviada',
      message: isAutoAccept 
        ? `Te has unido exitosamente al ${club?.name}. Ya puedes participar en sus actividades.`
        : `Tu solicitud de ingreso al ${club?.name} fue enviada a la directiva para revisión.`,
      link: `/club/${clubId}`
    });

    return newMembership;
  },

  updateMembershipStatus(membershipId, status, rejectionReason, approvedBy) {
    const memberships = this.getMemberships();
    const mem = memberships.find(m => m.id === membershipId);
    if (!mem) return null;

    mem.status = status;
    if (status === 'rechazado') {
      mem.rejectionReason = rejectionReason || 'No cumple con el perfil requerido en este ciclo';
    }

    localStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify(memberships));

    // Update member count in club if approved
    const club = this.getClubById(mem.clubId);
    if (club && status === 'activo') {
      const activeCount = memberships.filter(m => m.clubId === club.id && m.status === 'activo').length;
      club.memberCount = activeCount;
      this.updateClub(club);
    }

    // Notify user
    this.addNotification({
      userId: mem.userId,
      title: status === 'activo' ? '¡Solicitud aceptada!' : 'Solicitud no admitida',
      message: status === 'activo'
        ? `Tu solicitud de ingreso al ${mem.clubName} ha sido aceptada.`
        : `Tu solicitud al ${mem.clubName} fue rechazada: ${mem.rejectionReason}`,
      link: `/club/${mem.clubId}`
    });

    return mem;
  },

  updateMembershipRole(membershipId, roleInClub) {
    const memberships = this.getMemberships();
    const mem = memberships.find(m => m.id === membershipId);
    if (!mem) return null;

    mem.roleInClub = roleInClub;
    localStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify(memberships));
    return mem;
  },

  removeMember(membershipId, reason) {
    const memberships = this.getMemberships();
    const mem = memberships.find(m => m.id === membershipId);
    if (!mem) return null;

    mem.status = 'retirado';
    mem.rejectionReason = reason || 'Baja voluntaria o administrativa';
    localStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify(memberships));

    const club = this.getClubById(mem.clubId);
    if (club) {
      const activeCount = memberships.filter(m => m.clubId === club.id && m.status === 'activo').length;
      club.memberCount = activeCount;
      this.updateClub(club);
    }

    return mem;
  },

  // ACTIVITIES
  getActivities() {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return data ? JSON.parse(data) : [];
  },

  getActivityById(id) {
    return this.getActivities().find(a => a.id === id);
  },

  getActivitiesByClubId(clubId) {
    return this.getActivities().filter(a => a.clubId === clubId);
  },

  createActivity(activityData) {
    const activities = this.getActivities();
    const newActivity = {
      ...activityData,
      id: `act-${Date.now()}`,
      registeredCount: 0,
      waitingListCount: 0,
      status: activityData.status || 'borrador',
      createdAt: new Date().toISOString()
    };
    activities.push(newActivity);
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    return newActivity;
  },

  updateActivity(activity) {
    const activities = this.getActivities().map(a => (a.id === activity.id ? activity : a));
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    return activity;
  },

  publishActivity(activityId) {
    const activity = this.getActivityById(activityId);
    if (!activity) return null;
    activity.status = 'publicada';
    return this.updateActivity(activity);
  },

  cancelActivity(activityId, reason) {
    const activity = this.getActivityById(activityId);
    if (!activity) return null;
    activity.status = 'cancelada';
    activity.cancellationReason = reason || 'Cancelada por fuerza mayor o reprogramación';
    this.updateActivity(activity);

    // Notify registered students
    const regs = this.getRegistrationsByActivityId(activityId);
    regs.forEach(r => {
      this.addNotification({
        userId: r.userId,
        title: `Actividad cancelada: ${activity.title}`,
        message: `La actividad "${activity.title}" fue cancelada: ${activity.cancellationReason}`,
        link: `/actividad/${activityId}`
      });
    });

    return activity;
  },

  deleteActivity(activityId) {
    const activities = this.getActivities().filter(a => a.id !== activityId);
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  },

  // REGISTRATIONS
  getRegistrations() {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
    return data ? JSON.parse(data) : [];
  },

  getRegistrationsByUserId(userId) {
    return this.getRegistrations().filter(r => r.userId === userId);
  },

  getRegistrationsByActivityId(activityId) {
    return this.getRegistrations().filter(r => r.activityId === activityId);
  },

  getUserRegistrationInActivity(userId, activityId) {
    return this.getRegistrations().find(r => r.userId === userId && r.activityId === activityId);
  },

  registerForActivity(userId, activityId, acceptTerms = true) {
    const existing = this.getUserRegistrationInActivity(userId, activityId);
    if (existing && existing.status !== 'cancelada') {
      throw new Error('Ya tienes un registro activo para esta actividad.');
    }

    const activity = this.getActivityById(activityId);
    if (!activity) throw new Error('Actividad no encontrada.');
    if (activity.status !== 'publicada') throw new Error('La actividad no está disponible para inscripciones.');

    const user = this.getUserById(userId);
    const registrations = this.getRegistrations();

    // Check capacity
    const confirmedCount = registrations.filter(r => r.activityId === activityId && r.status === 'confirmada').length;
    const isFull = confirmedCount >= activity.capacity;

    if (isFull && !activity.hasWaitingList) {
      throw new Error('Los cupos están agotados y esta actividad no admite lista de espera.');
    }

    let status = 'confirmada';
    let waitingOrder = undefined;

    if (isFull) {
      status = 'lista_espera';
      const waitingList = registrations.filter(r => r.activityId === activityId && r.status === 'lista_espera');
      waitingOrder = waitingList.length + 1;
    }

    const qrCode = `ULIMA-VU-${activityId}-${Date.now().toString(36).toUpperCase()}`;

    const newReg = {
      id: `reg-${Date.now()}`,
      activityId,
      activityTitle: activity.title,
      userId,
      userName: user ? user.fullName : 'Estudiante',
      userEmail: user ? user.email : '',
      clubId: activity.clubId,
      clubName: activity.clubName,
      status,
      waitingListOrder: waitingOrder,
      registeredAt: new Date().toISOString(),
      attended: 'pendiente',
      ticketQrCode: qrCode,
      acceptedTerms: acceptTerms
    };

    registrations.push(newReg);
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));

    // Update activity counters
    if (status === 'confirmada') {
      activity.registeredCount = (activity.registeredCount || 0) + 1;
    } else {
      activity.waitingListCount = (activity.waitingListCount || 0) + 1;
    }
    this.updateActivity(activity);

    // Notify user
    this.addNotification({
      userId,
      title: status === 'confirmada' ? '¡Inscripción confirmada!' : 'En lista de espera',
      message: status === 'confirmada' 
        ? `Te has inscrito en "${activity.title}". Tu código de entrada es ${qrCode}.`
        : `Estás en la posición #${waitingOrder} de la lista de espera para "${activity.title}".`,
      link: '/mis-inscripciones'
    });

    return newReg;
  },

  cancelRegistration(registrationId, reason) {
    const registrations = this.getRegistrations();
    const reg = registrations.find(r => r.id === registrationId);
    if (!reg) return null;

    const previousStatus = reg.status;
    reg.status = 'cancelada';
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));

    const activity = this.getActivityById(reg.activityId);
    if (activity) {
      if (previousStatus === 'confirmada') {
        activity.registeredCount = Math.max(0, (activity.registeredCount || 1) - 1);
        this.updateActivity(activity);
        // Automatically promote first from waiting list!
        this.promoteFromWaitingList(activity.id);
      } else if (previousStatus === 'lista_espera') {
        activity.waitingListCount = Math.max(0, (activity.waitingListCount || 1) - 1);
        this.updateActivity(activity);
      }
    }

    return reg;
  },

  promoteFromWaitingList(activityId) {
    const registrations = this.getRegistrations();
    const waitingList = registrations
      .filter(r => r.activityId === activityId && r.status === 'lista_espera')
      .sort((a, b) => (a.waitingListOrder || 0) - (b.waitingListOrder || 0));

    if (waitingList.length === 0) return null;

    const firstInLine = waitingList[0];
    firstInLine.status = 'confirmada';
    firstInLine.waitingListOrder = undefined;

    // Reorder remainder
    waitingList.slice(1).forEach((item, idx) => {
      item.waitingListOrder = idx + 1;
    });

    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));

    const activity = this.getActivityById(activityId);
    if (activity) {
      activity.registeredCount = (activity.registeredCount || 0) + 1;
      activity.waitingListCount = Math.max(0, (activity.waitingListCount || 1) - 1);
      this.updateActivity(activity);
    }

    // Notify promoted user
    this.addNotification({
      userId: firstInLine.userId,
      title: '¡Cupo asignado!',
      message: `Se liberó un cupo en "${firstInLine.activityTitle}". Tu registro ha sido promovido a Confirmado.`,
      link: '/mis-inscripciones'
    });

    return firstInLine;
  },

  updateAttendance(registrationId, attended, markedBy) {
    const registrations = this.getRegistrations();
    const reg = registrations.find(r => r.id === registrationId);
    if (!reg) return null;

    reg.attended = attended;
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
    return reg;
  },

  // BOARD POSTS & COMMENTS
  getBoardPosts(clubId) {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.BOARD_POSTS);
    const posts = data ? JSON.parse(data) : [];
    if (clubId) {
      return posts.filter(p => p.clubId === clubId);
    }
    return posts;
  },

  getBoardPostById(id) {
    return this.getBoardPosts().find(p => p.id === id);
  },

  createBoardPost(postData) {
    const posts = this.getBoardPosts();
    const newPost = {
      ...postData,
      id: `post-${Date.now()}`,
      commentCount: 0,
      createdAt: new Date().toISOString()
    };
    posts.unshift(newPost);
    localStorage.setItem(STORAGE_KEYS.BOARD_POSTS, JSON.stringify(posts));
    return newPost;
  },

  togglePinPost(postId) {
    const posts = this.getBoardPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return null;
    post.isPinned = !post.isPinned;
    localStorage.setItem(STORAGE_KEYS.BOARD_POSTS, JSON.stringify(posts));
    return post;
  },

  deleteBoardPost(postId) {
    const posts = this.getBoardPosts().filter(p => p.id !== postId);
    localStorage.setItem(STORAGE_KEYS.BOARD_POSTS, JSON.stringify(posts));
  },

  getCommentsByPostId(postId) {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.POST_COMMENTS);
    const comments = data ? JSON.parse(data) : [];
    return comments.filter(c => c.postId === postId);
  },

  addComment(commentData) {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.POST_COMMENTS);
    const comments = data ? JSON.parse(data) : [];
    const newComment = {
      ...commentData,
      id: `comm-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    comments.push(newComment);
    localStorage.setItem(STORAGE_KEYS.POST_COMMENTS, JSON.stringify(comments));

    // Update post commentCount
    const posts = this.getBoardPosts();
    const post = posts.find(p => p.id === commentData.postId);
    if (post) {
      post.commentCount = (post.commentCount || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.BOARD_POSTS, JSON.stringify(posts));
    }

    return newComment;
  },

  deleteComment(commentId) {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.POST_COMMENTS);
    const comments = data ? JSON.parse(data) : [];
    const target = comments.find(c => c.id === commentId);
    if (!target) return;

    const filtered = comments.filter(c => c.id !== commentId);
    localStorage.setItem(STORAGE_KEYS.POST_COMMENTS, JSON.stringify(filtered));

    if (target.postId) {
      const posts = this.getBoardPosts();
      const post = posts.find(p => p.id === target.postId);
      if (post) {
        post.commentCount = Math.max(0, (post.commentCount || 1) - 1);
        localStorage.setItem(STORAGE_KEYS.BOARD_POSTS, JSON.stringify(posts));
      }
    }
  },

  // NOTIFICATIONS
  getNotificationsByUserId(userId) {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const notifs = data ? JSON.parse(data) : [];
    return notifs.filter(n => n.userId === userId);
  },

  addNotification(notifData) {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const notifs = data ? JSON.parse(data) : [];
    const newNotif = {
      ...notifData,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    notifs.unshift(newNotif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    return newNotif;
  },

  markNotificationAsRead(id) {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const notifs = data ? JSON.parse(data) : [];
    const target = notifs.find(n => n.id === id);
    if (target) {
      target.isRead = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    }
  },

  markAllNotificationsAsRead(userId) {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const notifs = data ? JSON.parse(data) : [];
    notifs.forEach(n => {
      if (n.userId === userId) n.isRead = true;
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },

  // AUDIT LOGS
  getAuditLogs() {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return data ? JSON.parse(data) : [];
  },

  addAuditLog(logData) {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    const logs = data ? JSON.parse(data) : [];
    const newLog = {
      ...logData,
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
    return newLog;
  },

  // ADMIN METRICS
  getAdminMetrics() {
    this.init();
    const clubs = this.getClubs();
    const activities = this.getActivities();
    const memberships = this.getMemberships();
    const registrations = this.getRegistrations();
    const users = this.getUsers();

    return {
      activeClubsCount: clubs.filter(c => c.status === 'activo').length,
      totalClubsCount: clubs.length,
      activitiesCount: activities.length,
      activeMembersCount: memberships.filter(m => m.status === 'activo').length,
      totalRegistrationsCount: registrations.length,
      attendedCount: registrations.filter(r => r.attended === 'asistio').length,
      activeUsersCount: users.filter(u => !u.isBlocked).length,
      blockedUsersCount: users.filter(u => u.isBlocked).length
    };
  }
};
