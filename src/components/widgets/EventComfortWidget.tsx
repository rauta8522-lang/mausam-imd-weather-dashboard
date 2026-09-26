import React from 'react';
import { CalendarDays, Wind, CloudRain, Sparkles, AlertTriangle, ShieldCheck, Thermometer } from 'lucide-react';
import { WeatherData } from '../../types';

interface EventComfortWidgetProps {
  weather: WeatherData;
}

export const EventComfortWidget: React.FC<EventComfortWidgetProps> = ({ weather }) => {
  // Calculate outdoor comfort score (0-100)
  // Ideal: temp ~24-28C, humidity ~40-60%, wind ~10-20km/h, rain ~0%
  let score = 100;
  if (weather.temp > 32) score -= (weather.temp - 32) * 5;
  if (weather.temp < 20) score -= (20 - weather.temp) * 4;
  if (weather.humidity > 70) score -= (weather.humidity - 70) * 0.8;
  if (weather.rainProb > 20) score -= weather.rainProb * 0.5;
  if (weather.windSpeed > 30) score -= (weather.windSpeed - 30) * 1.2;
  score = Math.max(15, Math.min(98, Math.round(score)));

  const getComfortCategory = (s: number) => {
    if (s >= 80) return { label: 'Excellent', color: 'text-emerald-700 bg-emerald-100 border-emerald-300' };
    if (s >= 65) return { label: 'Good Comfort', color: 'text-lime-700 bg-lime-100 border-lime-300' };
    if (s >= 45) return { label: 'Moderate / Plan Fans', color: 'text-amber-700 bg-amber-100 border-amber-300' };
    return { label: 'Challenging / Indoor Preferred', color: 'text-red-700 bg-red-100 border-red-300' };
  };

  const comfortCategory = getComfortCategory(score);
  const marqueeSafe = weather.windGusts < 45;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col justify-between h-full min-h-[380px] break-words">
      <div>
        <div className="flex items-start justify-between gap-2.5 flex-wrap pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0 mt-0.5">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-slate-900 font-display break-words">
                Outdoor Events & Comfort Index
              </h3>
              <p className="text-[11px] text-slate-500 break-words mt-0.5">Weddings, Banquets & Public Gatherings</p>
            </div>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ${comfortCategory.color}`}>
            {comfortCategory.label}
          </span>
        </div>

        {/* Big Score Dial */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 mb-3 flex items-baseline justify-between gap-2 flex-wrap">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold font-display text-slate-900">{score}</span>
              <span className="text-sm text-slate-500 font-medium">/ 100</span>
            </div>
            <div className="text-xs text-slate-600 font-medium mt-0.5 break-words">
              General Guest Outdoor Comfort Score
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-xs font-semibold text-slate-500">Peak Thermal Index</div>
            <div className="text-sm font-bold text-slate-900">{weather.feelsLike}°C RealFeel</div>
          </div>
        </div>

        {/* Structural Wind Stability for Marquees / Tents */}
        <div className="space-y-2 mb-3">
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Temporary Structure Safety (Tents & Stages)
          </div>

          <div className="bg-white rounded-xl p-2.5 border border-slate-200 shadow-2xs text-xs space-y-1.5">
            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <span className="text-slate-600">Peak Wind Gusts</span>
              <span className="font-bold text-slate-800 shrink-0">{weather.windGusts} km/h</span>
            </div>

            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <span className="text-slate-600">Marquee Structural Limit</span>
              <span className={`font-semibold break-words ${marqueeSafe ? 'text-emerald-600' : 'text-red-600'}`}>
                {marqueeSafe ? 'Safe for Fabric Canopies (< 45 km/h)' : 'Ballast Weight Anchoring Mandatory'}
              </span>
            </div>

            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <span className="text-slate-600">Rain Probability Heatmap</span>
              <span className="font-bold text-slate-800 shrink-0">{weather.rainProb}% Peak Today</span>
            </div>
          </div>
        </div>

        {/* Recommended Event Time Windows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Optimal Evening Slot</div>
            <div className="font-bold text-slate-900 mt-0.5">18:00 - 22:30 IST</div>
            <div className="text-[10px] text-slate-500 break-words">Cooler twilight air</div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Indoor Backup Risk</div>
            <div className={`font-bold mt-0.5 break-words ${weather.rainProb > 45 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {weather.rainProb > 45 ? 'High (Keep Hall On Standby)' : 'Low (Open Lawn Safe)'}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-rose-50 rounded-xl p-2.5 border border-rose-200 text-xs">
        <p className="text-xs text-rose-950 break-words leading-relaxed">
          <strong>Planner Action: </strong>
          {weather.rainProb > 40
            ? 'Covered walkways recommended from valet arrival to banquet mandap.'
            : 'Favorable starlight evening. Patio heaters or misting fans optional.'}
        </p>
      </div>
    </div>
  );
};
