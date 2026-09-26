import React from 'react';
import { Plane, Luggage, AlertTriangle, CheckCircle2, CloudRain, Wind } from 'lucide-react';
import { WeatherData } from '../../types';

interface TravelWidgetProps {
  weather: WeatherData;
}

export const TravelWidget: React.FC<TravelWidgetProps> = ({ weather }) => {
  const getStatusBadge = (color: string) => {
    switch (color) {
      case 'red':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'orange':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'green':
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col justify-between h-full min-h-[380px] break-words">
      <div>
        <div className="flex items-start justify-between gap-2.5 flex-wrap pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shrink-0 mt-0.5">
              <Plane className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-slate-900 font-display break-words">
                Intercity Transit & Flight Hazards
              </h3>
              <p className="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap mt-0.5 break-words">
                <span>METAR / TAF Synoptic Aviation Feed</span>
                <span className="text-slate-300">•</span>
                <span>AAI & IMD Aerodrome Telemetry</span>
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            METAR / TAF Live
          </span>
        </div>

        {/* Airport Flight Status Cards */}
        <div className="space-y-2 mb-3">
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Saved Hubs & Runway Conditions
          </div>
          {weather.savedDestinations.slice(0, 4).map((dest, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-2.5 border border-slate-200 shadow-2xs flex items-center justify-between gap-2 flex-wrap"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="w-9 text-center font-mono font-bold text-xs bg-slate-100 text-slate-800 py-1 rounded border border-slate-200 shrink-0">
                  {dest.code}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 leading-none break-words">
                    {dest.city}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[200px]">
                    {dest.condition}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-slate-800">{dest.temp}°C</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadge(dest.statusColor)}`}>
                  {dest.flightStatus}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Packing Checklist */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
            <Luggage className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>Smart Packing Checklist</span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-700">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="break-words">
                {weather.rainProb > 40
                  ? 'Water-resistant luggage cover & collapsible umbrella'
                  : 'Light breathable daypack for pleasant weather'}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="break-words">
                {weather.temp > 33
                  ? 'Polarized sunglasses & broad-spectrum sun lotion'
                  : weather.temp < 20
                  ? 'Warm fleece layer & wool blend socks'
                  : 'Standard cotton wear & light windbreaker'}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="break-words">
                {weather.aqi > 150
                  ? 'N95 respirator mask pack for arrival transit'
                  : 'Electrolyte hydration pack for transit hubs'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 rounded-xl p-2.5 border border-indigo-200 text-xs">
        <p className="text-xs text-indigo-950 break-words leading-relaxed">
          <strong>Aviation Advisory: </strong>
          {weather.visibility < 1.5
            ? 'CAT-II/III instrument landing conditions in effect. Expect rolling airport delays.'
            : 'En-route upper winds calm across primary domestic flight corridors.'}
        </p>
      </div>
    </div>
  );
};
