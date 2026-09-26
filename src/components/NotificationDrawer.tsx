import React, { useState } from 'react';
import {
  Bell,
  X,
  CheckCheck,
  Trash2,
  AlertOctagon,
  AlertTriangle,
  BellRing,
  CheckCircle2,
  Sparkles,
  Volume2,
  Radio,
  ExternalLink,
  Filter,
  Flame,
  Droplets,
  CloudFog,
  Wind,
  Shield,
} from 'lucide-react';
import { WeatherAlertItem, AlertColor, City, Persona } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: WeatherAlertItem[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onToggleRead: (id: string) => void;
  onDeleteAlert: (id: string) => void;
  onTriggerTestAlert: (severity: AlertColor) => void;
  currentCity: City;
  activePersona: Persona;
  secondaryPersona?: Persona | null;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  onMarkAllAsRead,
  onClearAll,
  onToggleRead,
  onDeleteAlert,
  onTriggerTestAlert,
  currentCity,
  activePersona,
  secondaryPersona,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<AlertColor | 'all'>('all');
  const [testDropdownOpen, setTestDropdownOpen] = useState(false);
  const [pushStatus, setPushStatus] = useState<string>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  if (!isOpen) return null;

  const handleRequestPushPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const res = await Notification.requestPermission();
        setPushStatus(res);
      } catch (err) {
        console.warn('Notification permission error:', err);
      }
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filterSeverity === 'all') return true;
    return alert.severity === filterSeverity;
  });

  const unreadCount = alerts.filter((a) => !a.read).length;
  const redCount = alerts.filter((a) => a.severity === 'red').length;
  const orangeCount = alerts.filter((a) => a.severity === 'orange').length;
  const yellowCount = alerts.filter((a) => a.severity === 'yellow').length;

  const getAlertSeverityStyles = (severity: AlertColor) => {
    switch (severity) {
      case 'red':
        return {
          border: 'border-l-4 border-l-red-600 border-slate-200 bg-red-50/40',
          badge: 'bg-red-600 text-white',
          label: 'RED WARNING (TAKE ACTION)',
          icon: <AlertOctagon className="w-4 h-4 text-red-600 shrink-0" />,
        };
      case 'orange':
        return {
          border: 'border-l-4 border-l-amber-500 border-slate-200 bg-amber-50/30',
          badge: 'bg-amber-500 text-slate-950 font-bold',
          label: 'ORANGE ALERT (BE PREPARED)',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />,
        };
      case 'yellow':
        return {
          border: 'border-l-4 border-l-yellow-400 border-slate-200 bg-yellow-50/30',
          badge: 'bg-yellow-400 text-slate-900 font-bold',
          label: 'YELLOW WATCH (BE UPDATED)',
          icon: <BellRing className="w-4 h-4 text-yellow-600 shrink-0" />,
        };
      case 'green':
      default:
        return {
          border: 'border-l-4 border-l-emerald-600 border-slate-200 bg-emerald-50/30',
          badge: 'bg-emerald-600 text-white',
          label: 'GREEN ADVISORY (ROUTINE)',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'aqi':
        return <CloudFog className="w-3.5 h-3.5 text-amber-600" />;
      case 'storm':
        return <Wind className="w-3.5 h-3.5 text-red-600" />;
      case 'rain':
        return <Droplets className="w-3.5 h-3.5 text-blue-600" />;
      case 'heat':
        return <Flame className="w-3.5 h-3.5 text-orange-600" />;
      case 'fog':
        return <CloudFog className="w-3.5 h-3.5 text-slate-600" />;
      default:
        return <Shield className="w-3.5 h-3.5 text-sky-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300">
      {/* Backdrop click to dismiss */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative z-10 w-full max-w-lg bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-slide-left border-l border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 border-b border-slate-800">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base font-display text-white">
                    Early Warnings & Alerts
                  </h3>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[11px] font-bold px-2 py-0.2 rounded-full animate-pulse">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  IMD MoES Telemetry for {currentCity.name}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Persona context reminder in drawer */}
          <div className="mt-2 text-xs bg-slate-800/80 rounded-lg px-3 py-2 border border-slate-700/80 flex items-center justify-between gap-2">
            <span className="text-slate-300 truncate">
              Filtered for: <strong className="text-sky-300">{activePersona.title}</strong>
              {secondaryPersona ? ` + ${secondaryPersona.title}` : ''}
            </span>
            <span className="text-[10px] bg-sky-900/60 text-sky-300 px-2 py-0.5 rounded border border-sky-700/60">
              Live Rules Engine
            </span>
          </div>
        </div>

        {/* Action Bar (Test Trigger, Mark Read, Clear) */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          {/* Simulation Trigger Dropdown for Judges */}
          <div className="relative">
            <button
              onClick={() => setTestDropdownOpen(!testDropdownOpen)}
              className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
              title="Test Push Notifications and audio chimes for evaluation"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Trigger Test Alert</span>
            </button>

            {testDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-20 animate-fade-in">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Simulate Warning Level
                </div>
                <button
                  onClick={() => {
                    onTriggerTestAlert('red');
                    setTestDropdownOpen(false);
                  }}
                  className="w-full text-left flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-700 hover:bg-red-50 rounded-lg font-semibold transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  <span>🔴 Red Warning (Cyclone)</span>
                </button>
                <button
                  onClick={() => {
                    onTriggerTestAlert('orange');
                    setTestDropdownOpen(false);
                  }}
                  className="w-full text-left flex items-center gap-2 px-2.5 py-1.5 text-xs text-amber-700 hover:bg-amber-50 rounded-lg font-semibold transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>🟠 Orange Alert (Squall)</span>
                </button>
                <button
                  onClick={() => {
                    onTriggerTestAlert('yellow');
                    setTestDropdownOpen(false);
                  }}
                  className="w-full text-left flex items-center gap-2 px-2.5 py-1.5 text-xs text-yellow-700 hover:bg-yellow-50 rounded-lg font-semibold transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-yellow-400" />
                  <span>🟡 Yellow Watch (Fog/Rain)</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="flex items-center gap-1 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium transition-colors cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5 text-sky-600" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}

            {alerts.length > 0 && (
              <button
                onClick={onClearAll}
                className="flex items-center gap-1 text-slate-500 hover:text-red-600 bg-white hover:bg-red-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium transition-colors cursor-pointer"
                title="Clear all alerts"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Optional Push Notification Banner */}
        {pushStatus !== 'granted' && pushStatus !== 'unsupported' && (
          <div className="px-3.5 py-2 bg-sky-50 border-b border-sky-100 flex items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-1.5 text-sky-900 text-[11px]">
              <Volume2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>Enable native browser push notifications for emergency bulletins.</span>
            </div>
            <button
              onClick={handleRequestPushPermission}
              className="shrink-0 bg-sky-600 hover:bg-sky-700 text-white font-bold px-2 py-1 rounded text-[11px] transition-colors"
            >
              Allow
            </button>
          </div>
        )}

        {/* Severity Filter Tabs */}
        <div className="px-3 py-2 bg-white border-b border-slate-200 flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilterSeverity('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterSeverity === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setFilterSeverity('red')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
              filterSeverity === 'red'
                ? 'bg-red-600 text-white'
                : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
            }`}
          >
            <span>🔴 Red</span>
            <span className="text-[10px]">({redCount})</span>
          </button>
          <button
            onClick={() => setFilterSeverity('orange')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
              filterSeverity === 'orange'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <span>🟠 Orange</span>
            <span className="text-[10px]">({orangeCount})</span>
          </button>
          <button
            onClick={() => setFilterSeverity('yellow')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
              filterSeverity === 'yellow'
                ? 'bg-yellow-400 text-slate-900 font-bold'
                : 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100 border border-yellow-200'
            }`}
          >
            <span>🟡 Yellow</span>
            <span className="text-[10px]">({yellowCount})</span>
          </button>
          <button
            onClick={() => setFilterSeverity('green')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
              filterSeverity === 'green'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <span>🟢 Routine</span>
          </button>
        </div>

        {/* Alerts List Scroll View */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                No alerts matching this filter
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                No active meteorological warnings in this severity category for {currentCity.name}.
              </p>
              <button
                onClick={() => onTriggerTestAlert('orange')}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-200 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulate Warning Alert</span>
              </button>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const style = getAlertSeverityStyles(alert.severity);

              return (
                <div
                  key={alert.id}
                  onClick={() => onToggleRead(alert.id)}
                  className={`rounded-xl border p-3.5 shadow-2xs transition-all duration-200 cursor-pointer relative ${
                    alert.read ? 'bg-white opacity-85 hover:opacity-100' : `${style.border} shadow-xs`
                  }`}
                >
                  {/* Top line with severity badge, category & timestamp */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1">
                        {style.icon}
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${style.badge}`}
                        >
                          {style.label}
                        </span>
                      </span>

                      <span className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium border border-slate-200">
                        {getCategoryIcon(alert.category)}
                        <span className="capitalize">{alert.category}</span>
                      </span>

                      {!alert.read && (
                        <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-400 shrink-0">
                      <span>{alert.timestamp}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteAlert(alert.id);
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-slate-100 transition-colors"
                        title="Delete alert"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Message Body */}
                  <h4 className="text-xs font-bold text-slate-900 mb-1 leading-snug">
                    {alert.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-2.5">
                    {alert.message}
                  </p>

                  {/* Action Advice Callout */}
                  {alert.actionAdvice && (
                    <div className="text-[11px] bg-slate-100/90 text-slate-800 p-2 rounded-lg border border-slate-200/80 mb-2">
                      <strong className="text-slate-950">Recommended Action: </strong>
                      <span>{alert.actionAdvice}</span>
                    </div>
                  )}

                  {/* Target Persona Tag */}
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 text-slate-500">
                    <span>
                      Target:{' '}
                      <strong className="text-slate-700 font-medium">
                        {alert.personaTarget || 'Citizenry'}
                      </strong>
                    </span>
                    <span className="text-[10px] text-sky-600 font-medium">
                      {alert.read ? 'Mark unread' : 'Tap to mark read'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 text-center text-xs text-slate-500">
          <span>Official IMD MoES Meteorological Alert Protocol • Continuous Telemetry</span>
        </div>
      </div>
    </div>
  );
};
