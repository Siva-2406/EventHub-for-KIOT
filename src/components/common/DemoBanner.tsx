import React from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import { ShieldCheck, User, Sparkles, RefreshCw } from 'lucide-react';
import { eventService } from '../../services/eventService';

export const DemoBanner: React.FC = () => {
  const { role, setRole, addToast, refreshData } = useApp();

  const handleResetData = async () => {
    if (window.confirm('Reset all demo events and registrations back to defaults?')) {
      await eventService.resetToDefault();
      localStorage.removeItem('eventhub_registrations_v1');
      localStorage.removeItem('eventhub_notifications_v1');
      await refreshData();
      addToast('Demo State Reset', 'Default mock data has been restored.', 'info');
    }
  };

  return (
    <aside aria-label="Demo announcement banner" className="bg-slate-900 border-b border-indigo-950/60 text-slate-300 text-xs px-4 py-2 relative z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Banner Announcement */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
            PHASE 1 DEMO MODE
          </span>
          <span className="hidden sm:inline text-slate-400">
            Every College Event. One Place. Clean service abstraction prepared for MongoDB Atlas & JWT in Phase 2.
          </span>
        </div>

        {/* Interactive Role Switcher for Judges */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 hidden md:inline font-medium">Switch View:</span>
          <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700/60 shadow-inner">
            <button
              onClick={() => setRole('student')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                role === 'student'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>

            <button
              onClick={() => setRole('host')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                role === 'host'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Host / Organizer</span>
            </button>

            <button
              onClick={() => setRole('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                role === 'admin'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>

          <button
            onClick={handleResetData}
            title="Reset to default mock state"
            className="p-1 rounded-md text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
