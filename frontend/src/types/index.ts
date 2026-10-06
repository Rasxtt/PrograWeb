export type UserRole = 'visitor' | 'student' | 'directive' | 'admin';

export type ClubCategory =
  | 'Cultura'
  | 'Deportes'
  | 'Tecnología'
  | 'Social'
  | 'Académico'
  | 'Arte';

export type ClubStatus = 'draft' | 'under_review' | 'published' | 'suspended';

export type RoleInClub = 'Presidente' | 'Vicepresidente' | 'Secretario' | 'Vocal' | 'Miembro Activo';

export type MembershipStatus = 'pending' | 'accepted' | 'rejected' | 'alumni';

export type ActivityModality = 'Presencial' | 'Virtual' | 'Híbrida';

export type ActivityStatus = 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface User {
  id: string;
  code: string;               // Código Ulima (ej: 20211842)
  email: string;              // @aloe.ulima.edu.pe
  fullName: string;
  career: string;             // Ej: Ingeniería de Sistemas, Ingeniería Industrial, etc.
  cycle: number;              // 1 al 10
  role: UserRole;
  isBlocked: boolean;
  blockReason?: string;
  avatarUrl: string;
  bio?: string;
  interests: ClubCategory[];
  managedClubId?: string;     // Si es directiva, id del club
}

export interface Club {
  id: string;
  code: string;               // Sigla (ej: RB, DB, TH)
  name: string;
  tagline: string;
  description: string;
  category: ClubCategory;
  mission: string;
  vision: string;
  status: ClubStatus;
  logoUrl: string;
  bannerUrl: string;
  meetingDays: string[];      // Ej: ['Martes', 'Jueves']
  meetingTime: string;        // Ej: '17:00 - 19:00'
  meetingLocation: string;    // Ej: 'Edificio H - Laboratorio 302'
  contactEmail: string;
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    discord?: string;
    website?: string;
  };
  admissionType: 'open' | 'application' | 'limited';
  requirements: string[];
  customQuestions?: string[];
  memberCount: number;
  directiveLeaderId: string;  // ID del estudiante presidente
}

export interface Membership {
  id: string;
  clubId: string;
  userId: string;
  roleInClub: RoleInClub;
  status: MembershipStatus;
  appliedAt: string;          // ISO Date string
  reviewedAt?: string;
  rejectionReason?: string;
  answers?: Record<string, string>; // Respuestas a customQuestions
}

export interface Activity {
  id: string;
  clubId: string;
  title: string;
  description: string;
  category: ClubCategory;
  date: string;               // YYYY-MM-DD
  startTime: string;          // HH:mm
  endTime: string;            // HH:mm
  location: string;
  modality: ActivityModality;
  capacity: number;
  enrolledCount: number;
  status: ActivityStatus;
  imageUrl?: string;
  tags: string[];
}

export interface Registration {
  id: string;
  activityId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userCode: string;
  userCareer: string;
  status: 'confirmed' | 'waitlist' | 'cancelled';
  registeredAt: string;
  attendanceStatus?: AttendanceStatus;
  ticketCode: string;
}

export interface BoardPost {
  id: string;
  clubId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  title: string;
  content: string;
  createdAt: string;
  isPinned: boolean;
  likesCount: number;
  likedBy: string[];          // IDs de usuarios que dieron like
}

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface UserNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface AdminAuditLog {
  id: string;
  adminEmail: string;
  action: string;
  target: string;
  timestamp: string;
  reason?: string;
}
