import React, { useState, useEffect } from 'react';
import {
  Radio,
  Layers,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Clock,
  Sparkles,
  CloudRain,
  Satellite,
} from 'lucide-react';
import { WeatherData, City } from '../../types';

interface RadarSatelliteWidgetProps {
  weather: WeatherData;
  city: City;
}

interface TimelineStep {
  id: string;
  label: string;
  subLabel: string;
  timeOffsetMin: number;
  xOffset: number;
  yOffset: number;
  intensityMultiplier: number;
}

const TIMELINE_STEPS: TimelineStep[] = [
  {
    id: 't-3h',
    label: 'T-3h',
    subLabel: '3 hrs ago',
    timeOffsetMin: -180,
    xOffset: -22,
    yOffset: -18,
    intensityMultiplier: 0.6,
  },
  {
    id: 't-2h',
    label: 'T-2h',
    subLabel: '2 hrs ago',
    timeOffsetMin: -120,
    xOffset: -12,
    yOffset: -10,
    intensityMultiplier: 0.75,
  },
  {
    id: 't-1h',
    label: 'T-1h',
    subLabel: '1 hr ago',
    timeOffsetMin: -60,
    xOffset: 2,
    yOffset: -4,
    intensityMultiplier: 0.9,
  },
  {
    id: 'now',
    label: 'Now',
    subLabel: 'Live Scan',
    timeOffsetMin: 0,
    xOffset: 16,
    yOffset: 2,
    intensityMultiplier: 1.0,
  },
];

