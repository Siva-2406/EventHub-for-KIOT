import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Calendar,
  Building,
  Check,
} from 'lucide-react';

export const AdminApprovals: React.FC = () => {
  const { events, handleApproveEvent, handleRejectEvent, openEventModal } = useApp();
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const pendingEvents = events.filter((e) => e.approvalStatus === 'pending');
  const approvedEvents = events.filter((e) => e.approvalStatus === 'approved');
  const rejectedEvents = events.filter((e) => e.approvalStatus === 'rejected');

  const currentList = {
    pending: pendingEvents,
    approved: approvedEvents,
    rejected: rejectedEvents,
  }[activeTab];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Event Approvals & Verification Workflow
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review coordinator submissions from KIOT and partner colleges. Approved events immediately appear on the Student Discover page.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-md">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'pending'
              ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <span>Pending ({pendingEvents.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'approved'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Approved ({approvedEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'rejected'
              ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Rejected ({rejectedEvents.length})
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {currentList.length > 0 ? (
          currentList.map((evt) => (
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

                    {evt.approvalStatus === 'pending' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Awaiting Verification
                      </span>
                    ) : evt.approvalStatus === 'approved' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Approved & Live
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                        Rejected
                      </span>
                    )}

                    <span className="text-xs text-slate-400">
                      Capacity: {evt.capacity} seats
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                    {evt.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>Host: <strong>{evt.organizerName}</strong></span>
                    <span>•</span>
                    <span>{evt.college}</span>
                    <span>•</span>
                    <span>{evt.date} ({evt.startTime})</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                <button
                  onClick={() => openEventModal(evt)}
                  className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>

                {evt.approvalStatus === 'pending' && (
                  <>
                    <button
                      onClick={() => handleRejectEvent(evt.id)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApproveEvent(evt.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No events in {activeTab} status
            </h3>
            <p className="text-xs text-slate-500">
              When hosts submit new events or workshops, they will populate here for review.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
