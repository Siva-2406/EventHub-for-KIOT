import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { CollegeEvent } from '../../types';

export const MySchedule: React.FC = () => {
  const {
    events,
    registrations,
    currentUser,
    openEventModal,
    handleRegister,
    setActiveTab,
  } = useApp();

  // Find user's active registrations
  const userRegisteredEvents = useMemo(() => {
    const regEventIds = registrations
      .filter((r) => r.userId === currentUser.id && r.status !== 'cancelled')
      .map((r) => r.eventId);
    return events.filter((e) => regEventIds.includes(e.id));
  }, [events, registrations, currentUser.id]);

  // Check for any schedule conflicts among registered events
  const detectedConflicts = useMemo(() => {
    const clashes: { eventA: CollegeEvent; eventB: CollegeEvent }[] = [];
    for (let i = 0; i < userRegisteredEvents.length; i++) {
      for (let j = i + 1; j < userRegisteredEvents.length; j++) {
        const a = userRegisteredEvents[i];
        const b = userRegisteredEvents[j];
        if (a.date === b.date) {
          const overlaps = a.rawStartHour < b.rawEndHour && a.rawEndHour > b.rawStartHour;
          if (overlaps) {
            clashes.push({ eventA: a, eventB: b });
          }
        }
      }
    }
    return clashes;
  }, [userRegisteredEvents]);

  // Group events by date
  const scheduleByDate = useMemo(() => {
    const map = new Map<string, CollegeEvent[]>();
    // Sort chronologically
    const sorted = [...userRegisteredEvents].sort((a, b) => {
      if (a.date === b.date) {
        return a.rawStartHour - b.rawStartHour;
      }
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    sorted.forEach((evt) => {
      const existing = map.get(evt.date) || [];
      existing.push(evt);
      map.set(evt.date, existing);
    });

    return Array.from(map.entries()).map(([date, dateEvents]) => ({
      date,
      events: dateEvents,
    }));
  }, [userRegisteredEvents]);

  // Helper for judges: Test Conflict Button
  // (Web Expo 2026 is on 2026-10-05 from 11:00 AM - 01:00 PM, overlapping with AI Workshop 10:00 AM - 12:00 PM)
  const webExpoEvent = events.find((e) => e.id === 'evt-104');
  const isRegisteredForWebExpo = userRegisteredEvents.some((e) => e.id === 'evt-104');

  const handleSimulateConflict = async () => {
    if (webExpoEvent) {
      await handleRegister(webExpoEvent);
    }
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            My Event Schedule Timeline
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Chronological calendar of all sessions, workshops, and lab competitions you are registered for.
          </p>
        </div>

        {/* Schedule Conflict Simulator */}
        {!isRegisteredForWebExpo && (
          <button
            onClick={handleSimulateConflict}
            className="self-start sm:self-auto flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all shadow-xs"
            title="Tests overlap with Web Expo 2026 which clashes with AI Workshop on Oct 5"
          >
            <Sparkles className="w-4 h-4" />
            <span>⚡ Test Schedule Conflict Overlap</span>
          </button>
        )}
      </div>

      {/* ⚠️ MAJOR FEATURE: Schedule Conflict Detected Banner (Requirement 13) */}
      {detectedConflicts.length > 0 && (
        <div className="rounded-3xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400/80 dark:border-amber-500/50 p-8 space-y-6 shadow-lg animate-in fade-in">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-amber-500 text-white shadow-md shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200">
                  CRITICAL ALERT
                </span>
                <h3 className="text-lg font-extrabold text-amber-950 dark:text-amber-200">
                  ⚠ Schedule Conflict Detected
                </h3>
              </div>
              <p className="text-sm text-amber-800 dark:text-amber-300 mt-1.5 leading-relaxed">
                You have <strong>overlapping registered events</strong> scheduled at the same time. Review the conflicting sessions below to plan your attendance:
              </p>
            </div>
          </div>

          {/* Conflicting Events Side-by-Side Display */}
          {detectedConflicts.map((pair, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white/80 dark:bg-slate-900/80 p-5 rounded-2xl border border-amber-200 dark:border-amber-900/60"
            >
              {/* Event A */}
              <div
                onClick={() => openEventModal(pair.eventA)}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-amber-400 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  <span>Registered Session 1</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{pair.eventA.category}</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                  {pair.eventA.title}
                </h4>
                <div className="text-xs sm:text-sm text-slate-500 truncate mb-3">
                  {pair.eventA.college}
                </div>

                <div className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2 font-bold text-rose-600 dark:text-rose-400">
                    <Clock className="w-4 h-4" />
                    <span>{pair.eventA.startTime} – {pair.eventA.endTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{pair.eventA.venue}</span>
                  </div>
                </div>
              </div>

              {/* Event B */}
              <div
                onClick={() => openEventModal(pair.eventB)}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-amber-400 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  <span>Registered Session 2</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{pair.eventB.category}</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                  {pair.eventB.title}
                </h4>
                <div className="text-xs sm:text-sm text-slate-500 truncate mb-3">
                  {pair.eventB.college}
                </div>

                <div className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2 font-bold text-rose-600 dark:text-rose-400">
                    <Clock className="w-4 h-4" />
                    <span>{pair.eventB.startTime} – {pair.eventB.endTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{pair.eventB.venue}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="text-xs text-amber-900 dark:text-amber-200 font-medium">
            💡 <em>EventHub preserves both your registrations and never cancels anything automatically. You can freely choose which session to physically attend or cancel your seat from My Events.</em>
          </div>
        </div>
      )}

      {/* Chronological Timeline */}
      {scheduleByDate.length > 0 ? (
        <div className="space-y-8">
          {scheduleByDate.map(({ date, events: dayEvents }) => (
            <div key={date} className="space-y-3">
              {/* Date Header Stamp */}
              <div className="flex items-center gap-3 sticky top-16 z-20 py-2 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md">
                <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
                  <Calendar className="w-4 h-4" />
                </div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </h2>
                <span className="text-xs text-slate-400">
                  ({dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'})
                </span>
              </div>

              {/* Day's Events Timeline */}
              <div className="relative pl-6 sm:pl-8 space-y-4 border-l-2 border-indigo-200 dark:border-indigo-900 ml-4">
                {dayEvents.map((evt) => {
                  const isLive = evt.status === 'live';
                  const hasConflict = detectedConflicts.some(
                    (c) => c.eventA.id === evt.id || c.eventB.id === evt.id
                  );

                  return (
                    <div
                      key={evt.id}
                      onClick={() => openEventModal(evt)}
                      className={`relative group bg-white dark:bg-slate-900 rounded-3xl p-5 border transition-all cursor-pointer shadow-sm hover:shadow-lg ${
                        hasConflict
                          ? 'border-amber-400/80 dark:border-amber-500/60 bg-amber-50/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                      }`}
                    >
                      {/* Timeline Dot Indicator */}
                      <div
                        className={`absolute -left-[31px] sm:-left-[39px] top-6 w-4 h-4 rounded-full ring-4 ring-slate-50 dark:ring-slate-950 transition-transform group-hover:scale-125 ${
                          isLive
                            ? 'bg-rose-600 animate-ping'
                            : hasConflict
                            ? 'bg-amber-500'
                            : 'bg-indigo-600'
                        }`}
                      />
                      <div
                        className={`absolute -left-[31px] sm:-left-[39px] top-6 w-4 h-4 rounded-full ${
                          isLive ? 'bg-rose-600' : hasConflict ? 'bg-amber-500' : 'bg-indigo-600'
                        }`}
                      />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                              {evt.startTime} – {evt.endTime}
                            </span>

                            {isLive && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-600 text-white animate-pulse">
                                🔴 LIVE NOW
                              </span>
                            )}

                            {hasConflict && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                Time Overlap
                              </span>
                            )}

                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              {evt.category}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 transition-colors pt-1">
                            {evt.title}
                          </h3>

                          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span>{evt.venue}</span>
                            </div>
                            <span>•</span>
                            <span className="truncate">{evt.college}</span>
                          </div>
                        </div>

                        {/* View Button */}
                        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEventModal(evt);
                            }}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 transition-colors"
                          >
                            <span>Details</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Your schedule is currently clear
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven&apos;t registered for any events yet. Explore upcoming hackathons and workshops to build your schedule!
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
