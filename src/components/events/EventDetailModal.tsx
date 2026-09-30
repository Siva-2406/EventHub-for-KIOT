import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  Video,
  Share2,
  QrCode,
  CheckCircle2,
  Star,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Award,
} from 'lucide-react';

export const EventDetailModal: React.FC = () => {
  const {
    activeEventModal,
    closeEventModal,
    currentUser,
    registrations,
    openRegisterModal,
    openQrModal,
    openShareModal,
    openFeedbackModal,
    addToast,
    setActiveTab,
  } = useApp();

  const [activeTabSection, setActiveTabSection] = useState<'about' | 'speakers' | 'schedule' | 'reviews'>('about');

  if (!activeEventModal) return null;

  const event = activeEventModal;
  const userReg = registrations.find(
    (r) => r.eventId === event.id && r.userId === currentUser.id && r.status !== 'cancelled'
  );
  const isRegistered = !!userReg;
  const isWaitlisted = userReg?.status === 'waitlisted';
  const isFull = event.registeredCount >= event.capacity || event.status === 'full';
  const availableSeats = Math.max(0, event.capacity - event.registeredCount);

  const handleRegisterClick = () => {
    if (isRegistered) {
      openQrModal({
        title: event.title,
        subtitle: `Pass: ${userReg.ticketCode} • ${currentUser.name}`,
        code: userReg.ticketCode,
        type: 'ticket',
      });
    } else {
      openRegisterModal(event);
    }
  };

  const handleAddToSchedule = () => {
    if (!isRegistered) {
      openRegisterModal(event);
    } else {
      addToast('Event on Schedule', 'This event is already booked on your personal calendar timeline.', 'info');
      closeEventModal();
      setActiveTab('my-schedule');
    }
  };

  return (
    <Modal
      isOpen={!!activeEventModal}
      onClose={closeEventModal}
      maxWidth="3xl"
    >
      <div className="-m-6 overflow-hidden">
        {/* Hero Banner Header */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          {/* Floating Category & Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/95 text-indigo-700 backdrop-blur-md shadow-md">
                {event.category}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase bg-slate-900/80 text-white backdrop-blur-md border border-white/10">
                {event.mode}
              </span>
            </div>

            {event.status === 'live' && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-600 text-white shadow-lg animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white"></span>
                LIVE NOW
              </span>
            )}
          </div>

          {/* Title and College overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 text-xs text-indigo-200 mb-1">
              <span className="font-semibold">{event.college}</span>
              {event.verificationStatus === 'verified' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Event</span>
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight text-white">
              {event.title}
            </h2>
          </div>
        </div>

        {/* Quick Meta Information Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 p-2">
            <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Date</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">{event.date}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2">
            <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Timing</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">{event.startTime} - {event.endTime}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2">
            <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] text-slate-400 font-medium">Venue</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">{event.venue}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2">
            <Users className="w-4 h-4 text-indigo-500 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Availability</div>
              <div className={`font-semibold ${isFull ? 'text-amber-600' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {isFull ? 'Full (Waitlist)' : `${availableSeats} seats left`}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="p-6 space-y-6">
          {/* Navigation Pill Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
            {(['about', 'speakers', 'schedule', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTabSection(tab)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  activeTabSection === tab
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {tab === 'reviews' ? `Reviews (${event.feedbackStats?.totalReviews || 0})` : tab}
              </button>
            ))}
          </div>

          {/* Section: About */}
          {activeTabSection === 'about' && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                  About This Event
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                  {event.description}
                </p>
              </div>

              {/* Eligibility */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
                <span className="font-bold text-indigo-900 dark:text-indigo-200 block mb-0.5">
                  Eligibility & Requirements
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  {event.eligibility}
                </p>
              </div>

              {/* Rules & Guidelines */}
              {event.rules && event.rules.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Event Rules & Guidelines
                  </h4>
                  <ul className="space-y-1.5">
                    {event.rules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Organizer Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Event Coordinator & Host
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                    {event.organizerName}
                  </div>
                  <div className="text-[11px] text-slate-500">{event.organizerCollege} • {event.organizerEmail}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-medium">Registration Deadline</div>
                  <div className="text-xs font-bold text-rose-600 dark:text-rose-400">{event.registrationDeadline}</div>
                </div>
              </div>
            </div>
          )}

          {/* Section: Speakers */}
          {activeTabSection === 'speakers' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Featured Speakers & Mentors
              </h4>
              {event.speakers && event.speakers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {event.speakers.map((spk) => (
                    <div
                      key={spk.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3"
                    >
                      <img
                        src={spk.avatar}
                        alt={spk.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/30"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {spk.name}
                        </div>
                        <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium truncate">
                          {spk.role}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {spk.organization}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Student and faculty coordinated event.</p>
              )}
            </div>
          )}

          {/* Section: Schedule Timeline */}
          {activeTabSection === 'schedule' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Event Agenda & Timeline
              </h4>
              {event.schedule && event.schedule.length > 0 ? (
                <div className="relative pl-6 space-y-4 border-l-2 border-indigo-200 dark:border-indigo-900">
                  {event.schedule.map((item, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-slate-900" />
                      <div className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {item.time}
                      </div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                        {item.title}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Full detailed agenda will be shared prior to session start.</p>
              )}
            </div>
          )}

          {/* Section: Reviews */}
          {activeTabSection === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Attendee Reviews & Feedback
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center text-amber-400">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white ml-1">
                        {event.feedbackStats?.averageRating || 5.0} / 5.0
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      ({event.feedbackStats?.totalReviews || 0} reviews)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => openFeedbackModal(event)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Leave Review</span>
                </button>
              </div>

              {event.feedbackStats && event.feedbackStats.reviews.length > 0 ? (
                <div className="space-y-3">
                  {event.feedbackStats.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <img
                            src={rev.userAvatar}
                            alt={rev.userName}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {rev.userName}
                          </span>
                        </div>
                        <div className="flex items-center text-amber-400 text-xs">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        &quot;{rev.comment}&quot;
                      </p>
                      <span className="text-[10px] text-slate-400 block mt-1">{rev.date}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
                  No public reviews yet. Be the first to attend and rate this event!
                </div>
              )}
            </div>
          )}

          {/* Action Bar at bottom */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => openShareModal(event)}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>

              <button
                onClick={() =>
                  openQrModal({
                    title: event.title,
                    subtitle: `${event.college} • Event QR`,
                    code: isRegistered && userReg ? userReg.ticketCode : `EH-EVENT-${event.id}`,
                    type: isRegistered ? 'ticket' : 'event',
                  })
                }
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                <QrCode className="w-4 h-4" />
                <span className="hidden sm:inline">View QR</span>
              </button>

              <button
                onClick={handleAddToSchedule}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                <Calendar className="w-4 h-4" />
                <span>Add to Schedule</span>
              </button>
            </div>

            {/* Primary Action Button */}
            <div className="flex items-center gap-2">
              {event.status === 'live' ? (
                <button
                  onClick={() => {
                    if (event.meetingLink) window.open(event.meetingLink, '_blank');
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/30"
                >
                  <Video className="w-4 h-4" />
                  <span>JOIN LIVE NOW</span>
                </button>
              ) : (
                <button
                  onClick={handleRegisterClick}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                    isRegistered
                      ? isWaitlisted
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300'
                        : 'bg-emerald-600 text-white hover:bg-emerald-500'
                      : isFull
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25'
                  }`}
                >
                  {isRegistered ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isWaitlisted ? `WAITLISTED (#${userReg?.waitlistPosition || 1})` : 'REGISTERED ✓ (PASS)'}</span>
                    </>
                  ) : isFull ? (
                    <span>JOIN WAITLIST</span>
                  ) : (
                    <span>REGISTER NOW</span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
