import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from './Modal';
import { AlertTriangle, Clock, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { registrationService } from '../../services/registrationService';

export const ConflictModal: React.FC = () => {
  const {
    conflictWarning,
    closeConflictWarning,
    setActiveTab,
    currentUser,
    addToast,
    refreshData,
  } = useApp();

  if (!conflictWarning) return null;

  const { candidateEvent, conflictingEvent } = conflictWarning;

  const handleForceRegister = async () => {
    // Allows student to override if they choose, without automatically cancelling
    const res = await registrationService.registerUser(candidateEvent, currentUser);
    if (res.success) {
      addToast(
        'Registered (Overlap Warning)',
        `Enrolled in ${candidateEvent.title}. You have an overlapping session with ${conflictingEvent.title}.`,
        'warning'
      );
      await refreshData();
      closeConflictWarning();
    }
  };

  const handleGoToSchedule = () => {
    closeConflictWarning();
    setActiveTab('my-schedule');
  };

  return (
    <Modal
      isOpen={!!conflictWarning}
      onClose={closeConflictWarning}
      title="Schedule Conflict Detected"
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Warning Banner */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200">
          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold leading-tight">
              You have overlapping registered events!
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1 leading-relaxed">
              Registering for <strong className="font-semibold">{candidateEvent.title}</strong> will create a time clash with your already registered event <strong className="font-semibold">{conflictingEvent.title}</strong> on {candidateEvent.date}.
            </p>
          </div>
        </div>

        {/* Side-by-Side Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* Conflicting Existing Event */}
          <div className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-800/60 border-2 border-dashed border-slate-300 dark:border-slate-700 relative">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Currently Registered
            </div>
            <h5 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
              {conflictingEvent.title}
            </h5>
            <div className="text-[11px] text-slate-500 truncate mb-3">
              {conflictingEvent.college}
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>{conflictingEvent.date}</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{conflictingEvent.startTime} – {conflictingEvent.endTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{conflictingEvent.venue}</span>
              </div>
            </div>
          </div>

          {/* Candidate New Event */}
          <div className="rounded-2xl p-4 bg-indigo-50/40 dark:bg-indigo-950/20 border-2 border-indigo-500/40 relative">
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
              Event You Wish To Register
            </div>
            <h5 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
              {candidateEvent.title}
            </h5>
            <div className="text-[11px] text-slate-500 truncate mb-3">
              {candidateEvent.college}
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900/60 p-2.5 rounded-xl border border-indigo-200/60 dark:border-indigo-900/60">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>{candidateEvent.date}</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-rose-600 dark:text-rose-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{candidateEvent.startTime} – {candidateEvent.endTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{candidateEvent.venue}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleForceRegister}
            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline font-medium order-2 sm:order-1"
          >
            Register anyway (Keep both)
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto order-1 sm:order-2">
            <button
              onClick={closeConflictWarning}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleGoToSchedule}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all"
            >
              <span>View My Schedule</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
