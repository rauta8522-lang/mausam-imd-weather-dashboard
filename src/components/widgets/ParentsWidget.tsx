import React from 'react';
import { ShieldAlert, Bus, Sun, CloudRain, Clock, AlertTriangle, CheckCircle2, Car, HeartHandshake, Baby } from 'lucide-react';
import { WeatherData } from '../../types';

interface ParentsWidgetProps {
  weather: WeatherData;
}

export const ParentsWidget: React.FC<ParentsWidgetProps> = ({ weather }) => {
  const isRainy = weather.rainProb > 45;
  const isHot = weather.temp > 35;
  const isPoorAir = weather.aqi > 160;

  // Morning Commute (07:00 - 08:45 IST)
  const morningHour = weather.hourly.find((h) => h.time.includes('07:') || h.time.includes('08:')) || weather.hourly[0];
  const morningRainProb = Math.round((morningHour?.pop ?? weather.rainProb) * 0.7);
  const morningTemp = morningHour?.temp ?? weather.temp;

  const morningCommuteStatus = isRainy
    ? { text: 'Rain Delay Risk', badge: 'bg-amber-100 text-amber-800 border-amber-300', desc: 'Slippery roads and slower school bus transit' }
    : weather.visibility < 1.0
    ? { text: 'Dense Fog Caution', badge: 'bg-yellow-100 text-yellow-800 border-yellow-300', desc: 'Reduced driver visibility on morning routes' }
    : { text: 'Clear & Safe', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300', desc: 'Smooth morning boarding & drop-off' };

  // Afternoon School Pickup (14:00 - 16:00 IST)
  const afternoonHour = weather.hourly.find((h) => h.time.includes('14:') || h.time.includes('15:') || h.time.includes('16:')) || weather.hourly[7] || weather.hourly[0];
  const afternoonTemp = afternoonHour?.temp ?? (weather.temp + 1);
  const afternoonRainProb = Math.min(95, Math.max(afternoonHour?.pop ?? 0, Math.round(weather.rainProb * 1.15)));
  const isAfternoonThunder = afternoonRainProb > 50 || weather.condition.toLowerCase().includes('storm') || weather.condition.toLowerCase().includes('thunder');

  const afternoonPickupStatus = isAfternoonThunder
    ? {
        status: 'Squall / Rain Watch',
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
        textColor: 'text-amber-700',
        desc: `Rain burst probability reaches ${afternoonRainProb}% with potential convective showers. Expect carpool / bus delays.`,
        action: 'Equip child with compact umbrella/raincoat; pre-plan sheltered pickup spots.',
      }
    : afternoonTemp >= 36
    ? {
        status: 'High Afternoon Heat',
        badge: 'bg-orange-100 text-orange-800 border-orange-300',
        textColor: 'text-orange-700',
        desc: `Dismissal temperature peaks at ${afternoonTemp}°C with elevated thermal stress.`,
        action: 'Ensure vehicle AC is cooled before boarding; have oral hydration fluids ready.',
      }
    : {
        status: 'Fair & Stable Pickup',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        textColor: 'text-emerald-700',
        desc: `Favorable afternoon conditions (${afternoonTemp}°C, ${afternoonRainProb}% rain chance). Normal traffic expected.`,
        action: 'Standard dismissal schedule; safe for short walking routes.',
      };

  // Playground & Recess Safety Assessment
  const recessSafety = isHot
    ? { rating: 'Caution (Heat Stress)', color: 'text-amber-600', advice: 'Limit active running under direct sun. Mandate hydration breaks every 15 min.' }
    : isPoorAir
    ? { rating: 'Restricted (Air Quality)', color: 'text-red-600', advice: 'Indoor recess advised. Children with asthma should avoid vigorous exertion outdoors.' }
    : { rating: 'Safe & Pleasant', color: 'text-emerald-600', advice: 'Safe for open-air sports, school yard play, and physical training.' };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col justify-between h-full min-h-[380px] break-words">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2.5 flex-wrap pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100 shrink-0 mt-0.5">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-slate-900 font-display break-words">
                Family & School Safety Monitor
              </h3>
              <p className="text-[11px] text-slate-500 break-words mt-0.5">School Commutes, Recess & Pediatric Biometeorology</p>
            </div>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ${morningCommuteStatus.badge}`}>
            {morningCommuteStatus.text}
          </span>
        </div>

        {/* Dual School Commute Matrix: Morning Drop-off & Afternoon Pickup */}
        <div className="space-y-2.5 mb-3">
          {/* Morning Drop-off */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70">
            <div className="flex items-baseline justify-between gap-2 flex-wrap mb-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Bus className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                <span>Morning School Bus Window (07:00 - 08:45 IST)</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-600 shrink-0">
                {morningTemp}°C • {morningRainProb}% rain
              </span>
            </div>
            <p className="text-xs text-slate-600 break-words leading-relaxed">
              {morningCommuteStatus.desc}.
            </p>
          </div>

          {/* Dedicated Afternoon School Pickup Weather Alert (14:00 - 16:00 IST) */}
          <div className="bg-violet-50/50 rounded-xl p-3 border border-violet-200/80 shadow-2xs">
            <div className="flex items-baseline justify-between gap-2 flex-wrap mb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-violet-950">
                <Car className="w-3.5 h-3.5 text-violet-700 shrink-0" />
                <span>Afternoon School Pickup Alert (14:00 - 16:00 IST)</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${afternoonPickupStatus.badge}`}>
                {afternoonPickupStatus.status}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-2 flex-wrap mb-1">
              <span className="text-xs font-semibold text-slate-700">
                Dismissal Peak: <strong className="text-slate-900">{afternoonTemp}°C</strong>
              </span>
              <span className="text-xs font-medium text-slate-600">
                Rain/Storm Probability: <strong className={afternoonRainProb > 40 ? 'text-amber-700' : 'text-slate-900'}>{afternoonRainProb}%</strong>
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-1.5 break-words">
              {afternoonPickupStatus.desc}
            </p>
            <div className="text-[11px] font-medium text-violet-900 bg-white/80 p-2 rounded-lg border border-violet-100 break-words">
              💡 <strong>Action:</strong> {afternoonPickupStatus.action}
            </div>
          </div>
        </div>

        {/* Afternoon Playground Recess Card with CPCB & IAP Pediatric Safety Badge */}
        <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs mb-3 space-y-2">
          <div className="flex items-baseline justify-between gap-1.5 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>School Recess & Outdoor Play</span>
            </div>
            <span className={`text-xs font-bold shrink-0 ${recessSafety.color}`}>
              {recessSafety.rating}
            </span>
          </div>

          {/* Pediatric Safety Badge */}
          <div className="flex items-center gap-1.5 bg-sky-50 text-sky-800 border border-sky-200 rounded-md p-1.5 text-[11px] font-semibold w-full">
            <Baby className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span className="break-words">
              Guideline: CPCB & Indian Academy of Pediatrics (IAP) Air Quality Advisory
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed break-words">
            {recessSafety.advice} UV Index is {weather.uvIndex} and AQI is {weather.aqi} ({weather.aqiCategory}).
          </p>
        </div>

        {/* Daily Kid Prep Checklist */}
        <div className="space-y-1.5 mb-3">
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Today's School Backpack Kit
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/60 flex items-center gap-1.5 min-w-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="break-words">
                {afternoonRainProb > 35 || weather.rainProb > 40 ? 'Raincoat / Fold Umbrella' : 'Standard Rain Gear Not Needed'}
              </span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/60 flex items-center gap-1.5 min-w-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="break-words">
                {weather.temp > 32 ? 'Electrolyte Water (750ml)' : 'Hydration Bottle (500ml)'}
              </span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/60 flex items-center gap-1.5 min-w-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="break-words">
                {weather.uvIndex >= 6 ? 'UV Cap / Wide Sunhat' : 'Standard School Cap'}
              </span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/60 flex items-center gap-1.5 min-w-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="break-words">
                {weather.aqi > 150 ? 'Pediatric N95 Mask' : 'Clean Ambient Air'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Health & Safety Footer */}
      <div className="bg-violet-50 rounded-xl p-2.5 border border-violet-200 text-xs">
        <p className="text-xs text-violet-950 break-words leading-relaxed">
          <strong>Pediatric Health Advisory: </strong>
          {weather.aqi > 160
            ? 'IAP guidelines recommend keeping children indoors during high AQI spikes. Ensure school classrooms have active ventilation.'
            : isAfternoonThunder
            ? 'Monsoon/Pre-monsoon squall cells can trigger sudden waterlogging at school gate zones between 14:00 and 16:00 IST.'
            : 'Favorable atmospheric conditions for after-school sports and park visits.'}
        </p>
      </div>
    </div>
  );
};
