import React from 'react';
import { HeartPulse, AlertCircle, ShieldAlert, Wind, Activity } from 'lucide-react';
import { WeatherData } from '../../types';

interface AqiPollenWidgetProps {
  weather: WeatherData;
}

export const AqiPollenWidget: React.FC<AqiPollenWidgetProps> = ({ weather }) => {
  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return { bg: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-200', bgLight: 'bg-emerald-50' };
    if (aqi <= 100) return { bg: 'bg-lime-500', text: 'text-lime-700', border: 'border-lime-200', bgLight: 'bg-lime-50' };
    if (aqi <= 200) return { bg: 'bg-amber-400', text: 'text-amber-800', border: 'border-amber-200', bgLight: 'bg-amber-50' };
    if (aqi <= 300) return { bg: 'bg-orange-500', text: 'text-orange-700', border: 'border-orange-200', bgLight: 'bg-orange-50' };
    if (aqi <= 400) return { bg: 'bg-red-500', text: 'text-red-700', border: 'border-red-200', bgLight: 'bg-red-50' };
    return { bg: 'bg-purple-800', text: 'text-purple-900', border: 'border-purple-300', bgLight: 'bg-purple-50' };
  };

  const aqiColors = getAqiColor(weather.aqi);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col justify-between h-full min-h-[380px] break-words">
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-2.5 flex-wrap pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0 mt-0.5">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-slate-900 font-display break-words">
                National Air Quality & Pollen
              </h3>
              <p className="text-[11px] text-slate-500 break-words mt-0.5">Open-Meteo pollutants • CPCB / NAQI scale</p>
            </div>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ${aqiColors.bgLight} ${aqiColors.text} ${aqiColors.border}`}>
            {weather.aqiCategory}
          </span>
        </div>

        {/* AQI Big Dial & Gradient Bar */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/70 mb-4">
          <div className="flex items-baseline justify-between gap-2 flex-wrap mb-1.5">
            <div>
              <span className="text-3xl font-black font-display text-slate-900">{weather.aqi}</span>
              <span className="text-xs text-slate-500 font-medium ml-1.5">AQI (CPCB scale estimate)</span>
            </div>
            <span className="text-xs font-semibold text-slate-600 break-words">
              PM2.5 Dominant: {weather.pm25} µg/m³
            </span>
          </div>

          {/* CPCB Scale Continuous Bar */}
          <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden relative flex">
            <div className="flex-1 bg-emerald-500" title="Good (0-50)" />
            <div className="flex-1 bg-lime-500" title="Satisfactory (51-100)" />
            <div className="flex-1 bg-amber-400" title="Moderate (101-200)" />
            <div className="flex-1 bg-orange-500" title="Poor (201-300)" />
            <div className="flex-1 bg-red-500" title="Very Poor (301-400)" />
            <div className="flex-1 bg-purple-800" title="Severe (401-500)" />
          </div>

          <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
            <span>0</span>
            <span>50</span>
            <span>100</span>
            <span>200</span>
            <span>300</span>
            <span>400</span>
            <span>500</span>
          </div>
        </div>

        {/* Pollutants Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <div className="bg-white rounded-lg p-2 border border-slate-200/80 text-center shadow-2xs">
            <div className="text-[10px] text-slate-400 font-semibold">PM2.5</div>
            <div className="text-xs font-bold text-slate-800">{weather.pm25}</div>
            <div className="text-[9px] text-slate-500">µg/m³</div>
          </div>
          <div className="bg-white rounded-lg p-2 border border-slate-200/80 text-center shadow-2xs">
            <div className="text-[10px] text-slate-400 font-semibold">PM10</div>
            <div className="text-xs font-bold text-slate-800">{weather.pm10}</div>
            <div className="text-[9px] text-slate-500">µg/m³</div>
          </div>
          <div className="bg-white rounded-lg p-2 border border-slate-200/80 text-center shadow-2xs">
            <div className="text-[10px] text-slate-400 font-semibold">NO₂</div>
            <div className="text-xs font-bold text-slate-800">{weather.no2}</div>
              <div className="text-[9px] text-slate-500">µg/m³</div>
          </div>
          <div className="bg-white rounded-lg p-2 border border-slate-200/80 text-center shadow-2xs">
            <div className="text-[10px] text-slate-400 font-semibold">SO₂</div>
            <div className="text-xs font-bold text-slate-800">{weather.so2}</div>
              <div className="text-[9px] text-slate-500">µg/m³</div>
          </div>
        </div>

        {/* Pollen Trackers */}
        <div className="space-y-2 mb-3">
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Allergen & Pollen Counts
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-50 rounded-lg p-2 border border-slate-200/60 text-center">
              <div className="text-[10px] text-slate-500">Tree Pollen</div>
              <div className={`text-xs font-bold ${weather.pollenTrees === 'High' ? 'text-red-600' : 'text-slate-800'}`}>
                {weather.pollenTrees === 'Unavailable' ? 'No data' : weather.pollenTrees}
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-2 border border-slate-200/60 text-center">
              <div className="text-[10px] text-slate-500">Grass Pollen</div>
              <div className="text-xs font-bold text-slate-800">{weather.pollenGrass === 'Unavailable' ? 'No data' : weather.pollenGrass}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-2 border border-slate-200/60 text-center">
              <div className="text-[10px] text-slate-500">Weed Pollen</div>
              <div className="text-xs font-bold text-slate-800">{weather.pollenWeeds === 'Unavailable' ? 'No data' : weather.pollenWeeds}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Asthma Advisory Box */}
      <div className={`rounded-xl p-2.5 border text-xs flex items-start gap-2 ${aqiColors.bgLight} ${aqiColors.border}`}>
        <Activity className={`w-4 h-4 shrink-0 mt-0.5 ${aqiColors.text}`} />
        <p className={`text-xs leading-relaxed break-words ${aqiColors.text}`}>
          <strong>Asthma & Allergy Note: </strong>
          {weather.aqi > 200
            ? 'High particulate exposure. Avoid intense outdoor exertion. Wear N95 masks.'
            : weather.aqi > 100
            ? 'Moderate risk for sensitive respiratory groups. Keep bronchodilators accessible.'
            : 'Favorable clean air conditions. Safe for deep outdoor cardiovascular activities.'}
        </p>
      </div>
    </div>
  );
};
