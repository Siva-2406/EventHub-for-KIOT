import React from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import { ShieldCheck, User, Sparkles, RefreshCw, GraduationCap } from 'lucide-react';
import { eventService } from '../../services/eventService';

export const DemoBanner: React.FC = () => {
  const { role, setRole, addToast, refreshData } = useApp();

  const handleResetData = async () => {
    if (window.confirm('Reset all campus events and registrations back to defaults?')) {
      await eventService.resetToDefault();
      localStorage.removeItem('eventhub_registrations_v1');
      localStorage.removeItem('eventhub_notifications_v1');
      await refreshData();
      addToast('Data Restored', 'Default campus events have been restored.', 'info');
    }
  };

  return (
    <aside aria-label="Campus announcement banner" className="bg-slate-900 border-b border-slate-800 text-slate-300 text-xs px-6 sm:px-10 lg:px-12 py-3 sm:py-3.5 relative z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6">
        {/* Banner Announcement */}
        <div className="flex items-center gap-3.5">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
            KIOT CAMPUS
          </span>
          <span className="hidden sm:inline text-slate-400 text-xs leading-relaxed">
            Knowledge Institute of Technology (KIOT) • Autonomous Institution • Salem, Tamil Nadu
          </span>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 hidden md:inline font-medium">Portal Access:</span>
          <div className="flex items-center bg-slate-800 rounded-xl p-1 gap-1 border border-slate-700/80">
            <button
              onClick={() => setRole('student')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                role === 'student'
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>

            <button
              onClick={() => setRole('host')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                role === 'host'
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Host / Faculty</span>
            </button>

            <button
              onClick={() => setRole('admin')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                role === 'admin'
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>

          <button
            onClick={handleResetData}
            title="Reset events data"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
