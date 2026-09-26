import React from 'react';
import { Car, Eye, AlertTriangle, Clock, Navigation, CheckCircle2, CloudRain } from 'lucide-react';
import { WeatherData } from '../../types';

interface CommuterWidgetProps {
  weather: WeatherData;
}

export const CommuterWidget: React.FC<CommuterWidgetProps> = ({ weather }) => {
  const isFoggy = weather.visibility < 1.0;
  const isRainy = weather.rainProb > 50;

  const trafficFriction = isFoggy
    ? { level: 'Heavy Delay (+35m)', color: 'text-red-700 bg-red-100 border-red-300' }
    : isRainy
    ? { level: 'Moderate Friction (+20m)', color: 'text-amber-700 bg-amber-100 border-amber-300' }
    : { level: 'Normal Transit (Green)', color: 'text-emerald-700 bg-emerald-100 border-emerald-300' };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col justify-between h-full min-h-[380px] break-words">
      <div>
        <div className="flex items-start justify-between gap-2.5 flex-wrap pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 shrink-0 mt-0.5">
              <Car className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-slate-900 font-display break-words">
                Highway & Corridor Commuter Impact
              </h3>
              <p className="text-[11px] text-slate-500 break-words mt-0.5">Roadways, Metro & Visibility Index</p>
            </div>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ${trafficFriction.color}`}>
            {trafficFriction.level}
          </span>
        </div>

        {/* Visibility Metric Box */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 mb-3">
          <div className="flex items-baseline justify-between gap-2 flex-wrap mb-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Eye className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Expressway Sight Distance</span>
            </div>
            <span className="text-xl font-bold font-display text-slate-900 shrink-0">
              {weather.visibility < 1 ? `${Math.round(weather.visibility * 1000)} meters` : `${weather.visibility} km`}
            </span>
          </div>
          <div className="text-xs text-slate-600 font-medium break-words">
            Status: {weather.visibilityDesc}
          </div>
        </div>

        {/* Peak Rush Hour Windows */}
        <div className="space-y-2 mb-3">
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Peak Commute Traffic Projections
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="bg-white rounded-xl p-2.5 border border-slate-200 shadow-2xs">
              <div className="flex items-baseline justify-between gap-1 flex-wrap text-[11px] font-bold text-slate-800 mb-1">
                <span>Morning Rush</span>
                <span className="text-slate-500 shrink-0">08:00 - 10:30</span>
              </div>
              <div className="text-xs text-slate-600 break-words">
                {isFoggy ? 'Dense fog haze. Use low beams.' : isRainy ? 'Wet tarmac. Speed limit 45 km/h.' : 'Clear arterial corridors.'}
              </div>
            </div>

            <div className="bg-white rounded-xl p-2.5 border border-slate-200 shadow-2xs">
              <div className="flex items-baseline justify-between gap-1 flex-wrap text-[11px] font-bold text-slate-800 mb-1">
                <span>Evening Rush</span>
                <span className="text-slate-500 shrink-0">17:30 - 20:00</span>
              </div>
              <div className="text-xs text-slate-600 break-words">
                {weather.rainProb > 40 ? 'Risk of underpass ponding.' : 'Normal traffic cadence.'}
              </div>
            </div>
          </div>
        </div>

        {/* Roadway Hazard Indicators */}
        <div className="space-y-1.5 text-xs mb-3">
          <div className="flex items-baseline justify-between gap-2 flex-wrap p-2 bg-slate-50 rounded-lg border border-slate-200/60">
            <span className="text-slate-600">Waterlogging Bottlenecks</span>
            <span className={`font-semibold break-words ${weather.rainMm > 25 ? 'text-red-600' : 'text-slate-800'}`}>
              {weather.rainMm > 25 ? 'High Hazard at Low Underpasses' : 'Normal Surface Drainage'}
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-2 flex-wrap p-2 bg-slate-50 rounded-lg border border-slate-200/60">
            <span className="text-slate-600">Metro & Suburban Rail</span>
            <span className="font-semibold text-slate-800 break-words">
              {weather.windGusts > 50 ? 'Speed Restrictions Possible' : 'Operating On Timetable'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-sky-50 rounded-xl p-2.5 border border-sky-200 text-xs">
        <p className="text-xs text-sky-950 break-words leading-relaxed">
          <strong>Traffic Police & IMD Note: </strong>
          {weather.visibility < 1
            ? 'Fog lights required on National Highways. Maintain 3-car safe following distance.'
            : 'Smooth commute velocity across prime city flyovers.'}
        </p>
      </div>
    </div>
  );
};
