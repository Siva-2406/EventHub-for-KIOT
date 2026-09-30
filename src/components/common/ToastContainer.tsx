import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Info;
        let borderClass = 'border-slate-300 dark:border-slate-700';
        let bgIconClass = 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderClass = 'border-emerald-500/40';
          bgIconClass = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderClass = 'border-amber-500/40';
          bgIconClass = 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          borderClass = 'border-rose-500/40';
          bgIconClass = 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-white dark:bg-slate-900 border ${borderClass} rounded-2xl shadow-xl p-3.5 flex items-start gap-3 transition-all duration-300 transform translate-y-0`}
          >
            <div className={`p-2 rounded-xl shrink-0 ${bgIconClass}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {toast.title}
              </div>
              {toast.message && (
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-normal">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
