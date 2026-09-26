import React, { useState } from 'react';
import { Bug, Sprout, ShieldAlert, Droplets, Wind, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { WeatherData } from '../../types';

interface CropPestWidgetProps {
  weather: WeatherData;
}

export const CropPestWidget: React.FC<CropPestWidgetProps> = ({ weather }) => {
  const [activeSeason, setActiveSeason] = useState<'kharif' | 'rabi'>('kharif');

  // Fungal/Pest Hazard Index Calculation
  const humidity = weather.humidity;
  const isHighRisk = humidity >= 70 || (weather.rainProb > 50 && weather.temp > 24);
  const isModerateRisk = (humidity >= 52 && humidity < 70) || (humidity < 52 && weather.temp > 28);

  const fungalHazard = isHighRisk
    ? {
        tier: 'High Fungal Hazard',
        badge: 'bg-red-100 text-red-800 border-red-300',
        barColor: 'bg-red-500',
        score: Math.min(94, Math.round(55 + humidity * 0.4)),
        desc: `High risk due to elevated ${humidity}% relative humidity and warm canopy temperature (${weather.temp}°C).`,
        targets: 'Blast in Paddy, Sheath Blight, Downy Mildew, and Stem Borer.',
      }
    : isModerateRisk
    ? {
        tier: 'Moderate Pest Risk',
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
        barColor: 'bg-amber-500',
        score: Math.round(35 + humidity * 0.4),
        desc: `Moderate risk due to ${humidity}% humidity. Ambient dew fosters sucking pests and initial spore germination.`,
        targets: 'Aphids, Whitefly, Brown Planthopper (BPH), and Cercospora Leaf Spot.',
      }
    : {
        tier: 'Low Fungal Hazard',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        barColor: 'bg-emerald-500',
        score: Math.max(18, Math.round(humidity * 0.45)),
        desc: `Low fungal risk with ${humidity}% dry canopy conditions. Stable leaf dryness prevents spore propagation.`,
        targets: 'Thrips and Red Spider Mites in dry soil pockets.',
      };

  // Fertilizer & Spray Retention Index
  const isRainImminent = weather.rainProb > 45;
  const isWindDrifty = weather.windSpeed > 18;

  const sprayRetention = isRainImminent
    ? {
        index: '32% (High Wash-Off Risk)',
        color: 'text-red-700',
        badge: 'bg-red-50 text-red-700 border-red-200',
        status: 'Postpone Chemical & Foliar Spray',
        desc: `Rain likelihood (${weather.rainProb}%) will wash off foliar nutrients and chemical sprays before absorption.`,
        window: 'Delay spraying until rainfall subsides and leaves dry completely.',
      }
    : isWindDrifty
    ? {
        index: '58% (Moderate Wind Drift)',
        color: 'text-amber-700',
        badge: 'bg-amber-50 text-amber-700 border-amber-200',
        status: 'Use Low-Drift Spray Nozzles',
        desc: `Wind velocity (${weather.windSpeed} km/h) exceeds optimal calm thresholds. Droplet drift risk is heightened.`,
        window: 'Spray early morning (06:30 - 08:30 IST) before thermal winds pick up.',
      }
    : {
        index: '88% (Optimal Spray Retention)',
        color: 'text-emerald-700',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        status: 'Optimal Foliar Application Window',
        desc: `Calm wind (${weather.windSpeed} km/h) and moderate humidity ensure maximum leaf adhesion and nutrient uptake.`,
        window: 'Recommended Window: 07:00 - 10:30 IST & 16:30 - 18:00 IST.',
      };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col justify-between h-full min-h-[380px] break-words">
      <div>
        {/* Header with official GKMS • IMD citation */}
        <div className="flex items-start justify-between gap-2.5 flex-wrap pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-lime-50 text-lime-700 flex items-center justify-center border border-lime-200 shrink-0 mt-0.5">
              <Bug className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm font-bold text-slate-900 font-display break-words">
                  Crop Health & Pest Warning
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 break-words mt-0.5">Gramin Krishi Mausam Sewa (GKMS) • IMD</p>
            </div>
          </div>
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${fungalHazard.badge}`}>
            {fungalHazard.tier}
          </span>
        </div>

        {/* Fungal & Pest Hazard Index Card */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 mb-3 space-y-2">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <ShieldAlert className="w-3.5 h-3.5 text-lime-700 shrink-0" />
              <span>Fungal & Pathogen Proliferation Risk</span>
            </div>
            <span className="text-xs font-bold text-slate-800 shrink-0">
              Risk Index: {fungalHazard.score}/100
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full ${fungalHazard.barColor} transition-all duration-500 rounded-full`}
              style={{ width: `${fungalHazard.score}%` }}
            />
          </div>

          <p className="text-xs text-slate-600 break-words leading-relaxed">
            {fungalHazard.desc}
          </p>
          <div className="text-[11px] text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/80 break-words">
            <strong className="text-slate-900">Vulnerable Pathogens:</strong> {fungalHazard.targets}
          </div>
        </div>

        {/* Active Seasonal Crop Advice (Kharif / Rabi standing crop recommendations) */}
        <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs mb-3 space-y-2">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Sprout className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Active Seasonal Crop Advice</span>
            </div>
            {/* Season Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setActiveSeason('kharif')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-colors cursor-pointer ${
                  activeSeason === 'kharif'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kharif Crops
              </button>
              <button
                type="button"
                onClick={() => setActiveSeason('rabi')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-colors cursor-pointer ${
                  activeSeason === 'rabi'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Rabi Standing
              </button>
            </div>
          </div>

          {activeSeason === 'kharif' ? (
            <div className="space-y-1.5 text-xs">
              <div className="bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100/80">
                <span className="font-bold text-emerald-950">Paddy / Rice: </span>
                <span className="text-slate-700 break-words">
                  {weather.humidity > 68
                    ? 'Scout for Sheath Rot and leaf blast. Maintain bund drainage; avoid excessive top-dressing of urea.'
                    : 'Maintain 3-5 cm standing water in tillering plots. Install pheromone traps for yellow stem borer.'}
                </span>
              </div>
              <div className="bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100/80">
                <span className="font-bold text-emerald-950">Cotton & Pulses: </span>
                <span className="text-slate-700 break-words">
                  {weather.rainProb > 40
                    ? 'Create drainage channels in inter-rows to prevent wilt & root rot from stagnant water.'
                    : 'Spray 5% neem seed kernel extract (NSKE) against whitefly and bollworm oviposition.'}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 text-xs">
              <div className="bg-lime-50/60 p-2.5 rounded-lg border border-lime-100/80">
                <span className="font-bold text-lime-950">Wheat & Barley: </span>
                <span className="text-slate-700 break-words">
                  {weather.temp > 28
                    ? 'Elevated temperatures can accelerate grain filling. Provide light evening irrigation to cool root microclimate.'
                    : 'Schedule irrigation at Crown Root Initiation (CRI) stage (21 days after sowing).'}
                </span>
              </div>
              <div className="bg-lime-50/60 p-2.5 rounded-lg border border-lime-100/80">
                <span className="font-bold text-lime-950">Mustard & Chickpea: </span>
                <span className="text-slate-700 break-words">
                  {weather.humidity > 65
                    ? 'High risk of mustard aphid proliferation on inflorescence. Spray Dimethoate 30 EC if threshold exceeded.'
                    : 'Inspect chickpea for Helicoverpa pod borer larvae. Erect bird perches (15-20 per acre).'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Fertilizer / Spray Retention Index */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 mb-3 space-y-1.5">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Droplets className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>Fertilizer & Spray Retention Index</span>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${sprayRetention.badge}`}>
              {sprayRetention.status}
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <span className="text-xs text-slate-600">Foliar Adhesion:</span>
            <span className={`text-xs font-bold shrink-0 ${sprayRetention.color}`}>
              {sprayRetention.index}
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed break-words">
            {sprayRetention.desc}
          </p>
          <div className="text-[11px] font-medium text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/80 flex items-center gap-1.5 flex-wrap">
            <Wind className="w-3 h-3 text-slate-500 shrink-0" />
            <span className="break-words">{sprayRetention.window}</span>
          </div>
        </div>
      </div>

      {/* Official Authority Citation Footer */}
      <div className="bg-lime-50 rounded-xl p-2.5 border border-lime-200 text-xs">
        <div className="flex items-start gap-2">
          <div className="w-2 h-2 rounded-full bg-lime-600 animate-pulse shrink-0 mt-1" />
          <p className="text-xs text-lime-950 break-words leading-relaxed">
            <strong>GKMS • IMD Protocol: </strong>
            Advisory aligned with Agrometeorological Field Units (AMFU) and ICAR Krishi Vigyan Kendra network.
          </p>
        </div>
      </div>
    </div>
  );
};
