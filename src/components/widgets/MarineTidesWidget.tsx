import React from 'react';
import { Waves, Thermometer, AlertTriangle, Compass, Anchor, Flag, Radio, Info } from 'lucide-react';
import { WeatherData, City } from '../../types';

interface MarineTidesWidgetProps {
  weather: WeatherData;
  city?: City;
}

export const MarineTidesWidget: React.FC<MarineTidesWidgetProps> = ({ weather, city }) => {
  const getSeaStateBadge = (state: WeatherData['seaState']) => {
    switch (state) {
      case 'Rough':
      case 'Very Rough':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Moderate':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Slight':
      case 'Calm':
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  const isLandlocked = city ? !city.coastal : false;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col justify-between h-full min-h-[380px] break-words">
      <div>
        <div className="flex items-start justify-between gap-2.5 flex-wrap pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-100 shrink-0 mt-0.5">
              <Waves className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-slate-900 font-display break-words">
                Ocean State & Coastal Tides
              </h3>
              <p className="text-[11px] text-slate-500 break-words mt-0.5">INCOIS & IMD Coastal Marine Advisory</p>
            </div>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ${getSeaStateBadge(weather.seaState)}`}>
            {weather.seaState} Sea
          </span>
        </div>

        {/* Landlocked Safeguard Alert Chip */}
        {isLandlocked && (
          <div className="mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-900 shadow-2xs">
            <Radio className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
            <div className="text-[11px] leading-snug break-words">
              <span className="font-bold">Landlocked Region:</span> Telemetry routed from nearest coastal station (Mumbai / West Coast Buoy Network)
            </div>
          </div>
        )}

        {/* Big Marine Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1 flex-wrap">
              <Waves className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
              <span>Wave & Swell Height</span>
            </div>
            <div className="text-2xl font-bold font-display text-slate-900">
              {weather.waveHeight} <span className="text-xs font-normal text-slate-600">meters</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 break-words">Swell Period: 8.5s • Direction SSW</div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1 flex-wrap">
              <Thermometer className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>Sea Surface Temp</span>
            </div>
            <div className="text-2xl font-bold font-display text-slate-900">
              {weather.waterTemp}°C
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 break-words">Tropical Coastal Waters</div>
          </div>
        </div>

        {/* Tide Curve Timings */}
        <div className="bg-cyan-50/50 rounded-xl p-3 border border-cyan-100 mb-3">
          <div className="text-[11px] font-bold text-cyan-900 uppercase tracking-wider mb-2 flex items-baseline justify-between gap-1 flex-wrap">
            <span>Astronomical Tide Schedule</span>
            <span className="text-[10px] text-cyan-700 font-medium shrink-0">Chart Datum MSL</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="bg-white rounded-lg p-2.5 border border-cyan-200/60 shadow-2xs">
              <div className="text-[10px] font-bold text-cyan-700">Next High Tide 🌊</div>
              <div className="text-xs font-bold text-slate-900 mt-0.5 break-words">{weather.tideNextHigh}</div>
            </div>
            <div className="bg-white rounded-lg p-2.5 border border-cyan-200/60 shadow-2xs">
              <div className="text-[10px] font-bold text-slate-600">Next Low Tide 🏖️</div>
              <div className="text-xs font-bold text-slate-900 mt-0.5 break-words">{weather.tideNextLow}</div>
            </div>
          </div>

          {/* Graphical Wave / Tide representation */}
          <div className="mt-2.5 h-1.5 w-full bg-cyan-200 rounded-full overflow-hidden flex">
            <div className="w-2/3 bg-cyan-600 rounded-full" />
          </div>
        </div>

        {/* Rip Current & Surfing Conditions */}
        <div className="space-y-2 mb-3 text-xs">
          <div className="flex items-baseline justify-between gap-2 flex-wrap p-2 bg-slate-50 rounded-lg border border-slate-200/60">
            <div className="flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="text-slate-600">Rip Current Risk</span>
            </div>
            <span className={`font-bold shrink-0 ${weather.ripCurrentRisk === 'Severe' || weather.ripCurrentRisk === 'High' ? 'text-red-600' : 'text-slate-800'}`}>
              {weather.ripCurrentRisk}
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-2 flex-wrap p-2 bg-slate-50 rounded-lg border border-slate-200/60">
            <div className="flex items-center gap-1.5">
              <Anchor className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span className="text-slate-600">Fishermen & Boat Advisory</span>
            </div>
            <span className="font-semibold text-slate-800 text-[11px] break-words">
              {weather.seaState === 'Rough' ? 'Do NOT venture into deep sea' : 'Safe for inshore navigation'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-cyan-50 rounded-xl p-2.5 border border-cyan-200 text-xs">
        <p className="text-xs text-cyan-900 break-words leading-relaxed">
          <strong>Lifeguard Flag: </strong>
          {weather.ripCurrentRisk === 'High' || weather.seaState === 'Rough'
            ? 'Yellow/Red Flag hoisted. Swimming restricted to shallow designated safety zones.'
            : 'Green Flag. Calm surf conditions suitable for recreational beach activities.'}
        </p>
      </div>
    </div>
  );
};