export const RadarSatelliteWidget: React.FC<RadarSatelliteWidgetProps> = ({ weather, city }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [timeIndex, setTimeIndex] = useState<number>(3); // defaults to 'Now'
  const [viewMode, setViewMode] = useState<'radar' | 'satellite'>('radar');
  const [zoom, setZoom] = useState<number>(1.0);

  // Play loop effect: advance every 1.8 seconds when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimeIndex((prev) => (prev + 1) % TIMELINE_STEPS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentStep = TIMELINE_STEPS[timeIndex];

  const handleZoomIn = () => {
    setZoom((z) => Math.min(2.0, Number((z + 0.25).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoom((z) => Math.max(1.0, Number((z - 0.25).toFixed(2))));
  };

  const handleResetZoom = () => {
    setZoom(1.0);
  };

  // Calculate simulated radar frame timestamp
  const getStepTimestamp = (offsetMin: number) => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + offsetMin);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) + ' IST';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col justify-between h-full min-h-[380px] break-words">
      <div>
        {/* Header with Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-2 flex-wrap">
          <div className="flex items-start sm:items-center gap-2 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0 mt-0.5 sm:mt-0">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm font-bold text-slate-900 font-display break-words">
                  Doppler Radar & Satellite
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
                  DWR-500
                </span>
              </div>
              <p className="text-[11px] text-slate-500 break-words mt-0.5">
                {city.name} Observatory • S-Band 250km Nowcast
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs self-start sm:self-auto">
            <button
              onClick={() => setViewMode('radar')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded font-semibold text-xs transition-all cursor-pointer ${
                viewMode === 'radar'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Radio className="w-3 h-3 text-emerald-600" />
              <span>Doppler (dBZ)</span>
            </button>
            <button
              onClick={() => setViewMode('satellite')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded font-semibold text-xs transition-all cursor-pointer ${
                viewMode === 'satellite'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Satellite className="w-3 h-3 text-sky-600" />
              <span>INSAT-3DR IR</span>
            </button>
          </div>
        </div>

        {/* Radar Viewport with Zoom and Overlay Controls */}
        <div className="relative w-full h-52 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden mb-3 select-none">
          {/* Zoomable Container */}
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out origin-center"
            style={{ transform: `scale(${zoom})` }}
          >
            {viewMode === 'radar' ? (
              <>
                {/* Range Rings */}
                <div className="absolute w-44 h-44 rounded-full border border-emerald-500/20" />
                <div className="absolute w-32 h-32 rounded-full border border-emerald-500/30" />
                <div className="absolute w-16 h-16 rounded-full border border-emerald-500/40" />
                {/* Distance Markers */}
                <span className="absolute text-[8px] font-mono text-emerald-500/50 top-1.5 left-1/2 -translate-x-1/2">
                  250 km
                </span>
                <span className="absolute text-[8px] font-mono text-emerald-500/50 top-10 left-1/2 -translate-x-1/2">
                  150 km
                </span>
                <span className="absolute text-[8px] font-mono text-emerald-500/50 top-18 left-1/2 -translate-x-1/2">
                  75 km
                </span>

                {/* Crosshairs */}
                <div className="absolute w-full h-[1px] bg-emerald-500/20" />
                <div className="absolute h-full w-[1px] bg-emerald-500/20" />

                {/* Sweeping Line Animation (Only when loop is active) */}
                {isPlaying && (
                  <div className="absolute w-48 h-48 pointer-events-none animate-radar-sweep flex items-center justify-center">
                    <div className="w-1/2 h-[2px] bg-gradient-to-r from-transparent to-emerald-400 self-center origin-right -translate-x-1/2 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                  </div>
                )}

                {/* Simulated Storm Echo Blobs - Tracked by timeline step */}
                {weather.rainProb > 25 ? (
                  <div
                    className="absolute transition-transform duration-500 ease-out"
                    style={{
                      transform: `translate(${currentStep.xOffset}px, ${currentStep.yOffset}px)`,
                      opacity: currentStep.intensityMultiplier,
                    }}
                  >
                    <div className="w-20 h-14 rounded-full bg-emerald-500/40 blur-md" />
                    <div className="absolute top-2 left-3 w-12 h-9 rounded-full bg-yellow-400/50 blur-xs" />
                    {weather.rainProb > 65 && (
                      <div className="absolute top-3.5 left-5 w-7 h-6 rounded-full bg-red-500/80 blur-2xs" />
                    )}
                  </div>
                ) : (
                  <div className="text-[10px] text-emerald-400/70 font-mono tracking-wider bg-slate-900/60 px-2 py-1 rounded border border-emerald-500/20">
                    [ ECHO: NORMAL BASE REFLECTIVITY &lt;15 dBZ ]
                  </div>
                )}

                {/* Center Station Pin */}
                <div className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] ring-2 ring-emerald-950" />
              </>
            ) : (
              /* Satellite IR Mode */
              <div className="w-full h-full relative flex items-center justify-center bg-radial from-slate-900 to-slate-950">
                {/* Simulated Subcontinent Thermal Cloud Mass */}
                <div
                  className="w-36 h-28 rounded-full bg-sky-600/30 blur-xl transition-transform duration-500"
                  style={{
                    transform: `translate(${currentStep.xOffset * 0.7}px, ${currentStep.yOffset * 0.7}px)`,
                  }}
                />
                <div
                  className="absolute w-24 h-20 rounded-full bg-indigo-500/40 blur-md transition-transform duration-500"
                  style={{
                    transform: `translate(${currentStep.xOffset * 0.8}px, ${currentStep.yOffset * 0.8}px)`,
                  }}
                />
                <div
                  className="absolute w-16 h-12 rounded-full bg-cyan-400/50 blur-xs transition-transform duration-500"
                  style={{
                    transform: `translate(${currentStep.xOffset}px, ${currentStep.yOffset}px)`,
                  }}
                />
                <div className="absolute text-[10px] text-cyan-300 font-mono tracking-wide bg-slate-900/80 px-2 py-0.5 rounded border border-cyan-500/30">
                  INSAT-3DR Channel 10.8µm IR
                </div>
              </div>
            )}
          </div>

          {/* Station Metadata Badge */}
          <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1.5 text-[10px] text-emerald-300 font-mono bg-slate-900/85 backdrop-blur-xs px-2 py-1 rounded border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>
              {city.name} Station • {getStepTimestamp(currentStep.timeOffsetMin)}
            </span>
          </div>

          {/* Zoom Controls Overlay (Top Right) */}
          <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-slate-900/90 backdrop-blur-xs p-1 rounded-lg border border-slate-700">
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 2.0}
              className="p-1 text-slate-300 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800 transition-colors cursor-pointer"
              title="Zoom In"
              aria-label="Zoom In Radar"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono font-bold text-slate-300 px-1">
              {zoom.toFixed(1)}x
            </span>
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 1.0}
              className="p-1 text-slate-300 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800 transition-colors cursor-pointer"
              title="Zoom Out"
              aria-label="Zoom Out Radar"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            {zoom > 1.0 && (
              <button
                onClick={handleResetZoom}
                className="p-1 text-sky-400 hover:text-sky-300 rounded hover:bg-slate-800 transition-colors cursor-pointer ml-0.5"
                title="Reset Zoom"
                aria-label="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Interactive Timeline Controls Bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  isPlaying
                    ? 'bg-emerald-600 text-white shadow-2xs hover:bg-emerald-700'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
                title={isPlaying ? 'Pause Loop' : 'Play Loop'}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3 h-3" />
                    <span>Looping</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    <span>Play</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1 text-[11px] text-slate-600">
                <Clock className="w-3 h-3 text-slate-400" />
                <span className="font-semibold text-slate-800">{currentStep.label}</span>
                <span className="text-slate-400">({currentStep.subLabel})</span>
              </div>
            </div>

            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded border border-emerald-200">
              {getStepTimestamp(currentStep.timeOffsetMin)}
            </span>
          </div>

          {/* Timeline Step Buttons & Slider Indicator */}
          <div className="grid grid-cols-4 gap-1.5">
            {TIMELINE_STEPS.map((step, idx) => {
              const isActive = timeIndex === idx;
              return (
                <button
                  key={step.id}
                  onClick={() => {
                    setTimeIndex(idx);
                    setIsPlaying(false);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex flex-col items-center justify-center transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-bold text-[11px] leading-none">{step.label}</span>
                  <span
                    className={`text-[9px] mt-0.5 ${
                      isActive ? 'text-emerald-400 font-mono' : 'text-slate-400'
                    }`}
                  >
                    {step.timeOffsetMin === 0 ? 'Live' : `${step.timeOffsetMin / 60}h`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reflectivity dBZ Legend */}
        <div className="mb-3">
          <div className="flex justify-between text-[9px] text-slate-400 font-mono mb-1">
            <span>Light (15 dBZ)</span>
            <span>Mod (35 dBZ)</span>
            <span>Heavy (50 dBZ)</span>
            <span>Severe/Hail (65+ dBZ)</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-blue-500 via-emerald-400 via-yellow-400 via-orange-500 to-red-600" />
        </div>

        {/* 3-Hour Nowcast Bulletin */}
        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/70 text-xs">
          <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wide mb-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>IMD Doppler Nowcast • Next 3 Hours</span>
          </div>
          <p className="text-slate-600 text-xs leading-relaxed">
            {weather.rainProb > 60
              ? `Convective storm cells detected moving West-Southwest across ${city.name} district at 22 km/h. Rainfall rate estimated between 15–35 mm/hr during peak pass.`
              : `Normal baseline reflectivity across ${city.name} basin. No significant convective cells observed within a 150 km radius.`}
          </p>
        </div>
      </div>

      <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-200 text-xs mt-3 flex items-center justify-between">
        <p className="text-xs text-emerald-950">
          <strong>Observation Quality: </strong>
          100% Signal-to-Noise • Polarimetric Dual-Pol Online
        </p>
        <span className="text-[10px] text-emerald-700 font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-300">
          Verified IMD MoES
        </span>
      </div>
    </div>
  );
};
