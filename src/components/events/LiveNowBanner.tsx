import React from 'react';
import { useApp } from '../../context/AppContext';
import { Radio, Users, MapPin, Video, ArrowRight, ExternalLink } from 'lucide-react';

export const LiveNowBanner: React.FC = () => {
  const { events, openEventModal, addToast } = useApp();

  // Find live event (e.g. MongoDB Tech Odyssey)
  const liveEvent = events.find((e) => e.status === 'live');

  if (!liveEvent) return null;

  const handleJoinLive = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liveEvent.meetingLink) {
      window.open(liveEvent.meetingLink, '_blank');
      addToast('Opening Live Stream', `Connecting to session for ${liveEvent.title}...`, 'info');
    } else {
      addToast('Physical Session Live', `Please proceed to ${liveEvent.venue} on campus.`, 'info');
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 border border-rose-500/30 shadow-2xl p-6 sm:p-8 text-white transition-all">
      {/* Background Glow effects */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Information */}
        <div className="max-w-2xl space-y-3">
          {/* Animated Status Pill */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              🔴 LIVE NOW ON CAMPUS
            </span>

            <span className="text-xs text-rose-200/80 font-medium hidden sm:inline">
              Session in progress • Free entry for students
            </span>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
              {liveEvent.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
              {liveEvent.shortDescription}
            </p>
          </div>

          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
            <div className="flex items-center gap-1.5 font-medium text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
              <MapPin className="w-3.5 h-3.5" />
              <span>{liveEvent.venue}</span>
            </div>

            <div className="flex items-center gap-1.5 font-medium text-emerald-300 bg-emerald-400/10 px-2.5 py-1 rounded-lg border border-emerald-400/20">
              <Users className="w-3.5 h-3.5" />
              <span>{liveEvent.registeredCount} active attendees</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-300">
              <span>Host:</span>
              <span className="font-semibold text-white">{liveEvent.organizerName}</span>
            </div>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
          <button
            onClick={handleJoinLive}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Video className="w-4 h-4" />
            <span>JOIN LIVE SESSION</span>
          </button>

          <button
            onClick={() => openEventModal(liveEvent)}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>VIEW EVENT DETAILS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
