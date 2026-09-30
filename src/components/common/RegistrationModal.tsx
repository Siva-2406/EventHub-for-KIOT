import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from './Modal';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const RegistrationModal: React.FC = () => {
  const {
    registerModalEvent,
    closeRegisterModal,
    currentUser,
    handleRegister,
    handleWaitlist,
    openQrModal,
  } = useApp();

  const [loading, setLoading] = useState(false);
  const [successTicket, setSuccessTicket] = useState<{ ticketCode: string; waitlist?: boolean } | null>(null);

  if (!registerModalEvent) return null;

  const event = registerModalEvent;
  const isFull = event.registeredCount >= event.capacity || event.status === 'full';
  const availableSeats = Math.max(0, event.capacity - event.registeredCount);

  const onConfirm = async () => {
    setLoading(true);
    try {
      if (isFull) {
        const ok = await handleWaitlist(event);
        if (ok) {
          setSuccessTicket({
            ticketCode: `WL-${event.id.replace('evt-', '')}-${Math.floor(1000 + Math.random() * 9000)}`,
            waitlist: true,
          });
        }
      } else {
        const ok = await handleRegister(event);
        if (ok) {
          setSuccessTicket({
            ticketCode: `EH-${event.id.replace('evt-', '')}-${Math.floor(1000 + Math.random() * 9000)}`,
            waitlist: false,
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccessTicket(null);
    closeRegisterModal();
  };

  return (
    <Modal
      isOpen={!!registerModalEvent}
      onClose={handleClose}
      title={successTicket ? 'Registration Confirmed!' : isFull ? 'Join Event Waitlist' : 'Confirm Registration'}
      maxWidth="md"
    >
      {successTicket ? (
        <div className="text-center py-2 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              {successTicket.waitlist ? 'Placed on Waitlist' : 'You are Registered!'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {successTicket.waitlist
                ? `You have been added to the waitlist for ${event.title}. We'll notify you if a seat opens up!`
                : `A confirmation pass has been added to your profile. Show this ticket code at the entrance.`}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 text-left space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Attendee:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{currentUser.name}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">College:</span>
              <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                {currentUser.college}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-700">
              <span className="text-slate-500">Pass / Ticket Code:</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                {successTicket.ticketCode}
              </span>
            </div>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              onClick={() => {
                handleClose();
                openQrModal({
                  title: event.title,
                  subtitle: `Ticket: ${successTicket.ticketCode} • ${currentUser.name}`,
                  code: successTicket.ticketCode,
                  type: 'ticket',
                });
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <QrCode className="w-4 h-4 text-indigo-500" />
              <span>View Ticket QR</span>
            </button>
            <button
              onClick={handleClose}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Event Preview Summary */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <img
              src={event.bannerUrl}
              alt={event.title}
              className="w-16 h-16 rounded-xl object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
                {event.category}
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 leading-snug truncate">
                {event.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {event.college}
              </p>
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Date</div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">{event.date}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Time</div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">{event.startTime}</div>
              </div>
            </div>

            <div className="col-span-2 flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-slate-400 font-medium">Venue / Mode</div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {event.venue} ({event.mode.toUpperCase()})
                </div>
              </div>
            </div>
          </div>

          {/* Capacity Notice */}
          <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                {isFull ? 'Status: Full Capacity' : `Available Seats:`}
              </span>
            </div>
            <span className={`font-bold ${isFull ? 'text-amber-600' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {isFull ? `Join Waitlist (#${(event.waitlistCount || 0) + 1})` : `${availableSeats} seats remaining`}
            </span>
          </div>

          {/* Attendee Confirmation Info */}
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 px-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              Registering as <strong className="text-slate-700 dark:text-slate-300">{currentUser.name}</strong> ({currentUser.department})
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md ${
                isFull
                  ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
              }`}
            >
              {loading ? (
                <span>Processing...</span>
              ) : isFull ? (
                <>
                  <span>Join Waitlist</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Confirm Registration</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
