import React from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  BellRing,
  CheckCircle2,
  X,
  ExternalLink,
  Volume2,
  ShieldAlert,
} from 'lucide-react';
import { WeatherAlertItem, AlertColor } from '../types';

interface ToastNotificationsProps {
  toasts: WeatherAlertItem[];
  onDismiss: (id: string) => void;
  onOpenDrawer: () => void;
}

export const ToastNotifications: React.FC<ToastNotificationsProps> = ({
  toasts,
  onDismiss,
  onOpenDrawer,
}) => {
  if (toasts.length === 0) return null;

  const getSeverityStyles = (severity: AlertColor) => {
    switch (severity) {
      case 'red':
        return {
          cardBg: 'bg-red-950/95 text-white border-red-500 shadow-2xl shadow-red-950/50',
          badgeBg: 'bg-red-600 text-white border-red-400',
          badgeText: 'RED WARNING (TAKE ACTION)',
          icon: <AlertOctagon className="w-5 h-5 text-red-300 shrink-0 animate-bounce" />,
          accentBar: 'bg-red-500',
        };
      case 'orange':
        return {
          cardBg: 'bg-amber-950/95 text-white border-amber-500 shadow-2xl shadow-amber-950/50',
          badgeBg: 'bg-amber-500 text-slate-900 border-amber-300 font-bold',
          badgeText: 'ORANGE ALERT (BE PREPARED)',
          icon: <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />,
          accentBar: 'bg-amber-500',
        };
      case 'yellow':
        return {
          cardBg: 'bg-yellow-950/95 text-white border-yellow-500 shadow-2xl shadow-yellow-950/40',
          badgeBg: 'bg-yellow-400 text-slate-900 border-yellow-300 font-bold',
          badgeText: 'YELLOW WATCH (BE UPDATED)',
          icon: <BellRing className="w-5 h-5 text-yellow-300 shrink-0" />,
          accentBar: 'bg-yellow-400',
        };
      case 'green':
      default:
        return {
          cardBg: 'bg-slate-900/95 text-white border-emerald-500 shadow-2xl shadow-emerald-950/40',
          badgeBg: 'bg-emerald-600 text-white border-emerald-400',
          badgeText: 'GREEN ADVISORY (ROUTINE)',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />,
          accentBar: 'bg-emerald-500',
        };
    }
  };

  return (
    <div
      aria-live="assertive"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-md w-[calc(100vw-2.5rem)] pointer-events-none"
    >
      {toasts.map((toast) => {
        const style = getSeverityStyles(toast.severity);

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border backdrop-blur-md p-4 transition-all duration-300 animate-slide-up relative overflow-hidden ${style.cardBg}`}
          >
            {/* Top Accent line */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${style.accentBar}`} />

            <div className="flex items-start justify-between gap-2.5 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                  {style.icon}
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${style.badgeBg}`}
                  >
                    {style.badgeText}
                  </span>
                </span>
                <span className="text-[10px] text-slate-300 bg-black/40 px-1.5 py-0.5 rounded">
                  {toast.timestamp}
                </span>
              </div>

              <button
                onClick={() => onDismiss(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                title="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title & Message */}
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white leading-tight font-display">
                {toast.title}
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                {toast.message}
              </p>
              {toast.actionAdvice && (
                <div className="mt-2 text-[11px] font-medium text-amber-200/90 bg-white/10 p-2 rounded-lg border border-white/10">
                  <strong className="text-white">Action: </strong>
                  {toast.actionAdvice}
                </div>
              )}
            </div>

            {/* Footer Action Links */}
            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                <ShieldAlert className="w-3.5 h-3.5 text-sky-400" />
                <span>Target: </span>
                <span className="font-semibold text-white truncate max-w-[150px]">
                  {toast.personaTarget || 'Citizen Advisory'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onDismiss(toast.id);
                    onOpenDrawer();
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold text-sky-300 hover:text-sky-200 underline decoration-sky-400/50 hover:decoration-sky-300 cursor-pointer"
                >
                  <span>View All Alerts</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
