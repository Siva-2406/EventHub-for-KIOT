import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Users,
  CheckCircle2,
  TrendingUp,
  PlusCircle,
  BarChart3,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const HostDashboard: React.FC = () => {
  const { events, registrations, currentUser, setActiveTab, openEventModal } = useApp();

  // Events coordinated by this host or college
  const hostEvents = events.filter((e) => e.organizerCollege.includes('KIOT'));
  const totalRegistrations = hostEvents.reduce((acc, e) => acc + e.registeredCount, 0);
  const upcomingCount = hostEvents.filter((e) => e.status === 'upcoming').length;
  const liveCount = hostEvents.filter((e) => e.status === 'live').length;
  const pendingCount = hostEvents.filter((e) => e.approvalStatus === 'pending').length;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-indigo-800/60 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
            Host / Coordinator Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
            Welcome back, {currentUser.name.split(' ')[0]}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Manage your campus sessions, track registrations, verify participant attendance, and monitor feedback analytics.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('create-event')}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-white text-indigo-950 hover:bg-slate-100 shadow-xl transition-all self-start sm:self-auto shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-indigo-600" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Statistics Cards (Requirement 25) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Events</span>
            <Calendar className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {hostEvents.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across 4 departments</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Registrations</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {totalRegistrations}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            +18% from last month
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Upcoming & Live</span>
            <Clock className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {upcomingCount + liveCount}
          </div>
          <div className="text-[11px] text-rose-500 font-semibold mt-1">
            {liveCount} live right now
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg. Attendance</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">
            86.4%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Based on QR check-ins</div>
        </div>
      </div>

      {/* Visual Analytics Charts (SVG Based) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registrations Trend Bar Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Registrations by Month
              </h3>
              <p className="text-xs text-slate-500">Student enrollment growth across 2026</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-xl">
              2026 Term
            </span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-4 px-2">
            {[
              { month: 'Jun', count: 120, height: '40%' },
              { month: 'Jul', count: 190, height: '60%' },
              { month: 'Aug', count: 240, height: '75%' },
              { month: 'Sep', count: 320, height: '95%' },
              { month: 'Oct', count: 280, height: '85%' },
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">
                  {bar.count}
                </span>
                <div
                  className="w-full bg-indigo-100 dark:bg-indigo-950/60 rounded-xl group-hover:bg-indigo-600 transition-all duration-300 relative overflow-hidden"
                  style={{ height: bar.height }}
                >
                  <div className="absolute inset-0 bg-indigo-600/80 rounded-xl" />
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Capacity vs Attendance Doughnut / Gauge */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Capacity Utilization & Turnout
            </h3>
            <p className="text-xs text-slate-500">Average seat occupancy across hosted events</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">MongoDB Tech Odyssey</span>
                <span className="text-emerald-600">128 / 200 (64%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '64%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Python Data Science Workshop</span>
                <span className="text-rose-500">242 / 250 (97% - Few seats)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: '97%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">INFOTRON 2026 Technical Symposium</span>
                <span className="text-indigo-600">310 / 400 (78%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
            <span>Overall campus engagement: <strong>Very High</strong></span>
            <button
              onClick={() => setActiveTab('host-analytics')}
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Detailed Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Coordinated Events Table Preview */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              My Active Events
            </h3>
            <p className="text-xs text-slate-500">Manage participants, attendance check-ins, and session details</p>
          </div>
          <button
            onClick={() => setActiveTab('host-events')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View All ({hostEvents.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {hostEvents.slice(0, 4).map((evt) => (
            <div
              key={evt.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={evt.bannerUrl}
                  alt={evt.title}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {evt.title}
                  </h4>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{evt.date}</span>
                    <span>•</span>
                    <span>{evt.category}</span>
                    <span>•</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {evt.registeredCount} / {evt.capacity} registered
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => openEventModal(evt)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                >
                  View
                </button>
                <button
                  onClick={() => setActiveTab('participants')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100"
                >
                  Roster & Attendance
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
