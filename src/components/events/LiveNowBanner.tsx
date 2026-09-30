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
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-xl p-8 sm:p-12 lg:p-14 text-white transition-all">
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        {/* Left Information */}
        <div className="max-w-2xl space-y-6">
          {/* Status Pill */}
          <div className="flex items-center gap-3.5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              LIVE NOW ON CAMPUS
            </span>

            <span className="text-xs text-slate-400 font-normal hidden sm:inline">
              Session in progress • Free entry for students
            </span>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              {liveEvent.title}
            </h3>
            <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed font-normal">
              {liveEvent.shortDescription}
            </p>
          </div>

          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 pt-2">
            <div className="flex items-center gap-2 font-medium text-amber-300 bg-amber-400/10 px-4 py-2 rounded-xl border border-amber-400/20">
              <MapPin className="w-4 h-4" />
              <span>{liveEvent.venue}</span>
            </div>

            <div className="flex items-center gap-2 font-medium text-emerald-300 bg-emerald-400/10 px-4 py-2 rounded-xl border border-emerald-400/20">
              <Users className="w-4 h-4" />
              <span>{liveEvent.registeredCount} active attendees</span>
            </div>

            <div className="flex items-center gap-2 text-slate-400 px-2">
              <span>Host:</span>
              <span className="font-semibold text-slate-200">{liveEvent.organizerName}</span>
            </div>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-4 shrink-0">
          <button
            onClick={handleJoinLive}
            className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-xs sm:text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors shadow-sm"
          >
            <Video className="w-4 h-4" />
            <span>JOIN LIVE SESSION</span>
          </button>

          <button
            onClick={() => openEventModal(liveEvent)}
            className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <span>VIEW EVENT DETAILS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
