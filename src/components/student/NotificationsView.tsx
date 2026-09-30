import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    events,
    openEventModal,
    handleMarkNotificationRead,
    handleMarkAllNotificationsRead,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'reminders' | 'updates'>('all');

  const filteredNotifs = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'reminders') return n.type === 'reminder';
    if (activeTab === 'updates') return n.type === 'update' || n.type === 'approval';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Notifications & Smart Reminders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Stay on top of start times, registration deadlines, waitlist openings, and schedule alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllNotificationsRead}
            className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-colors border border-indigo-200 dark:border-indigo-900"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-md">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setActiveTab('unread')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'unread'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setActiveTab('reminders')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'reminders'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Reminders
        </button>
        <button
          onClick={() => setActiveTab('updates')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'updates'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Event Updates
        </button>
      </div>

      {/* List */}
      {filteredNotifs.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifs.map((n) => {
            const isUnread = !n.read;

            return (
              <div
                key={n.id}
                onClick={() => {
                  handleMarkNotificationRead(n.id);
                  if (n.eventId) {
                    const evt = events.find((e) => e.id === n.eventId);
                    if (evt) openEventModal(evt);
                  }
                }}
                className={`p-4 sm:p-5 rounded-3xl border transition-all cursor-pointer flex items-start gap-4 ${
                  isUnread
                    ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                } hover:shadow-md hover:border-indigo-400`}
              >
                {/* Icon based on type */}
                <div
                  className={`p-3 rounded-2xl shrink-0 ${
                    n.type === 'reminder'
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-600'
                      : n.type === 'approval'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                      : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{n.title}</span>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                      )}
                    </h4>
                    <span className="text-xs text-slate-400 shrink-0">{n.timestamp}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {n.message}
                  </p>

                  {n.eventId && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      <span>View Event Details →</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Bell className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            You&apos;re all caught up!
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No unread notifications or event reminders at the moment.
          </p>
        </div>
      )}
    </div>
  );
};
