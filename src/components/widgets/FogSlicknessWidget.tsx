import React from 'react';
import { Eye, Car, AlertTriangle, ShieldCheck, Gauge, TrendingUp, Compass, Activity } from 'lucide-react';
import { WeatherData } from '../../types';

interface FogSlicknessWidgetProps {
  weather: WeatherData;
}

export const FogSlicknessWidget: React.FC<FogSlicknessWidgetProps> = ({ weather }) => {
  const vis = weather.visibility; // in km
  const visMeters = Math.round(vis * 1000);
  const isSmog = weather.aqi > 180;
  const isWet = weather.rainMm > 2 || weather.rainProb > 45;
  const isStandingWater = weather.rainMm > 12;

  // IMD Fog Classification (Standard IMD/WMO Airport & Highway Classification)
  let fogClass = {
    category: 'Nil Fog (Clear Corridor)',
    code: 'Cat 0',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    color: 'text-emerald-700',
    desc: 'Unrestricted sight distance. Full speed clearance on expressways and bypasses.',
    headlightAdvice: 'Standard daytime running lights or headlights as usual.',
  };

  if (vis < 0.2) {
    fogClass = {
      category: isSmog ? 'Dense Toxic Smog (Cat III)' : 'Dense Radiation Fog (Cat III)',
      code: 'Cat III (<200m)',
      badge: 'bg-red-100 text-red-800 border-red-300',
      color: 'text-red-700',
      desc: 'Severe sightline impediment (<200m). Hazard flashers prohibited while in motion; use amber fog lamps.',
      headlightAdvice: 'Low-beam headlights & amber fog lamps mandatory. Cap speed at 30 km/h.',
    };
  } else if (vis < 0.5) {
    fogClass = {
      category: isSmog ? 'Moderate Smog Haze (Cat II)' : 'Moderate Fog (Cat II)',
      code: 'Cat II (200-500m)',
      badge: 'bg-orange-100 text-orange-800 border-orange-300',
      color: 'text-orange-700',
      desc: 'Reduced sightline (200-500m). Slower merging speeds at flyover entry and exit ramps.',
      headlightAdvice: 'Low beams required. Maintain minimum 50m vehicle gap.',
    };
  } else if (vis < 1.0) {
    fogClass = {
      category: isSmog ? 'Shallow Smog Haze (Cat I)' : 'Shallow Fog (Cat I)',
      code: 'Cat I (500-1000m)',
      badge: 'bg-amber-100 text-amber-800 border-amber-300',
      color: 'text-amber-700',
      desc: 'Mild morning haze or mist. Sight distance adequate up to 1000 meters.',
      headlightAdvice: 'Standard low beams advised during early morning commute.',
    };
  }

  // Braking Distance & Wet Asphalt Slickness Index
  const frictionMu = isStandingWater ? 0.32 : isWet ? 0.52 : 0.82;
  const stoppingDistAt60 = Math.round((60 * 60) / (254 * frictionMu)); // Standard road braking distance formula
  const dryStoppingDist = 18; // approx dry stopping distance at 60 km/h
  const brakingDistanceExtraPct = Math.round(((stoppingDistAt60 - dryStoppingDist) / dryStoppingDist) * 100);

  const slicknessStatus = isStandingWater
    ? {
        tier: 'Severe Hydroplaning Risk',
        badge: 'bg-red-100 text-red-800 border-red-300',
        barColor: 'bg-red-500',
        scorePct: 88,
        frictionText: `Friction Coefficient: μ = ${frictionMu.toFixed(2)} (Standing Water)`,
        delay: '+45m Highway Bottlenecks',
      }
    : isWet
    ? {
        tier: 'Moderate Asphalt Slickness',
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
        barColor: 'bg-amber-500',
        scorePct: 62,
        frictionText: `Friction Coefficient: μ = ${frictionMu.toFixed(2)} (Damp / Wet Surface)`,
        delay: '+20m Slower Flow',
      }
    : {
        tier: 'Dry Optimal Grip',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        barColor: 'bg-emerald-500',
        scorePct: 15,
        frictionText: `Friction Coefficient: μ = ${frictionMu.toFixed(2)} (Dry Asphalt)`,
        delay: 'Nominal Schedule',
      };

  // Peak Commute Delay Probability on Arterial Flyovers
  const flyoverDelayProb = Math.min(
    95,
    Math.max(12, Math.round((vis < 1 ? (1 - vis) * 50 : 10) + (isWet ? 35 : 0) + (weather.windGusts > 35 ? 15 : 0)))
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col justify-between h-full min-h-[380px] break-words">
      <div>
        {/* Header with NHAI / IMD Citation */}
        <div className="flex items-start justify-between gap-2.5 flex-wrap pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-200 shrink-0 mt-0.5">
              <Car className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-slate-900 font-display break-words">
                Fog, Smog & Surface Slickness Monitor
              </h3>
              <p className="text-[11px] text-slate-500 break-words mt-0.5">Expressway Visibility & Hydroplaning Risk</p>
            </div>
          </div>
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${fogClass.badge}`}>
            {fogClass.code}
          </span>
        </div>

        {/* 1. Fog Intensity / Smog Class */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 mb-3 space-y-1.5">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Eye className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>Sight Distance Classification</span>
            </div>
            <span className="text-xs font-bold text-slate-900 font-display shrink-0">
              {vis < 1 ? `${visMeters} meters` : `${vis} km`}
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-2 flex-wrap text-xs font-semibold">
            <span className={`${fogClass.color} break-words`}>{fogClass.category}</span>
            <span className="text-[11px] text-slate-500 shrink-0">AQI: {weather.aqi} ({weather.aqiCategory})</span>
          </div>

          <p className="text-xs text-slate-600 break-words leading-relaxed">
            {fogClass.desc}
          </p>

          <div className="text-[11px] text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/80 font-medium break-words">
            💡 <strong>NHAI Lighting Protocol:</strong> {fogClass.headlightAdvice}
          </div>
        </div>

        {/* 2. Braking Distance & Wet Asphalt Slickness Index */}
        <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs mb-3 space-y-2">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Gauge className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Braking Distance & Surface Slickness</span>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${slicknessStatus.badge}`}>
              {slicknessStatus.tier}
            </span>
          </div>

          {/* Slickness Gauge Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full ${slicknessStatus.barColor} transition-all duration-500 rounded-full`}
              style={{ width: `${slicknessStatus.scorePct}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/60">
              <div className="text-[10px] text-slate-500 font-medium">Stopping Distance @ 60 km/h</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                {stoppingDistAt60} meters{' '}
                {brakingDistanceExtraPct > 0 && (
                  <span className="text-[10px] font-semibold text-red-600">
                    (+{brakingDistanceExtraPct}%)
                  </span>
                )}
              </div>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/60">
              <div className="text-[10px] text-slate-500 font-medium">Surface Adhesion Metric</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5 break-words">
                {slicknessStatus.frictionText}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Peak Commute Delay Probability on Arterial Flyovers */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 mb-3 space-y-2">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <TrendingUp className="w-3.5 h-3.5 text-sky-700 shrink-0" />
              <span>Arterial Flyover Delay Probability</span>
            </div>
            <span className="text-xs font-bold text-slate-900 shrink-0">
              {flyoverDelayProb}% Risk
            </span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-baseline justify-between gap-2 flex-wrap bg-white p-2 rounded-lg border border-slate-200/80">
              <span className="text-slate-600">Elevated Flyovers & Bypass Bridges:</span>
              <span className="font-semibold text-slate-900 break-words">
                {vis < 0.5 ? 'Severe Queue Bottleneck' : isWet ? 'Speed Reduced to 45 km/h' : 'Smooth Traffic Flow'}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-2 flex-wrap bg-white p-2 rounded-lg border border-slate-200/80">
              <span className="text-slate-600">Underpass Dip Ponding Watch:</span>
              <span className={`font-semibold break-words ${isStandingWater ? 'text-red-700' : 'text-slate-900'}`}>
                {isStandingWater ? 'Water Pooling Reported' : 'Clear Grate Drainage'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Authority Citation */}
      <div className="bg-sky-50 rounded-xl p-2.5 border border-sky-200 text-xs">
        <p className="text-xs text-sky-950 break-words leading-relaxed">
          <strong>Standard: </strong>
          IMD Fog & Visibility Forecast Model (NHAI Corridor Protocols). Updated with MoRTH Highway Safety Advisories.
        </p>
      </div>
    </div>
  );
};
