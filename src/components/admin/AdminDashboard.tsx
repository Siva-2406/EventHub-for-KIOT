import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Users,
  Globe,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { events, registrations, setActiveTab, openEventModal, handleApproveEvent, handleRejectEvent } = useApp();

  const pendingEvents = events.filter((e) => e.approvalStatus === 'pending');
  const liveEvents = events.filter((e) => e.status === 'live');
  const externalEvents = events.filter((e) => e.isExternal);
  const totalRegistrations = registrations.filter((r) => r.status !== 'cancelled').length;

  return (
    <div className="space-y-8 pb-16">
      {/* Admin Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-indigo-900/60 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Central Campus Dean & Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 text-white">
            EventHub Governance & Oversight
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Review cross-campus event submissions, manage student permissions, enforce institutional guidelines, and monitor platform reach.
          </p>
        </div>

        {pendingEvents.length > 0 && (
          <button
            onClick={() => setActiveTab('admin-approvals')}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-xl transition-all self-start sm:self-auto shrink-0"
          >
            <Clock className="w-4 h-4" />
            <span>{pendingEvents.length} Pending Approvals</span>
          </button>
        )}
      </div>

      {/* KPI Cards (Requirement 30) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-slate-400">Total Events</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{events.length}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Platform wide</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-slate-400">Pending Review</div>
          <div className="text-2xl font-black text-amber-500 mt-1">{pendingEvents.length}</div>
          <div className="text-[10px] text-amber-500 font-semibold mt-0.5">Needs action</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-slate-400">Live Sessions</div>
          <div className="text-2xl font-black text-rose-500 mt-1">{liveEvents.length}</div>
          <div className="text-[10px] text-rose-500 font-semibold mt-0.5">Active now</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-slate-400">Registrations</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {totalRegistrations + 1400}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Confirmed seats</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-slate-400">Partner Campuses</div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
            4 Colleges
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Inter-collegiate</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-slate-400">Total Users</div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">2,480</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Students & Faculty</div>
        </div>
      </div>

      {/* Pending Approvals Review Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Pending Event Approvals</span>
              {pendingEvents.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  {pendingEvents.length} awaiting review
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500">
              Approve event proposals to publish them to the student Discover page
            </p>
          </div>

          <button
            onClick={() => setActiveTab('admin-approvals')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View All Approvals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {pendingEvents.length > 0 ? (
          <div className="space-y-3">
            {pendingEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-4 rounded-2xl bg-amber-50/30 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={evt.bannerUrl}
                    alt={evt.title}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">
                      {evt.category} • Submitted by {evt.organizerName}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {evt.title}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {evt.college} • {evt.date} ({evt.startTime}) • Venue: {evt.venue}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                  <button
                    onClick={() => openEventModal(evt)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  >
                    Inspect
                  </button>
                  <button
                    onClick={() => handleRejectEvent(evt.id)}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApproveEvent(evt.id)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm"
                  >
                    Approve ✓
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
            No pending events waiting for verification. All submitted events have been processed!
          </div>
        )}
      </div>

      {/* Phase 2 Architecture Status Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-slate-300 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-white text-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Phase 2 Backend Architecture Prepared</span>
        </div>
        <p className="leading-relaxed">
          The service layer (`eventService`, `registrationService`, `notificationService`) is cleanly abstracted with async signatures. In Phase 2, the client will swap in Express REST endpoints connected to MongoDB Atlas schemas (User, Event, Registration, Attendance, Feedback).
        </p>
      </div>
    </div>
  );
};
