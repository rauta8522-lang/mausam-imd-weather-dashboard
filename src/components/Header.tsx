import React, { useState } from 'react';
import {
  MapPin,
  RefreshCw,
  Radio,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  Info,
  Navigation,
  Loader2,
  Bell,
  Globe,
  Sun,
  Moon,
  Eye,
  WifiOff,
  CloudCheck,
} from 'lucide-react';
import { City, AlertColor, WeatherData, LanguageCode } from '../types';
import { WeatherScenario, SCENARIO_LABELS } from '../data/weatherService';
import { POPULAR_CITIES } from '../data/cities';
import { SUPPORTED_LANGUAGES, t } from '../data/translations';
import { LanguageSelectModal } from './LanguageSelectModal';

export type ThemeMode = 'light' | 'dark' | 'contrast';

interface HeaderProps {
  currentCity: City;
  onOpenCityModal: () => void;
  onSelectCity: (city: City) => void;
  scenario: WeatherScenario;
  onSelectScenario: (scenario: WeatherScenario) => void;
  weather: WeatherData | null;
  loading: boolean;
  onRefresh: () => void;
  unreadAlertCount?: number;
  hasSevereAlert?: boolean;
  onOpenAlertDrawer: () => void;
  onTriggerTestAlert?: () => void;
  language?: LanguageCode;
  onSelectLanguage?: (lang: LanguageCode) => void;
  themeMode?: ThemeMode;
  onSelectThemeMode?: (mode: ThemeMode) => void;
  isOffline?: boolean;
  isUsingCachedData?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  onOpenCityModal,
  onSelectCity,
  scenario,
  onSelectScenario,
  weather,
  loading,
  onRefresh,
  unreadAlertCount = 0,
  hasSevereAlert = false,
  onOpenAlertDrawer,
  onTriggerTestAlert,
  language = 'en',
  onSelectLanguage,
  themeMode = 'light',
  onSelectThemeMode,
  isOffline = false,
  isUsingCachedData = false,
}) => {
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  const currentLangOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const handleUseGpsLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser');
      setTimeout(() => setGpsError(null), 3500);
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLoading(false);
        const { latitude, longitude } = position.coords;

        // Find closest city in POPULAR_CITIES
        let closest = POPULAR_CITIES[0];
        let minDistance = Infinity;

        POPULAR_CITIES.forEach((c) => {
          const dLat = c.lat - latitude;
          const dLon = c.lon - longitude;
          const dist = Math.sqrt(dLat * dLat + dLon * dLon);
          if (dist < minDistance) {
            minDistance = dist;
            closest = c;
          }
        });

        onSelectCity(closest);
      },
      (error) => {
        setGpsLoading(false);
        let msg = 'Unable to fetch GPS position';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission denied';
        }
        setGpsError(msg);
        setTimeout(() => setGpsError(null), 3500);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const getAlertBadge = (level: AlertColor) => {
    switch (level) {
      case 'red':
        return {
          bg: 'bg-red-600 text-white',
          border: 'border-red-700',
          dot: 'bg-white',
          label: 'RED WARNING (TAKE ACTION)',
          glow: 'animate-alert-glow ring-2 ring-red-400/50',
        };
      case 'orange':
        return {
          bg: 'bg-amber-500 text-white',
          border: 'border-amber-600',
          dot: 'bg-white',
          label: 'ORANGE ALERT (BE PREPARED)',
          glow: 'animate-orange-glow ring-2 ring-amber-400/50',
        };
      case 'yellow':
        return {
          bg: 'bg-yellow-400 text-slate-900',
          border: 'border-yellow-500',
          dot: 'bg-amber-900',
          label: 'YELLOW WATCH (BE UPDATED)',
          glow: '',
        };
      case 'green':
      default:
        return {
          bg: 'bg-emerald-600 text-white',
          border: 'border-emerald-700',
          dot: 'bg-white',
          label: 'GREEN (ROUTINE ADVISORY)',
          glow: '',
        };
    }
  };

  const alertBadge = weather ? getAlertBadge(weather.alertLevel) : getAlertBadge('green');

  // Quick preset shortcuts
  const SHORTCUT_CITY_IDS = ['mumbai', 'delhi', 'shimla', 'roorkee', 'ludhiana'];
  const shortcutCities = SHORTCUT_CITY_IDS.map(
    (id) => POPULAR_CITIES.find((c) => c.id === id) || POPULAR_CITIES[0]
  );

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-lg border-b border-slate-800">
      {/* Tricolor Subtle Top Border */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-amber-500" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-emerald-600" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between py-3 gap-3.5">
          {/* Brand Identity */}
          <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-700 flex items-center justify-center font-bold text-lg shadow-inner border border-sky-400/40 shrink-0">
                <span className="text-xl">मौ</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold tracking-tight font-display text-white whitespace-nowrap">
                    MAUSAM <span className="text-sky-400 font-normal text-sm">मौसम</span>
                  </h1>
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap">
                    IMD • MoES
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate sm:whitespace-normal">
                  India Meteorological Department • National Forecasting Centre
                </p>
              </div>
            </div>

            {/* Mobile Language Selector, Theme, Alert Bell & Refresh */}
            <div className="flex items-center gap-1 md:hidden">
              {/* Accessibility / Theme Mode Toggle (Mobile) */}
              {onSelectThemeMode && (
                <button
                  onClick={() => {
                    const nextMode: ThemeMode =
                      themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'contrast' : 'light';
                    onSelectThemeMode(nextMode);
                  }}
                  className="p-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-all cursor-pointer"
                  title={`Theme: ${themeMode.toUpperCase()} (Tap to switch Light / Dark / High-Contrast)`}
                  aria-label="Toggle Theme Mode"
                >
                  {themeMode === 'contrast' ? (
                    <Eye className="w-4 h-4 text-yellow-400" />
                  ) : themeMode === 'dark' ? (
                    <Moon className="w-4 h-4 text-sky-400" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-400" />
                  )}
                </button>
              )}

              {/* Mobile Searchable Language Trigger Button */}
              <button
                id="btn-open-lang-modal-mobile"
                onClick={() => setIsLangModalOpen(true)}
                className="flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-700 active:scale-95 rounded-lg px-2.5 py-1.5 border border-slate-700 text-xs text-white font-medium transition-all cursor-pointer shadow-xs"
                title="Choose Language / भाषा चुनें (31 Languages)"
              >
                <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="font-semibold text-xs max-w-[80px] truncate">{currentLangOption.nativeLabel}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>

              <button
                onClick={onOpenAlertDrawer}
                className="relative p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                title={t('alerts', language)}
              >
                <Bell className="w-5 h-5 text-sky-400" />
                {unreadAlertCount > 0 && (
                  <span
                    className={`absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full text-[10px] font-bold px-1 text-white shadow-xs ${
                      hasSevereAlert ? 'bg-red-600 animate-pulse' : 'bg-sky-500'
                    }`}
                  >
                    {unreadAlertCount > 9 ? '9+' : unreadAlertCount}
                  </span>
                )}
              </button>

              <button
                onClick={onRefresh}
                disabled={loading}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                title={t('sync', language)}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-sky-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Controls: City Selector, GPS, Scenario Dropdown, Language, Alerts & Refresh */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 justify-start xl:justify-end min-w-0">
            {/* City Selector Button */}
            <button
              onClick={onOpenCityModal}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 px-3 py-1.5 rounded-lg border border-slate-700 text-sm font-medium transition-colors cursor-pointer shrink-0"
            >
              <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
              <div className="text-left">
                <div className="font-semibold text-xs leading-none text-white flex items-center gap-1.5">
                  {currentCity.name}
                  <span className="text-slate-400 text-[10px]">({currentCity.hindiName})</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  {currentCity.state}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 shrink-0" />
            </button>

            {/* Use Current GPS Location Button */}
            <button
              onClick={handleUseGpsLocation}
              disabled={gpsLoading}
              className="flex items-center gap-1.5 bg-sky-950/70 hover:bg-sky-900 text-sky-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-sky-800/80 text-xs font-medium transition-colors cursor-pointer shrink-0"
              title="Detect your nearest city using browser GPS"
            >
              {gpsLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
              ) : (
                <Navigation className="w-3.5 h-3.5 text-sky-400" />
              )}
              <span className="hidden sm:inline">{gpsLoading ? t('detectingGps', language) : t('gpsLocation', language)}</span>
            </button>

            {/* Scenario Simulation Selector (Color Alert Protocol) */}
            <div className="relative flex items-center shrink-0">
              <div className="flex items-center gap-1.5 bg-slate-800/90 rounded-lg px-2.5 py-1.5 border border-slate-700 text-xs">
                <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="text-slate-400 hidden lg:inline">{t('warningProtocol', language)}</span>
                <select
                  aria-label="Select IMD Weather Warning Scenario"
                  value={scenario}
                  onChange={(e) => onSelectScenario(e.target.value as WeatherScenario)}
                  className="bg-transparent text-white font-medium text-xs focus:outline-none cursor-pointer pr-1"
                >
                  <option value="green_normal" className="bg-slate-900 text-emerald-400">
                    🟢 Green ({t('scenarioGreen', language)})
                  </option>
                  <option value="yellow_watch" className="bg-slate-900 text-yellow-400">
                    🟡 Yellow ({t('scenarioYellow', language)})
                  </option>
                  <option value="orange_alert" className="bg-slate-900 text-amber-400">
                    🟠 Orange ({t('scenarioOrange', language)})
                  </option>
                  <option value="red_warning" className="bg-slate-900 text-red-400">
                    🔴 Red ({t('scenarioRed', language)})
                  </option>
                  <option value="live" className="bg-slate-900 text-cyan-400">
                    🛰️ {t('scenarioLive', language)}
                  </option>
                </select>
              </div>
            </div>

            {/* Accessibility / Theme Mode Toggle (Desktop) */}
            {onSelectThemeMode && (
              <div className="hidden sm:flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700 text-xs shrink-0">
                <button
                  onClick={() => onSelectThemeMode('light')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all cursor-pointer ${
                    themeMode === 'light'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Standard Light Theme"
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline text-[11px]">Light</span>
                </button>
                <button
                  onClick={() => onSelectThemeMode('dark')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all cursor-pointer ${
                    themeMode === 'dark'
                      ? 'bg-sky-500 text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Observatory Dark Theme"
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline text-[11px]">Dark</span>
                </button>
                <button
                  onClick={() => onSelectThemeMode('contrast')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all cursor-pointer ${
                    themeMode === 'contrast'
                      ? 'bg-yellow-400 text-black font-extrabold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="High-Contrast GIGW Accessibility Mode"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline text-[11px]">Contrast</span>
                </button>
              </div>
            )}

            {/* Desktop Searchable Language Trigger Button */}
            <button
              id="btn-open-lang-modal-desktop"
              onClick={() => setIsLangModalOpen(true)}
              className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700 active:scale-98 rounded-lg px-3 py-1.5 border border-slate-700 text-xs transition-all cursor-pointer group shadow-xs hover:border-slate-600 shrink-0"
              title="Choose Language / भाषा बदलें (31 Languages available)"
            >
              <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0 group-hover:rotate-12 transition-transform" />
              <span className="text-white font-semibold text-xs">
                {currentLangOption.nativeLabel}
              </span>
              <span className="text-[10px] text-sky-300 font-mono font-bold bg-sky-950/90 px-1.5 py-0.5 rounded border border-sky-800/60">
                {currentLangOption.code.toUpperCase()}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors shrink-0" />
            </button>

            {/* Notification Bell with Badge Counter */}
            <button
              onClick={onOpenAlertDrawer}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                hasSevereAlert
                  ? 'bg-red-950/80 border-red-700 text-red-200 hover:bg-red-900 hover:text-white shadow-xs'
                  : unreadAlertCount > 0
                  ? 'bg-slate-800 hover:bg-slate-700 text-sky-300 border-slate-700 hover:text-white'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Open IMD Early Warnings & Citizen Alerts"
            >
              <Bell className={`w-4 h-4 ${hasSevereAlert ? 'text-red-400 animate-bounce' : 'text-sky-400'}`} />
              <span className="hidden sm:inline">{t('alerts', language)}</span>
              {unreadAlertCount > 0 && (
                <span
                  className={`flex h-4 min-w-[16px] items-center justify-center rounded-full text-[10px] font-bold px-1.5 text-white ${
                    hasSevereAlert ? 'bg-red-600 animate-pulse' : 'bg-sky-500'
                  }`}
                >
                  {unreadAlertCount}
                </span>
              )}
            </button>

            {/* Simulation Button for Judges: Trigger Test Alert */}
            {onTriggerTestAlert && (
              <button
                onClick={onTriggerTestAlert}
                className="hidden lg:flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-amber-100 px-2.5 py-1.5 rounded-lg border border-amber-500/40 text-xs font-bold transition-all cursor-pointer shrink-0"
                title="Trigger Test Alert (plays sound chime & sends toast notification)"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('testAlert', language)}</span>
              </button>
            )}

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={loading}
              className="hidden md:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-700 text-xs transition-colors cursor-pointer shrink-0"
              title="Refresh telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-sky-400' : ''}`} />
              <span>{loading ? t('updating', language) : t('sync', language)}</span>
            </button>
          </div>
        </div>

        {/* City Shortcuts Row & GPS Feedback */}
        <div className="pb-2.5 pt-0.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[11px] text-slate-400 font-medium shrink-0 flex items-center gap-1">
              <span>{t('quickCities', language)}:</span>
            </span>
            {shortcutCities.map((city) => {
              const isSelected = currentCity.id === city.id;
              return (
                <button
                  key={city.id}
                  onClick={() => onSelectCity(city)}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer shrink-0 border ${
                    isSelected
                      ? 'bg-sky-500 text-white border-sky-400 shadow-2xs'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border-slate-700'
                  }`}
                >
                  {city.name}
                  {city.id === 'ludhiana' ? ' (Punjab)' : ''}
                </button>
              );
            })}
          </div>

          {gpsError && (
            <span className="text-[11px] text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800 animate-fade-in">
              {gpsError}
            </span>
          )}
        </div>

        {/* Live Warning Ticker Bar (Color Alert Protocol) */}
        <div className="py-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider shrink-0 transition-all ${alertBadge.bg} ${alertBadge.glow} shadow-2xs`}
            >
              <span className={`w-2 h-2 rounded-full ${alertBadge.dot} animate-pulse`} />
              {alertBadge.label}
            </span>
            <p className="text-slate-300 truncate text-xs">
              <strong className="text-white font-semibold mr-1.5">
                {weather?.alertTitle || 'Observatory Normal'}:
              </strong>
              {weather?.alertDescription ||
                'All standard meteorologic parameters within expected threshold.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 text-[11px] text-slate-400 shrink-0 self-end sm:self-auto">
            {/* Offline / Cached Forecast Pill */}
            {(isOffline || isUsingCachedData) && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-semibold animate-pulse shadow-2xs">
                <WifiOff className="w-3 h-3 text-amber-400" />
                <span>{t('cachedForecastPill', language)}</span>
              </span>
            )}

            {scenario === 'live' ? (
              <span className="flex items-center gap-1 text-cyan-400 font-medium">
                <Radio className="w-3 h-3 animate-pulse" /> Live Telemetry
              </span>
            ) : (
              <span className="flex items-center gap-1 text-slate-400">
                <Info className="w-3 h-3 text-sky-400" /> Scenario Protocol
              </span>
            )}
            <span>{weather?.updatedAt || 'Updated: Just now'}</span>
          </div>
        </div>
      </div>

      {/* Searchable Multilingual Selector Modal */}
      <LanguageSelectModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        selectedLanguage={language}
        onSelectLanguage={(newLang) => {
          if (onSelectLanguage) {
            onSelectLanguage(newLang);
          }
        }}
      />
    </header>
  );
};
