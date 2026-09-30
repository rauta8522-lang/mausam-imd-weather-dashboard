import React from 'react';
import { Flame, Sunrise, Sunset, Wind, Droplets, CheckCircle, AlertOctagon } from 'lucide-react';
import { WeatherData } from '../../types';

interface FitnessWidgetProps {
  weather: WeatherData;
}

export const FitnessWidget: React.FC<FitnessWidgetProps> = ({ weather }) => {
  const workoutWindows = [
    {
      time: '05:30 - 07:30',
      label: 'Early Dawn',
      temp: weather.temp - 4,
      status: 'Optimal',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      recommendation: 'Coolest air, light breeze, minimal UV',
    },
    {
      time: '07:30 - 09:30',
      label: 'Morning Run',
      temp: weather.temp - 2,
      status: weather.temp > 34 ? 'Moderate' : 'Good',
      color: 'bg-lime-100 text-lime-800 border-lime-300',
      recommendation: 'hot temprature amit , keep hydration bottle',
    },
    {
      time: '11:00 - 16:00',
      label: 'Mid-Day Sun',
      temp: weather.tempMax,
      status: 'Avoid',
      color: 'bg-red-100 text-red-800 border-red-300',
      recommendation: 'High thermal strain, indoor workout advised',
    },
    {
      time: '17:30 - 19:30',
      label: 'Sunset Cadence',
      temp: weather.temp - 1,
      status: 'Favorable',
      color: 'bg-amber-100 text-amber-800 border-amber-300',
      recommendation: 'Golden twilight, gentle tailwinds',
    },
  ];

  const hydrationRequirement =
    weather.temp > 36 ? '1.0 - 1.2 L/hr' : weather.temp > 30 ? '750 - 900 ml/hr' : '500 - 650 ml/hr';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col justify-between h-full min-h-[380px] break-words">
      <div>
        <div className="flex items-start justify-between gap-2.5 flex-wrap pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shrink-0 mt-0.5">
              <Flame className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-slate-900 font-display break-words">
                Athletic Windows & Thermal Stress
              </h3>
              <p className="text-[11px] text-slate-500 break-words mt-0.5">Runners, Cyclists & Field Athletics</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
            {weather.temp > 35 ? 'High Heat Strain' : 'Good Training Day'}
          </span>
        </div>

        {/* Golden Hour Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/70 flex items-center gap-2.5">
            <Sunrise className="w-4 h-4 text-amber-500 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-[10px] text-slate-500 font-semibold uppercase">Morning Golden Hour</div>
              <div className="text-xs font-bold text-slate-900 break-words">{weather.goldenHourMorning}</div>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/70 flex items-center gap-2.5">
            <Sunset className="w-4 h-4 text-orange-500 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-[10px] text-slate-500 font-semibold uppercase">Evening Golden Hour</div>
              <div className="text-xs font-bold text-slate-900 break-words">{weather.goldenHourEvening}</div>
            </div>
          </div>
        </div>

        {/* Workout Matrix */}
        <div className="space-y-2 mb-3">
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Outdoor Workout Suitability Schedule
          </div>
          {workoutWindows.map((slot, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-2.5 border border-slate-200 shadow-2xs flex items-center justify-between gap-2 flex-wrap"
            >
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <span className="font-mono text-xs font-bold text-slate-900">{slot.time}</span>
                <span className="text-xs text-slate-500 break-words">• {slot.label}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold text-slate-700">{slot.temp}°C</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${slot.color}`}>
                  {slot.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Aerodynamic Wind & Hydration Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
          <div className="bg-slate-50 rounded-lg p-2 border border-slate-200/60">
            <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-0.5">
              <Wind className="w-3 h-3 text-teal-600 shrink-0" />
              <span>Headwind / Resistance</span>
            </div>
            <div className="text-xs font-bold text-slate-900 break-words">
              {weather.windSpeed} km/h {weather.windDirection}
            </div>
            <div className="text-[9px] text-slate-500 break-words">Gusts: {weather.windGusts} km/h</div>
          </div>

          <div className="bg-slate-50 rounded-lg p-2 border border-slate-200/60">
            <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-0.5">
              <Droplets className="w-3 h-3 text-sky-500 shrink-0" />
              <span>Target Hydration</span>
            </div>
            <div className="text-xs font-bold text-slate-900 break-words">{hydrationRequirement}</div>
            <div className="text-[9px] text-slate-500 break-words">Pre-hydrate with electrolytes</div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-200 text-xs">
        <p className="text-xs text-amber-900 break-words leading-relaxed">
          <strong>Cardio Tip: </strong>
          {weather.temp > 35
            ? 'Wet-bulb heat risk elevated. Conclude high-intensity intervals before 07:30 AM.'
            : 'Smooth wind vectors. Favorable cadence conditions along open trails.'}
        </p>
      </div>
    </div>
  );
};
