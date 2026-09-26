import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  Info,
  Layers,
  MapPin,
  RefreshCw,
  SlidersHorizontal,
  Radio,
} from 'lucide-react';
import {
  PersonaId,
  WidgetId,
  City,
  WeatherData,
  AIBriefing,
  AlertColor,
  WeatherAlertItem,
  LanguageCode,
} from './types';
import { PERSONAS } from './data/personas';
import { POPULAR_CITIES } from './data/cities';
import {
  fetchWeatherData,
  WeatherScenario,
  SCENARIO_LABELS,
} from './data/weatherService';
import {
  generateAlertsForState,
  generateTestAlert,
  playAlertChime,
  sendNativeNotification,
} from './data/alertService';
import { t, getLocalizedBriefing } from './data/translations';

import { Header, ThemeMode } from './components/Header';
import { PersonaSelector } from './components/PersonaSelector';
import { AIBriefingCard } from './components/AIBriefingCard';
import { CurrentWeatherHero } from './components/CurrentWeatherHero';
import { CitySelectModal } from './components/CitySelectModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { ToastNotifications } from './components/ToastNotifications';
import { DashboardSkeleton } from './components/DashboardSkeleton';
import { WidgetErrorBoundary } from './components/WidgetErrorBoundary';

// Widgets
import { AqiPollenWidget } from './components/widgets/AqiPollenWidget';
import { UvHealthWidget } from './components/widgets/UvHealthWidget';
import { FitnessWidget } from './components/widgets/FitnessWidget';
import { MarineTidesWidget } from './components/widgets/MarineTidesWidget';
import { TravelWidget } from './components/widgets/TravelWidget';
import { ParentsWidget } from './components/widgets/ParentsWidget';
import { AgrometWidget } from './components/widgets/AgrometWidget';
import { CommuterWidget } from './components/widgets/CommuterWidget';
import { EventComfortWidget } from './components/widgets/EventComfortWidget';
import { RadarSatelliteWidget } from './components/widgets/RadarSatelliteWidget';
import { HourlyTimelineWidget } from './components/widgets/HourlyTimelineWidget';
import { WeeklyOutlookWidget } from './components/widgets/WeeklyOutlookWidget';
import { CoastalSurfWidget } from './components/widgets/CoastalSurfWidget';
import { TripPlannerWidget } from './components/widgets/TripPlannerWidget';
import { CropPestWidget } from './components/widgets/CropPestWidget';
import { FogSlicknessWidget } from './components/widgets/FogSlicknessWidget';
import { BanquetEveningWidget } from './components/widgets/BanquetEveningWidget';

const WIDGET_TITLES: Record<WidgetId, string> = {
  aqi_pollen: 'Air Quality & Pollen Matrix',
  uv_health: 'UV Radiation & Heat Index',
  fitness_hours: 'Outdoor Activity & Diurnal Window',
  marine_tides: 'Ocean State & Coastal Tides',
  coastal_surf: 'Coastal Safety & Surf Condition',
  travel_destinations: 'Inter-City Transit & Flight Hazards',
  trip_planner: 'Destination Weather Radar & Trip Planner',
  family_commute: 'School, Child & Elder Safety Watch',
  agromet_soil: 'Agromet Soil Moisture & Crop Advisory',
  crop_pest: 'Crop Health & Pest Weather Advisory',
  visibility_traffic: 'Fog, Squall & Highway Visibility',
  fog_slickness: 'Fog, Smog & Surface Slickness Monitor',
  event_comfort: 'Public Event & Wet-Bulb Heat Index',
  banquet_evening: 'Extended Banquet & Evening Rain Timeline',
  radar_satellite: 'IMD Doppler Radar & INSAT-3DR Satellite',
  hourly_timeline: '24-Hour Synoptic Progression',
  weekly_outlook: '7-Day Medium Range Outlook',
};

