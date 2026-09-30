import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from './Modal';
import { Copy, Check, MessageSquare, Mail, Share2 } from 'lucide-react';

export const ShareModal: React.FC = () => {
  const { shareModalEvent, closeShareModal, addToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!shareModalEvent) return null;

  const event = shareModalEvent;
  const shareUrl = `${window.location.origin}/#event-${event.id}`;
  const shareText = `Check out "${event.title}" hosted at ${event.college} on ${event.date}! Discover more on EventHub.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    addToast('Link Copied', 'Event link copied to your clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
    window.open(url, '_blank');
    addToast('Opening WhatsApp', 'Preparing message share...', 'info');
  };

  const handleEmail = () => {
    const mailto = `mailto:?subject=${encodeURIComponent(`Invitation: ${event.title}`)}&body=${encodeURIComponent(`${shareText}\n\nLink: ${shareUrl}`)}`;
    window.location.href = mailto;
    addToast('Opening Mail Client', 'Drafting event invite email...', 'info');
  };

  return (
    <Modal
      isOpen={!!shareModalEvent}
      onClose={closeShareModal}
      title="Share College Event"
      maxWidth="sm"
    >
      <div className="space-y-4">
        {/* Event Preview */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
              {event.title}
            </h5>
            <p className="text-[11px] text-slate-500 truncate">
              {event.college} • {event.date}
            </p>
          </div>
        </div>

        {/* Copy Link Row */}
        <div>
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Event Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 font-mono truncate focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-sm ${
                copied ? 'bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Social Share Options */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/80 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleEmail}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Mail className="w-4 h-4 text-slate-500" />
            <span>Email</span>
          </button>
        </div>

        <button
          onClick={closeShareModal}
          className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};
