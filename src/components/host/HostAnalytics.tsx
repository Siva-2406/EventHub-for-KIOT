import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Users,
  Star,
  Award,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

export const HostAnalytics: React.FC = () => {
  const { events } = useApp();

  const kiotEvents = events.filter((e) => e.organizerCollege.includes('KIOT'));
  const totalRegistered = kiotEvents.reduce((acc, e) => acc + e.registeredCount, 0);
  const totalCapacity = kiotEvents.reduce((acc, e) => acc + e.capacity, 0);
  const overallOccupancy = Math.round((totalRegistered / totalCapacity) * 100);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Event Performance & Campus Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Real-time metrics on participant registration velocity, attendance rate, and session ratings.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold uppercase text-slate-400">Total Enrolled</div>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {totalRegistered}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across {kiotEvents.length} sessions</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold uppercase text-slate-400">Seat Utilization</div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {overallOccupancy}%
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">High campus demand</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold uppercase text-slate-400">Average Turnout</div>
          <div className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-1">
            81.2%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Physical check-in rate</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold uppercase text-slate-400">Avg. Feedback</div>
          <div className="text-3xl font-black text-amber-500 mt-1 flex items-center gap-1">
            <span>4.8</span>
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Based on student reviews</div>
        </div>
      </div>

      {/* Breakdown per event */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Event Breakdown & Capacity Health
        </h3>

        <div className="space-y-4">
          {kiotEvents.map((evt) => {
            const pct = Math.min(100, Math.round((evt.registeredCount / evt.capacity) * 100));

            return (
              <div
                key={evt.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {evt.title}
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      {evt.date} • {evt.category} • {evt.venue}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {evt.registeredCount} / {evt.capacity} seats ({pct}%)
                    </span>
                  </div>
                </div>

                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      pct >= 95 ? 'bg-rose-500' : pct >= 75 ? 'bg-indigo-600' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