const THEME_STORAGE_KEY = 'mausam_theme_mode';
const WEATHER_CACHE_KEY_PREFIX = 'mausam_cached_weather_';
const BRIEFING_CACHE_KEY_PREFIX = 'mausam_cached_briefing_';

export default function App() {
  const [activePersonaId, setActivePersonaId] = useState<PersonaId>('health');
  const [secondaryPersonaId, setSecondaryPersonaId] = useState<PersonaId | null>(null);
  const [selectedCity, setSelectedCity] = useState<City>(POPULAR_CITIES[0]); // New Delhi
  const [scenario, setScenario] = useState<WeatherScenario>('green_normal');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [viewFilter, setViewFilter] = useState<'focused' | 'all'>('focused');

  // Accessibility / Theme Mode State
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'contrast' || saved === 'light') return saved;
    } catch {
      // ignore
    }
    return 'light';
  });

  // Offline and caching state
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [isUsingCachedData, setIsUsingCachedData] = useState<boolean>(false);

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(true);

  const [briefing, setBriefing] = useState<AIBriefing | null>(null);
  const [briefingLoading, setBriefingLoading] = useState<boolean>(false);

  // Notification & Alert System State
  const [alerts, setAlerts] = useState<WeatherAlertItem[]>([]);
  const [toasts, setToasts] = useState<WeatherAlertItem[]>([]);
  const [isAlertDrawerOpen, setIsAlertDrawerOpen] = useState<boolean>(false);

  const activePersona =
    PERSONAS.find((p) => p.id === activePersonaId) || PERSONAS[0];
  const secondaryPersona = secondaryPersonaId
    ? PERSONAS.find((p) => p.id === secondaryPersonaId) || null
    : null;

  // Sync theme changes to documentElement
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    } catch {
      // ignore
    }

    const root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-contrast');
    if (themeMode === 'dark') {
      root.classList.add('theme-dark');
    } else if (themeMode === 'contrast') {
      root.classList.add('theme-contrast');
    }
  }, [themeMode]);

  // Online / Offline network listeners
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load weather data with robust offline fallback caching
  const loadWeather = useCallback(async () => {
    setWeatherLoading(true);
    const cacheKey = `${WEATHER_CACHE_KEY_PREFIX}${selectedCity.id}_${scenario}`;

    try {
      const data = await fetchWeatherData(selectedCity, scenario);
      setWeather(data);
      setIsUsingCachedData(false);

      // Cache successful response to localStorage
      try {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            timestamp: Date.now(),
            data,
          })
        );
        localStorage.setItem(
          'mausam_cached_weather_latest',
          JSON.stringify({
            timestamp: Date.now(),
            data,
          })
        );
      } catch (storageErr) {
        console.warn('Could not cache weather payload to localStorage:', storageErr);
      }
    } catch (err) {
      console.warn('Network / API error fetching weather, checking cache:', err);
      // Attempt to load from offline cache
      try {
        const cachedRaw =
          localStorage.getItem(cacheKey) || localStorage.getItem('mausam_cached_weather_latest');
        if (cachedRaw) {
          const parsed = JSON.parse(cachedRaw);
          if (parsed && parsed.data) {
            setWeather(parsed.data);
            setIsUsingCachedData(true);
            return;
          }
        }
      } catch (cacheErr) {
        console.error('Failed reading weather cache:', cacheErr);
      }
    } finally {
      setWeatherLoading(false);
    }
  }, [selectedCity, scenario]);

  // Load AI briefing from backend with local cache fallback
  const loadAIBriefing = useCallback(
    async (currentWeather: WeatherData, lang: LanguageCode = language) => {
      setBriefingLoading(true);
      const briefingCacheKey = `${BRIEFING_CACHE_KEY_PREFIX}${selectedCity.id}_${activePersona.id}_${lang}`;

      try {
        const response = await fetch('/api/gemini/briefing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language: lang,
            persona: activePersona,
            secondaryPersona: secondaryPersona
              ? {
                  id: secondaryPersona.id,
                  title: secondaryPersona.title,
                  description: secondaryPersona.description,
                }
              : null,
            city: selectedCity,
            weather: {
              temp: currentWeather.temp,
              feelsLike: currentWeather.feelsLike,
              condition: currentWeather.condition,
              humidity: currentWeather.humidity,
              windSpeed: currentWeather.windSpeed,
              windDirection: currentWeather.windDirection,
              rainProb: currentWeather.rainProb,
              rainMm: currentWeather.rainMm,
              aqi: currentWeather.aqi,
              aqiCategory: currentWeather.aqiCategory,
              uvIndex: currentWeather.uvIndex,
              uvCategory: currentWeather.uvCategory,
              visibility: currentWeather.visibility,
              soilMoisture: currentWeather.soilMoisture,
              seaState: currentWeather.seaState,
            },
            alertLevel: currentWeather.alertLevel,
          }),
        });

        if (!response.ok) {
          throw new Error(`Briefing API error: ${response.status}`);
        }

        const data = await response.json();
        const synthesizedBriefing = {
          ...data.briefing,
          source: data.source || 'gemini-3.8-flash',
        };
        setBriefing(synthesizedBriefing);

        // Cache briefing
        try {
          localStorage.setItem(briefingCacheKey, JSON.stringify(synthesizedBriefing));
        } catch {
          // ignore
        }
      } catch (err) {
        console.warn('Backend briefing error, checking cached briefing or local fallback:', err);
        let cachedBriefing: AIBriefing | null = null;
        try {
          const raw = localStorage.getItem(briefingCacheKey);
          if (raw) {
            cachedBriefing = JSON.parse(raw);
          }
        } catch {
          // ignore
        }

        if (cachedBriefing) {
          setBriefing({
            ...cachedBriefing,
            source: 'Cached Briefing',
          });
        } else {
          // Fallback localized synthesis in selected language
          const fallbackLocalized = getLocalizedBriefing(
            null,
            lang,
            activePersona,
            secondaryPersona,
            selectedCity,
            currentWeather
          );
          setBriefing({
            ...fallbackLocalized,
            source: 'IMD Station Analyst',
          });
        }
      } finally {
        setBriefingLoading(false);
      }
    },
    [activePersona, secondaryPersona, selectedCity, language]
  );

  // Initial load
  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  // When weather is loaded or personas or language change, update AI briefing
  useEffect(() => {
    if (weather) {
      loadAIBriefing(weather, language);
    }
  }, [activePersonaId, secondaryPersonaId, weather?.updatedAt, scenario, language, loadAIBriefing]);

  // Generate automated alerts on meteorological updates or persona switches
  useEffect(() => {
    if (weather) {
      const generated = generateAlertsForState(
        weather,
        selectedCity,
        activePersona,
        secondaryPersona
      );
      setAlerts(generated);

      // If severe alert (Orange or Red), trigger toast notification and audio chime
      if (weather.alertLevel === 'red' || weather.alertLevel === 'orange') {
        const severeAlert = generated.find(
          (a) => a.severity === 'red' || a.severity === 'orange'
        );
        if (severeAlert) {
          setToasts((prev) => {
            if (prev.some((t) => t.id === severeAlert.id)) return prev;
            return [severeAlert, ...prev.slice(0, 2)];
          });
          playAlertChime(severeAlert.severity);
          sendNativeNotification(severeAlert);
        }
      }
    }
  }, [weather, selectedCity, activePersona, secondaryPersona]);

  // Auto-dismiss floating toasts after 8 seconds
  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      setToasts((prev) => prev.slice(0, prev.length - 1));
    }, 8000);
    return () => clearTimeout(timer);
  }, [toasts]);

  // Trigger test alert simulation for judges
  const handleTriggerTestAlert = (testSeverity: AlertColor = 'orange') => {
    const testAlert = generateTestAlert(selectedCity, activePersona, testSeverity);
    setAlerts((prev) => [testAlert, ...prev]);
    setToasts((prev) => [testAlert, ...prev.slice(0, 2)]);
    playAlertChime(testSeverity);
    sendNativeNotification(testAlert);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleMarkAllAlertsAsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const handleClearAllAlerts = () => {
    setAlerts([]);
  };

  const handleToggleAlertRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: !a.read } : a))
    );
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const unreadAlertCount = alerts.filter((a) => !a.read).length;
  const hasSevereAlert = alerts.some(
    (a) => !a.read && (a.severity === 'red' || a.severity === 'orange')
  );

  // Render individual widget by ID with isolated Error Boundary protection
  const renderWidget = (widgetId: WidgetId) => {
    if (!weather) return null;

    let content: React.ReactNode = null;
    switch (widgetId) {
      case 'aqi_pollen':
        content = <AqiPollenWidget key="aqi_pollen" weather={weather} />;
        break;
      case 'uv_health':
        content = <UvHealthWidget key="uv_health" weather={weather} />;
        break;
      case 'fitness_hours':
        content = <FitnessWidget key="fitness_hours" weather={weather} />;
        break;
      case 'marine_tides':
        content = <MarineTidesWidget key="marine_tides" weather={weather} city={selectedCity} />;
        break;
      case 'coastal_surf':
        content = <CoastalSurfWidget key="coastal_surf" weather={weather} city={selectedCity} />;
        break;
      case 'travel_destinations':
        content = <TravelWidget key="travel_destinations" weather={weather} />;
        break;
      case 'trip_planner':
        content = <TripPlannerWidget key="trip_planner" weather={weather} />;
        break;
      case 'family_commute':
        content = <ParentsWidget key="family_commute" weather={weather} />;
        break;
      case 'agromet_soil':
        content = <AgrometWidget key="agromet_soil" weather={weather} />;
        break;
      case 'crop_pest':
        content = <CropPestWidget key="crop_pest" weather={weather} />;
        break;
      case 'visibility_traffic':
        content = <CommuterWidget key="visibility_traffic" weather={weather} />;
        break;
      case 'fog_slickness':
        content = <FogSlicknessWidget key="fog_slickness" weather={weather} />;
        break;
      case 'event_comfort':
        content = <EventComfortWidget key="event_comfort" weather={weather} />;
        break;
      case 'banquet_evening':
        content = <BanquetEveningWidget key="banquet_evening" weather={weather} />;
        break;
      case 'radar_satellite':
        content = (
          <RadarSatelliteWidget
            key="radar_satellite"
            weather={weather}
            city={selectedCity}
          />
        );
        break;
      case 'hourly_timeline':
        content = <HourlyTimelineWidget key="hourly_timeline" weather={weather} />;
        break;
      case 'weekly_outlook':
        content = <WeeklyOutlookWidget key="weekly_outlook" weather={weather} />;
        break;
      default:
        content = null;
    }

    return (
      <WidgetErrorBoundary widgetName={WIDGET_TITLES[widgetId]}>
        {content}
      </WidgetErrorBoundary>
    );
  };

  // Reorder widgets according to active persona
  const allWidgets: WidgetId[] = [
    'aqi_pollen',
    'uv_health',
    'fitness_hours',
    'marine_tides',
    'coastal_surf',
    'travel_destinations',
    'trip_planner',
    'family_commute',
    'agromet_soil',
    'crop_pest',
    'visibility_traffic',
    'fog_slickness',
    'event_comfort',
    'banquet_evening',
    'radar_satellite',
    'hourly_timeline',
    'weekly_outlook',
  ];

  const primaryPrioritized = activePersona.prioritizedWidgets;
  const secondaryPrioritized = secondaryPersona
    ? secondaryPersona.prioritizedWidgets.filter((w) => !primaryPrioritized.includes(w))
    : [];
  const prioritizedWidgetIds = [...primaryPrioritized, ...secondaryPrioritized];
  const secondaryWidgetIds = allWidgets.filter(
    (id) => !prioritizedWidgetIds.includes(id)
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900">
      {/* Official MoES / IMD App Header */}
      <Header
        currentCity={selectedCity}
        onOpenCityModal={() => setIsCityModalOpen(true)}
        onSelectCity={setSelectedCity}
        scenario={scenario}
        onSelectScenario={setScenario}
        weather={weather}
        loading={weatherLoading}
        onRefresh={loadWeather}
        unreadAlertCount={unreadAlertCount}
        hasSevereAlert={hasSevereAlert}
        onOpenAlertDrawer={() => setIsAlertDrawerOpen(true)}
        onTriggerTestAlert={() => handleTriggerTestAlert('orange')}
        language={language}
        onSelectLanguage={setLanguage}
        themeMode={themeMode}
        onSelectThemeMode={setThemeMode}
        isOffline={isOffline}
        isUsingCachedData={isUsingCachedData}
      />

      {/* 8-Persona Switcher / Profile Selector with Hybrid Mode */}
      <PersonaSelector
        activePersonaId={activePersonaId}
        secondaryPersonaId={secondaryPersonaId}
        onSelectPersona={(id) => {
          setActivePersonaId(id);
          if (secondaryPersonaId === id) {
            setSecondaryPersonaId(null);
          }
        }}
        onSelectSecondaryPersona={setSecondaryPersonaId}
        language={language}
      />

      {/* Main Dashboard Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top AI-Generated Personalized Briefing Card */}
        {weather && (
          <AIBriefingCard
            briefing={briefing}
            loading={briefingLoading}
            onRegenerate={() => weather && loadAIBriefing(weather, language)}
            persona={activePersona}
            secondaryPersona={secondaryPersona}
            city={selectedCity}
            weather={weather}
            language={language}
          />
        )}

        {/* Current Weather Hero Overview Card */}
        {weather && <CurrentWeatherHero weather={weather} city={selectedCity} language={language} />}

        {/* Dynamic Widget Grid Section Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex h-2.5 w-2.5 rounded-full bg-sky-600 animate-pulse" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 font-display">
              {t('smartCards', language)} ({activePersona.title}
              {secondaryPersona ? ` + ${secondaryPersona.title}` : ''})
            </h3>
            <span className="text-[11px] bg-sky-100 text-sky-800 font-semibold px-2 py-0.5 rounded-full border border-sky-200">
              {secondaryPersona ? t('hybridMode', language) : 'Reordered for you'}
            </span>
          </div>

          {/* View Filter Toggles */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs self-start sm:self-auto text-xs">
            <button
              onClick={() => setViewFilter('focused')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                viewFilter === 'focused'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{t('personaPriorityCards', language)} ({prioritizedWidgetIds.length})</span>
            </button>
            <button
              onClick={() => setViewFilter('all')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                viewFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t('allModules', language)}</span>
            </button>
          </div>
        </div>

        {/* Prioritized Smart Cards Grid / Skeleton Loading State */}
        {weatherLoading && !weather ? (
          <DashboardSkeleton />
        ) : (
          <div className="space-y-6">
            {/* Landlocked Region Safeguard Notice for Coastal / Beach Persona */}
            {(activePersonaId === 'beach' || secondaryPersonaId === 'beach') && !selectedCity.coastal && (
              <div className="bg-amber-50/95 border border-amber-300 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-950 shadow-xs animate-in fade-in duration-300">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                    <Radio className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-xs font-bold flex items-center gap-2">
                      <span>INCOIS Coastal Observation Relay</span>
                      <span className="text-[10px] font-semibold bg-amber-200/80 text-amber-900 px-2 py-0.2 rounded-full border border-amber-300/60">
                        {selectedCity.name}
                      </span>
                    </div>
                    <p className="text-xs text-amber-900 mt-0.5 font-medium">
                      Landlocked Region: Telemetry routed from nearest coastal station (Mumbai / West Coast Buoy Network)
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100/90 px-2.5 py-1 rounded-lg border border-amber-200/80 self-start sm:self-auto shrink-0">
                  MoES West Coast Array
                </span>
              </div>
            )}

            {/* Primary & Hybrid Prioritized Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prioritizedWidgetIds.map((widgetId) => {
                const isSecondaryWidget = secondaryPrioritized.includes(widgetId);
                return (
                  <div key={widgetId} className="flex flex-col h-full min-h-[390px]">
                    <div className="flex items-center justify-between px-1 mb-1.5 text-xs flex-wrap gap-1.5">
                      <span className="flex items-center gap-1.5 font-semibold text-slate-500 text-[11px] truncate">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${isSecondaryWidget ? 'bg-violet-500' : 'bg-sky-500'}`} />
                        <span className="truncate">{activePersona.title} Module</span>
                      </span>
                      {isSecondaryWidget ? (
                        <span className="bg-violet-100 text-violet-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-violet-200 shrink-0">
                          ★ {t('secondaryFocus', language)} ({secondaryPersona?.title})
                        </span>
                      ) : (
                        <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-sky-200 shrink-0">
                          ★ {t('primaryFocus', language)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col h-full min-h-0">
                      {renderWidget(widgetId)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Additional Complementary Modules (When "All" is active or scrolled) */}
            {viewFilter === 'all' && (
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Additional Synoptic & Sectoral Services
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    (Standard Meteorological Observations)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {secondaryWidgetIds.map((widgetId) => (
                    <div key={widgetId} className="flex flex-col h-full min-h-[390px]">
                      <div className="flex items-center justify-between px-1 mb-1.5 text-xs flex-wrap gap-1.5">
                        <span className="flex items-center gap-1.5 font-semibold text-slate-400 text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
                          <span>Standard IMD Module</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold bg-slate-200/80 px-2 py-0.5 rounded-full border border-slate-300 shrink-0">
                          Synoptic
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col h-full min-h-0">
                        {renderWidget(widgetId)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Official Government Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-sky-500 to-indigo-700 flex items-center justify-center font-bold text-white text-sm">
                मौ
              </div>
              <div>
                <div className="text-white font-bold text-sm">
                  MAUSAM • भारत मौसम विज्ञान विभाग
                </div>
                <div className="text-[11px] text-slate-400">
                  Ministry of Earth Sciences (MoES), Government of India
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-3">
              <span>National Weather Forecasting Centre, New Delhi</span>
              <span>•</span>
              <span>INSAT-3DR & Doppler Radar Network</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <p>
              Advisory Disclaimer: Weather forecasts and biometeorological alert
              levels are generated using IMD Synoptic Models & Open-Meteo
              meteorological APIs.
            </p>
            <p className="shrink-0">
              Mausam Web Portal • IMD MoES © 2026
            </p>
          </div>
        </div>
      </footer>

      {/* City Selection Modal */}
      <CitySelectModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        selectedCity={selectedCity}
        onSelectCity={(city) => setSelectedCity(city)}
      />

      {/* Floating Toast Notifications for Severe & Simulated Alerts */}
      <ToastNotifications
        toasts={toasts}
        onDismiss={handleDismissToast}
        onOpenDrawer={() => setIsAlertDrawerOpen(true)}
      />

      {/* In-App Alert Bell & Notification Drawer */}
      <NotificationDrawer
        isOpen={isAlertDrawerOpen}
        onClose={() => setIsAlertDrawerOpen(false)}
        alerts={alerts}
        onMarkAllAsRead={handleMarkAllAlertsAsRead}
        onClearAll={handleClearAllAlerts}
        onToggleRead={handleToggleAlertRead}
        onDeleteAlert={handleDeleteAlert}
        onTriggerTestAlert={handleTriggerTestAlert}
        currentCity={selectedCity}
        activePersona={activePersona}
        secondaryPersona={secondaryPersona}
      />
    </div>
  );
}
