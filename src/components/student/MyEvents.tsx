import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  QrCode,
  XCircle,
  MessageSquare,
  ArrowRight,
  CalendarCheck,
  Video,
} from 'lucide-react';

export const MyEvents: React.FC = () => {
  const {
    events,
    registrations,
    currentUser,
    openEventModal,
    openQrModal,
    openFeedbackModal,
    handleCancelRegistration,
    setActiveTab,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'upcoming' | 'today' | 'completed' | 'cancelled'>('upcoming');

  // Find all events user has registered for
  const userRegistrations = registrations.filter((r) => r.userId === currentUser.id);

  // Group by status
  const eventsWithRegs = userRegistrations
    .map((reg) => {
      const event = events.find((e) => e.id === reg.eventId);
      return { reg, event };
    })
    .filter((item): item is { reg: typeof item.reg; event: NonNullable<typeof item.event> } => !!item.event);

  const upcomingEvents = eventsWithRegs.filter(
    (item) => item.reg.status !== 'cancelled' && item.event.status === 'upcoming'
  );

  const todayEvents = eventsWithRegs.filter(
    (item) => item.reg.status !== 'cancelled' && (item.event.status === 'live' || item.event.date === '2026-09-30')
  );

  const completedEvents = eventsWithRegs.filter(
    (item) => item.reg.status === 'attended' || item.event.status === 'completed'
  );

  const cancelledEvents = userRegistrations
    .filter((r) => r.status === 'cancelled')
    .map((reg) => {
      const event = events.find((e) => e.id === reg.eventId);
      return { reg, event };
    })
    .filter((item): item is { reg: typeof item.reg; event: NonNullable<typeof item.event> } => !!item.event);

  const currentList = {
    upcoming: upcomingEvents,
    today: todayEvents,
    completed: completedEvents,
    cancelled: cancelledEvents,
  }[activeSubTab];

  return (
    <div className="space-y-12 pb-24">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
          My Registered Events
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Keep track of your bookings, entry ticket passes, schedule timings, and attendance.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-lg">
        <button
          onClick={() => setActiveSubTab('upcoming')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'upcoming'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Upcoming ({upcomingEvents.length})
        </button>
        <button
          onClick={() => setActiveSubTab('today')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'today'
              ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          <span>Today ({todayEvents.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('completed')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'completed'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Completed ({completedEvents.length})
        </button>
        <button
          onClick={() => setActiveSubTab('cancelled')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'cancelled'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Cancelled ({cancelledEvents.length})
        </button>
      </div>

      {/* Events List */}
      {currentList.length > 0 ? (
        <div className="space-y-6">
          {currentList.map(({ reg, event }) => {
            const isWaitlist = reg.status === 'waitlisted';

            return (
              <div
                key={reg.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/70 dark:border-slate-800 p-7 sm:p-8 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-8"
              >
                {/* Event Info Left */}
                <div className="flex items-start gap-6 min-w-0">
                  <img
                    src={event.bannerUrl}
                    alt={event.title}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {event.category}
                      </span>

                      {event.status === 'live' ? (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-rose-600 text-white animate-pulse">
                          🔴 LIVE NOW
                        </span>
                      ) : isWaitlist ? (
                        <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          Waitlisted (#{reg.waitlistPosition})
                        </span>
                      ) : reg.status === 'attended' ? (
                        <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          ✓ Attended
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                          Confirmed Seat
                        </span>
                      )}
                    </div>

                    <h3
                      onClick={() => openEventModal(event)}
                      className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white line-clamp-1 hover:text-indigo-600 cursor-pointer"
                    >
                      {event.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
                      {event.college}
                    </p>

                    <div className="flex flex-wrap items-center gap-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 pt-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-indigo-500" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-500" />
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="truncate max-w-[200px]">{event.venue}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex flex-wrap items-center gap-3.5 self-start md:self-auto shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 w-full md:w-auto">
                  {event.status === 'live' ? (
                    <button
                      onClick={() => {
                        if (event.meetingLink) window.open(event.meetingLink, '_blank');
                      }}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-xs"
                    >
                      <Video className="w-4 h-4" />
                      <span>Join Live</span>
                    </button>
                  ) : null}

                  {reg.status !== 'cancelled' && (
                    <button
                      onClick={() =>
                        openQrModal({
                          title: event.title,
                          subtitle: `Pass: ${reg.ticketCode} • ${currentUser.name}`,
                          code: reg.ticketCode,
                          type: 'ticket',
                        })
                      }
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
                    >
                      <QrCode className="w-4 h-4 text-indigo-500" />
                      <span>Ticket Pass</span>
                    </button>
                  )}

                  <button
                    onClick={() => openEventModal(event)}
                    className="flex-1 md:flex-none px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-colors"
                  >
                    View Details
                  </button>

                  {activeSubTab === 'completed' && (
                    <button
                      onClick={() => openFeedbackModal(event)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 hover:bg-amber-100 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Feedback</span>
                    </button>
                  )}

                  {reg.status !== 'cancelled' && event.status !== 'completed' && event.status !== 'live' && (
                    <button
                      onClick={() => handleCancelRegistration(event.id)}
                      className="flex-1 md:flex-none px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-16 sm:p-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-5">
          <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
            <CalendarCheck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {activeSubTab === 'cancelled'
              ? 'No cancelled registrations'
              : activeSubTab === 'today'
              ? 'No registered events scheduled for today'
              : activeSubTab === 'completed'
              ? 'No completed events yet'
              : "You haven't registered for any upcoming events yet"}
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Discover workshops, hackathons, and symposiums happening across colleges right now!
          </p>
          <button
            onClick={() => setActiveTab('discover')}
            className="px-7 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition-all"
          >
            Explore Events
          </button>
        </div>
      )}
    </div>
  );
};
