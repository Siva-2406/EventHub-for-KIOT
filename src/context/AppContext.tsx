import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Role,
  CollegeEvent,
  UserProfile,
  Registration,
  AppNotification,
  ToastMessage,
  Achievement,
  EventCategory,
} from '../types';
import { DEMO_USERS, INITIAL_ACHIEVEMENTS, INITIAL_CATEGORIES } from '../data/mockData';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import { notificationService } from '../services/notificationService';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  currentUser: UserProfile;
  events: CollegeEvent[];
  registrations: Registration[];
  notifications: AppNotification[];
  unreadNotifsCount: number;
  categories: EventCategory[];
  achievements: Achievement[];
  toasts: ToastMessage[];
  addToast: (title: string, message?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  // Modals & Active Selections
  activeEventModal: CollegeEvent | null;
  openEventModal: (event: CollegeEvent) => void;
  closeEventModal: () => void;

  registerModalEvent: CollegeEvent | null;
  openRegisterModal: (event: CollegeEvent) => void;
  closeRegisterModal: () => void;

  qrModalData: { title: string; subtitle: string; code: string; type: 'ticket' | 'event' } | null;
  openQrModal: (data: { title: string; subtitle: string; code: string; type: 'ticket' | 'event' }) => void;
  closeQrModal: () => void;

  shareModalEvent: CollegeEvent | null;
  openShareModal: (event: CollegeEvent) => void;
  closeShareModal: () => void;

  conflictWarning: { candidateEvent: CollegeEvent; conflictingEvent: CollegeEvent } | null;
  openConflictWarning: (candidate: CollegeEvent, conflicting: CollegeEvent) => void;
  closeConflictWarning: () => void;

  certificateModalAchievement: Achievement | null;
  openCertificateModal: (ach: Achievement) => void;
  closeCertificateModal: () => void;

  feedbackModalEvent: CollegeEvent | null;
  openFeedbackModal: (event: CollegeEvent) => void;
  closeFeedbackModal: () => void;

  // Actions
  handleRegister: (event: CollegeEvent) => Promise<boolean>;
  handleWaitlist: (event: CollegeEvent) => Promise<boolean>;
  handleCancelRegistration: (eventId: string) => Promise<boolean>;
  handleApproveEvent: (eventId: string) => Promise<void>;
  handleRejectEvent: (eventId: string) => Promise<void>;
  handleCreateEvent: (newEventData: Omit<CollegeEvent, 'id' | 'createdAt' | 'registeredCount' | 'waitlistCount'>) => Promise<CollegeEvent>;
  handleMarkAttendance: (regId: string, status: 'present' | 'absent') => Promise<void>;
  handleMarkNotificationRead: (id: string) => Promise<void>;
  handleMarkAllNotificationsRead: () => Promise<void>;
  handleAddReview: (eventId: string, rating: number, comment: string) => Promise<void>;
  handleAddCategory: (name: string, description: string, icon: string) => void;
  handleDeleteCategory: (id: string) => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>('student');
  const [events, setEvents] = useState<CollegeEvent[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>(INITIAL_CATEGORIES);
  const [achievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Navigation states
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals
  const [activeEventModal, setActiveEventModal] = useState<CollegeEvent | null>(null);
  const [registerModalEvent, setRegisterModalEvent] = useState<CollegeEvent | null>(null);
  const [qrModalData, setQrModalData] = useState<{ title: string; subtitle: string; code: string; type: 'ticket' | 'event' } | null>(null);
  const [shareModalEvent, setShareModalEvent] = useState<CollegeEvent | null>(null);
  const [conflictWarning, setConflictWarning] = useState<{ candidateEvent: CollegeEvent; conflictingEvent: CollegeEvent } | null>(null);
  const [certificateModalAchievement, setCertificateModalAchievement] = useState<Achievement | null>(null);
  const [feedbackModalEvent, setFeedbackModalEvent] = useState<CollegeEvent | null>(null);

  const currentUser = useMemo(() => DEMO_USERS[role], [role]);

  // Toast Helpers
  const addToast = useCallback((title: string, message?: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch initial data
  const refreshData = useCallback(async () => {
    const [fetchedEvents, fetchedRegs, fetchedNotifs] = await Promise.all([
      eventService.getAllEvents(),
      registrationService.getAllRegistrations(),
      notificationService.getNotifications(currentUser.id),
    ]);
    setEvents(fetchedEvents);
    setRegistrations(fetchedRegs);
    setNotifications(fetchedNotifs);
  }, [currentUser.id]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Role Switcher
  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    if (newRole === 'student') {
      setActiveTab('home');
    } else if (newRole === 'host') {
      setActiveTab('dashboard');
    } else if (newRole === 'admin') {
      setActiveTab('dashboard');
    }
    addToast(
      `Switched to ${newRole.toUpperCase()} View`,
      `Interacting as ${DEMO_USERS[newRole].name} (${DEMO_USERS[newRole].college})`,
      'info'
    );
  };

  const unreadNotifsCount = useMemo(() => {
    return notifications.filter((n) => !n.read && n.userId === currentUser.id).length;
  }, [notifications, currentUser.id]);

  // Modal open/close handlers
  const openEventModal = (event: CollegeEvent) => setActiveEventModal(event);
  const closeEventModal = () => setActiveEventModal(null);

  const openRegisterModal = (event: CollegeEvent) => setRegisterModalEvent(event);
  const closeRegisterModal = () => setRegisterModalEvent(null);

  const openQrModal = (data: { title: string; subtitle: string; code: string; type: 'ticket' | 'event' }) => setQrModalData(data);
  const closeQrModal = () => setQrModalData(null);

  const openShareModal = (event: CollegeEvent) => setShareModalEvent(event);
  const closeShareModal = () => setShareModalEvent(null);

  const openConflictWarning = (candidate: CollegeEvent, conflicting: CollegeEvent) => {
    setConflictWarning({ candidateEvent: candidate, conflictingEvent: conflicting });
  };
  const closeConflictWarning = () => setConflictWarning(null);

  const openCertificateModal = (ach: Achievement) => setCertificateModalAchievement(ach);
  const closeCertificateModal = () => setCertificateModalAchievement(null);

  const openFeedbackModal = (event: CollegeEvent) => setFeedbackModalEvent(event);
  const closeFeedbackModal = () => setFeedbackModalEvent(null);

  // Registration handler with conflict check
  const handleRegister = async (event: CollegeEvent): Promise<boolean> => {
    // Check conflicts first
    const conflictResult = await registrationService.detectConflict(event, currentUser.id);
    if (conflictResult.hasConflict && conflictResult.conflictingEvent) {
      // Trigger schedule conflict modal
      openConflictWarning(event, conflictResult.conflictingEvent);
      return false;
    }

    const res = await registrationService.registerUser(event, currentUser);
    if (res.success) {
      addToast(
        res.isWaitlist ? 'Waitlist Confirmed' : 'Registration Successful!',
        res.message,
        res.isWaitlist ? 'warning' : 'success'
      );
      await notificationService.addNotification({
        userId: currentUser.id,
        title: res.isWaitlist ? '⏳ Waitlisted for ' + event.title : '🎉 Registration Confirmed: ' + event.title,
        message: res.isWaitlist
          ? `You are on waitlist position #${res.registration?.waitlistPosition}. We will notify you if a seat opens up.`
          : `You are booked for ${event.title} on ${event.date} at ${event.startTime} in ${event.venue}.`,
        type: 'reminder',
        eventId: event.id,
      });
      await refreshData();
      return true;
    } else {
      addToast('Registration Notice', res.message, 'warning');
      return false;
    }
  };

  const handleWaitlist = async (event: CollegeEvent): Promise<boolean> => {
    const res = await registrationService.registerUser(event, currentUser);
    if (res.success) {
      addToast('Added to Waitlist', res.message, 'warning');
      await refreshData();
      return true;
    } else {
      addToast('Waitlist Notice', res.message, 'info');
      return false;
    }
  };

  const handleCancelRegistration = async (eventId: string): Promise<boolean> => {
    const success = await registrationService.cancelRegistration(eventId, currentUser.id);
    if (success) {
      addToast('Registration Cancelled', 'You have cancelled your seat for this event.', 'info');
      await refreshData();
      return true;
    }
    return false;
  };

  const handleApproveEvent = async (eventId: string) => {
    const updated = await eventService.setApprovalStatus(eventId, 'approved');
    if (updated) {
      addToast('Event Approved! ✓', `"${updated.title}" is now published and discoverable by students.`, 'success');
      await notificationService.addNotification({
        userId: 'user_host_1',
        title: '✓ Event Approved by Admin',
        message: `Your event "${updated.title}" has been approved and is now live on EventHub!`,
        type: 'approval',
        eventId: updated.id,
      });
      await refreshData();
    }
  };

  const handleRejectEvent = async (eventId: string) => {
    const updated = await eventService.setApprovalStatus(eventId, 'rejected');
    if (updated) {
      addToast('Event Rejected', `"${updated.title}" status updated to Rejected.`, 'error');
      await refreshData();
    }
  };

  const handleCreateEvent = async (
    newEventData: Omit<CollegeEvent, 'id' | 'createdAt' | 'registeredCount' | 'waitlistCount'>
  ): Promise<CollegeEvent> => {
    const created = await eventService.createEvent(newEventData);
    addToast(
      'Event Submitted for Approval',
      `"${created.title}" has been submitted to Admin. Once approved, it will be visible in public discovery.`,
      'success'
    );
    // Notify admin
    await notificationService.addNotification({
      userId: 'user_admin_1',
      title: '📋 New Event Pending Approval',
      message: `"${created.title}" submitted by ${created.organizerName} (${created.college}). Review and approve.`,
      type: 'approval',
      eventId: created.id,
    });
    await refreshData();
    return created;
  };

  const handleMarkAttendance = async (regId: string, status: 'present' | 'absent') => {
    await registrationService.updateAttendance(regId, status);
    addToast(
      status === 'present' ? 'Marked Present' : 'Marked Absent',
      `Participant attendance status updated to ${status}.`,
      'info'
    );
    await refreshData();
  };

  const handleMarkNotificationRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllNotificationsRead = async () => {
    await notificationService.markAllAsRead(currentUser.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('All Caught Up', 'All notifications marked as read.', 'info');
  };

  const handleAddReview = async (eventId: string, rating: number, comment: string) => {
    const target = events.find((e) => e.id === eventId);
    if (!target) return;

    const existingStats = target.feedbackStats || { averageRating: 5.0, totalReviews: 0, reviews: [] };
    const newReview = {
      id: `rev-${Date.now()}`,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
    };

    const newReviews = [newReview, ...existingStats.reviews];
    const newAvg = Number(
      (newReviews.reduce((acc, r) => acc + r.rating, 0) / newReviews.length).toFixed(1)
    );

    await eventService.updateEvent(eventId, {
      feedbackStats: {
        averageRating: newAvg,
        totalReviews: newReviews.length,
        reviews: newReviews,
      },
    });

    addToast('Feedback Submitted', 'Thank you for rating and reviewing this event!', 'success');
    await refreshData();
  };

  const handleAddCategory = (name: string, description: string, icon: string) => {
    const newCat: EventCategory = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      icon,
      count: 0,
      description,
    };
    setCategories((prev) => [...prev, newCat]);
    addToast('Category Created', `New category "${name}" is now available.`, 'success');
  };

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    addToast('Category Deleted', 'Category removed successfully.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        events,
        registrations,
        notifications,
        unreadNotifsCount,
        categories,
        achievements,
        toasts,
        addToast,
        removeToast,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        activeEventModal,
        openEventModal,
        closeEventModal,
        registerModalEvent,
        openRegisterModal,
        closeRegisterModal,
        qrModalData,
        openQrModal,
        closeQrModal,
        shareModalEvent,
        openShareModal,
        closeShareModal,
        conflictWarning,
        openConflictWarning,
        closeConflictWarning,
        certificateModalAchievement,
        openCertificateModal,
        closeCertificateModal,
        feedbackModalEvent,
        openFeedbackModal,
        closeFeedbackModal,
        handleRegister,
        handleWaitlist,
        handleCancelRegistration,
        handleApproveEvent,
        handleRejectEvent,
        handleCreateEvent,
        handleMarkAttendance,
        handleMarkNotificationRead,
        handleMarkAllNotificationsRead,
        handleAddReview,
        handleAddCategory,
        handleDeleteCategory,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
