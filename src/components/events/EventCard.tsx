import React from 'react';
import { CollegeEvent } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  Share2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface EventCardProps {
  event: CollegeEvent;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const {
    currentUser,
    registrations,
    openEventModal,
    openRegisterModal,
    openQrModal,
    openShareModal,
    openFeedbackModal,
  } = useApp();

  const userReg = registrations.find(
    (r) => r.eventId === event.id && r.userId === currentUser.id && r.status !== 'cancelled'
  );
  const isRegistered = !!userReg;
  const isWaitlisted = userReg?.status === 'waitlisted';

  const isFull = event.registeredCount >= event.capacity || event.status === 'full';
  const availableSeats = Math.max(0, event.capacity - event.registeredCount);
  const capacityPercent = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));
  const isAlmostFull = !isFull && availableSeats > 0 && availableSeats <= 15;

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (event.status === 'live') {
      if (event.meetingLink) {
        window.open(event.meetingLink, '_blank');
      } else {
        openEventModal(event);
      }
    } else if (event.status === 'completed') {
      openFeedbackModal(event);
    } else if (isRegistered) {
      // Show ticket QR
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

  const handleQrClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRegistered && userReg) {
      openQrModal({
        title: event.title,
        subtitle: `Ticket Pass • ${currentUser.name}`,
        code: userReg.ticketCode,
        type: 'ticket',
      });
    } else {
      openQrModal({
        title: event.title,
        subtitle: `${event.college} • Scan to discover`,
        code: `EH-EVENT-${event.id}`,
        type: 'event',
      });
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openShareModal(event);
  };

  return (
    <div
      onClick={() => openEventModal(event)}
      className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/70 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Banner Image Container */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Top Floating Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-3 z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 shadow-xs">
              {event.category}
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-medium uppercase bg-slate-950/60 text-slate-300 backdrop-blur-md">
              {event.mode}
            </span>
          </div>

          {/* Status Indicator */}
          {event.status === 'live' ? (
            <span className="flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-600 text-white shadow-md animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              LIVE NOW
            </span>
          ) : event.status === 'completed' ? (
            <span className="px-3.5 py-1 rounded-full text-[11px] font-medium uppercase bg-slate-800/90 text-slate-300 backdrop-blur-md">
              COMPLETED
            </span>
          ) : isFull ? (
            <span className="px-3.5 py-1 rounded-full text-[11px] font-bold uppercase bg-amber-500 text-white shadow-xs">
              FULL
            </span>
          ) : event.fee === 0 ? (
            <span className="px-3.5 py-1 rounded-full text-[11px] font-bold uppercase bg-emerald-600 text-white shadow-xs">
              FREE
            </span>
          ) : (
            <span className="px-3.5 py-1 rounded-full text-[11px] font-bold bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs">
              ₹{event.fee}
            </span>
          )}
        </div>

        {/* College & Verification Badge overlay */}
        <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-white text-xs z-10">
          <span className="font-medium text-xs truncate text-slate-200">
            {event.college}
          </span>
          {event.verificationStatus === 'verified' && (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full backdrop-blur-xs border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex-1 p-7 sm:p-8 flex flex-col justify-between gap-6">
        <div className="space-y-3.5">
          {/* Title */}
          <h4 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
            {event.title}
          </h4>

          {/* Time & Venue meta */}
          <div className="space-y-2.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-1">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>{event.date}</span>
              <span>•</span>
              <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>{event.startTime}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Capacity Progress Bar (Requirement 18) */}
        <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-500 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <span>
                {event.registeredCount} / {event.capacity} seats
              </span>
            </span>
            {isFull ? (
              <span className="font-semibold text-amber-600">Full (Waitlist active)</span>
            ) : isAlmostFull ? (
              <span className="font-semibold text-rose-500 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Few seats left! ({availableSeats})
              </span>
            ) : (
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {availableSeats} seats open
              </span>
            )}
          </div>

          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFull
                  ? 'bg-amber-500'
                  : isAlmostFull
                  ? 'bg-rose-500'
                  : capacityPercent > 70
                  ? 'bg-indigo-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${capacityPercent}%` }}
            />
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="flex items-center gap-3 pt-2">
          {/* Main Action Button */}
          <button
            onClick={handleActionClick}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shadow-xs ${
              isRegistered
                ? isWaitlisted
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                  : 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                : event.status === 'live'
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : event.status === 'completed'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                : isFull
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isRegistered ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isWaitlisted ? `WAITLISTED (#${userReg?.waitlistPosition || 1})` : 'REGISTERED ✓'}</span>
              </>
            ) : event.status === 'live' ? (
              <>
                <span>JOIN LIVE</span>
                <ExternalLink className="w-3 h-3" />
              </>
            ) : event.status === 'completed' ? (
              <span>VIEW FEEDBACK</span>
            ) : isFull ? (
              <span>JOIN WAITLIST</span>
            ) : (
              <>
                <span>REGISTER NOW</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          {/* Quick QR & Share buttons */}
          <button
            onClick={handleQrClick}
            title={isRegistered ? 'View Entry Ticket QR' : 'View Event QR'}
            className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <QrCode className="w-4 h-4" />
          </button>

          <button
            onClick={handleShareClick}
            title="Share event link"
            className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
