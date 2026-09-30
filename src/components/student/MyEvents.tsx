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
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          My Registered Events
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Keep track of your bookings, entry ticket passes, schedule timings, and attendance.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-md">
        <button
          onClick={() => setActiveSubTab('upcoming')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'upcoming'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Upcoming ({upcomingEvents.length})
        </button>
        <button
          onClick={() => setActiveSubTab('today')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'today'
              ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
          <span>Today ({todayEvents.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('completed')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'completed'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Completed ({completedEvents.length})
        </button>
        <button
          onClick={() => setActiveSubTab('cancelled')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'cancelled'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Cancelled ({cancelledEvents.length})
        </button>
      </div>

      {/* Events List */}
      {currentList.length > 0 ? (
        <div className="space-y-4">
          {currentList.map(({ reg, event }) => {
            const isWaitlist = reg.status === 'waitlisted';

            return (
              <div
                key={reg.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Event Info Left */}
                <div className="flex items-start gap-4 min-w-0">
                  <img
                    src={event.bannerUrl}
                    alt={event.title}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {event.category}
                      </span>

                      {event.status === 'live' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-600 text-white animate-pulse">
                          🔴 LIVE NOW
                        </span>
                      ) : isWaitlist ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          Waitlisted (#{reg.waitlistPosition})
                        </span>
                      ) : reg.status === 'attended' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          ✓ Attended
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                          Confirmed Seat
                        </span>
                      )}
                    </div>

                    <h3
                      onClick={() => openEventModal(event)}
                      className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 hover:text-indigo-600 cursor-pointer"
                    >
                      {event.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {event.college}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300 mt-2">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[180px]">{event.venue}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 w-full md:w-auto">
                  {event.status === 'live' ? (
                    <button
                      onClick={() => {
                        if (event.meetingLink) window.open(event.meetingLink, '_blank');
                      }}
                      className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-sm"
                    >
                      <Video className="w-3.5 h-3.5" />
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
                      className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200"
                    >
                      <QrCode className="w-4 h-4 text-indigo-500" />
                      <span>Ticket Pass</span>
                    </button>
                  )}

                  <button
                    onClick={() => openEventModal(event)}
                    className="flex-1 md:flex-none px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100"
                  >
                    View Details
                  </button>

                  {activeSubTab === 'completed' && (
                    <button
                      onClick={() => openFeedbackModal(event)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 hover:bg-amber-100"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Feedback</span>
                    </button>
                  )}

                  {reg.status !== 'cancelled' && event.status !== 'completed' && event.status !== 'live' && (
                    <button
                      onClick={() => handleCancelRegistration(event.id)}
                      className="flex-1 md:flex-none px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
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
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
          <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
            <CalendarCheck className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {activeSubTab === 'cancelled'
              ? 'No cancelled registrations'
              : activeSubTab === 'today'
              ? 'No registered events scheduled for today'
              : activeSubTab === 'completed'
              ? 'No completed events yet'
              : "You haven't registered for any upcoming events yet"}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Discover workshops, hackathons, and symposiums happening across colleges right now!
          </p>
          <button
            onClick={() => setActiveTab('discover')}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition-all"
          >
            Explore Events
          </button>
        </div>
      )}
    </div>
  );
};
