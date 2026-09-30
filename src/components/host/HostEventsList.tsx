import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  BarChart3,
  Edit,
  Eye,
  PlusCircle,
} from 'lucide-react';

export const HostEventsList: React.FC = () => {
  const { events, openEventModal, setActiveTab } = useApp();
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'approved' | 'live' | 'completed'>('all');

  const hostEvents = events.filter((e) => e.organizerCollege.includes('KIOT'));

  const filtered = hostEvents.filter((e) => {
    if (filterTab === 'pending') return e.approvalStatus === 'pending';
    if (filterTab === 'approved') return e.approvalStatus === 'approved' && e.status !== 'completed' && e.status !== 'live';
    if (filterTab === 'live') return e.status === 'live';
    if (filterTab === 'completed') return e.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Coordinated Events Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your submitted proposals, track administrative approvals, and view attendee rosters.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('create-event')}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Event</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-lg overflow-x-auto no-scrollbar">
        {(['all', 'pending', 'approved', 'live', 'completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`flex-1 min-w-[75px] py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all ${
              filterTab === tab
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Events Cards / Table */}
      <div className="space-y-4">
        {filtered.map((evt) => {
          const isPending = evt.approvalStatus === 'pending';
          const isLive = evt.status === 'live';

          return (
            <div
              key={evt.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              <div className="flex items-start gap-4 min-w-0">
                <img
                  src={evt.bannerUrl}
                  alt={evt.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {evt.category}
                    </span>

                    {isPending ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Pending Admin Approval
                      </span>
                    ) : isLive ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-600 text-white animate-pulse">
                        🔴 LIVE NOW
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        ✓ Approved
                      </span>
                    )}

                    <span className="text-xs text-slate-400">
                      Capacity: {evt.registeredCount} / {evt.capacity}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                    {evt.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>{evt.date}</span>
                    <span>•</span>
                    <span>{evt.venue}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                <button
                  onClick={() => openEventModal(evt)}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>

                <button
                  onClick={() => setActiveTab('participants')}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Roster</span>
                </button>

                <button
                  onClick={() => setActiveTab('host-analytics')}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Analytics</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
