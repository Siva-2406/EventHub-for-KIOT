export type Role = 'student' | 'host' | 'admin';

export type EventStatus = 'upcoming' | 'live' | 'completed' | 'cancelled' | 'full';

export type EventMode = 'online' | 'offline' | 'hybrid';

export type VerificationStatus = 'verified' | 'pending' | 'rejected';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'draft';

export interface Speaker {
  id: string;
  name: string;
  role: string;
  organization: string;
  avatar: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  description: string;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface EventFeedbackStats {
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
}

export interface CollegeEvent {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  college: string;
  category: string;
  mode: EventMode;
  status: EventStatus;
  approvalStatus: ApprovalStatus;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "10:00 AM"
  endTime: string; // e.g. "12:00 PM"
  rawStartHour: number; // 24-hr representation for conflict detection (e.g. 10.0)
  rawEndHour: number; // 24-hr representation (e.g. 12.0)
  registrationDeadline: string;
  venue: string;
  meetingLink?: string;
  bannerUrl: string;
  capacity: number;
  registeredCount: number;
  waitlistCount: number;
  organizerName: string;
  organizerCollege: string;
  organizerEmail: string;
  verificationStatus: VerificationStatus;
  isExternal: boolean;
  fee: number; // 0 for free
  eligibility: string;
  rules: string[];
  speakers: Speaker[];
  schedule: ScheduleItem[];
  tags: string[];
  feedbackStats?: EventFeedbackStats;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  college: string;
  department: string;
  role: Role;
  avatar: string;
  interests: string[];
  stats: {
    eventsRegistered: number;
    eventsAttended: number;
    certificates: number;
    feedbackGiven: number;
  };
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  registrationDate: string;
  status: 'registered' | 'waitlisted' | 'cancelled' | 'attended';
  waitlistPosition?: number;
  ticketCode: string;
  attendedStatus?: 'present' | 'absent' | 'pending';
  studentName: string;
  studentEmail: string;
  studentCollege: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'reminder' | 'update' | 'approval' | 'conflict' | 'system';
  timestamp: string;
  read: boolean;
  eventId?: string;
  actionUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  eventName: string;
  date: string;
  category: string;
  badgeIcon: string;
  description: string;
  certificateId: string;
}

export interface EventCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
  description: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'warning' | 'error' | 'info';
}
