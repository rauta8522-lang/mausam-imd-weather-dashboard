import React from 'react';
import { SunMedium, ShieldAlert, Sparkles, Clock, AlertTriangle } from 'lucide-react';
import { WeatherData } from '../../types';

interface UvHealthWidgetProps {
  weather: WeatherData;
}

export const UvHealthWidget: React.FC<UvHealthWidgetProps> = ({ weather }) => {
  const getUvColor = (uv: number) => {
    if (uv <= 2) return { text: 'text-emerald-700', bg: 'bg-emerald-100', border: 'border-emerald-300', desc: 'Low danger. Minimal sun protection required.' };
    if (uv <= 5) return { text: 'text-yellow-800', bg: 'bg-yellow-100', border: 'border-yellow-300', desc: 'Moderate. Wear sunglasses, hat, and SPF 30+.' };
    if (uv <= 7) return { text: 'text-amber-800', bg: 'bg-amber-100', border: 'border-amber-300', desc: 'High risk of burn. Seek shade between 11 AM - 3 PM.' };
    if (uv <= 10) return { text: 'text-orange-800', bg: 'bg-orange-100', border: 'border-orange-300', desc: 'Very High. Unprotected skin will burn in < 15 min.' };
    return { text: 'text-red-800', bg: 'bg-red-100', border: 'border-red-300', desc: 'Extreme. Avoid direct sun exposure. SPF 50+ mandatory.' };
  };

  const uvStyle = getUvColor(weather.uvIndex);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col justify-between h-full min-h-[380px] break-words">
      <div>
        <div className="flex items-start justify-between gap-2.5 flex-wrap pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shrink-0 mt-0.5">
              <SunMedium className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-slate-900 font-display break-words">
                Solar UV Radiation & Skin Safety
              </h3>
              <p className="text-[11px] text-slate-500 break-words mt-0.5">Global Solar UV Index & Photoprotection</p>
            </div>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ${uvStyle.bg} ${uvStyle.text} ${uvStyle.border}`}>
            UV {weather.uvIndex} • {weather.uvCategory}
          </span>
        </div>

        {/* UV Gauge Representation */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 mb-3">
          <div className="flex items-baseline justify-between gap-2 flex-wrap mb-2">
            <div>
              <span className="text-3xl font-extrabold text-slate-900 font-display">
                {weather.uvIndex}
              </span>
              <span className="text-xs text-slate-500 font-medium ml-1.5">Max Solar Intensity</span>
            </div>
            <span className="text-xs text-slate-600 font-semibold break-words">
              Burn Time: {weather.uvIndex > 8 ? '~15 mins' : weather.uvIndex > 5 ? '~25 mins' : '> 45 mins'}
            </span>
          </div>

          {/* Stepped Scale */}
          <div className="flex gap-1 h-2 rounded-full overflow-hidden">
            <div className={`flex-1 ${weather.uvIndex >= 1 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
            <div className={`flex-1 ${weather.uvIndex >= 3 ? 'bg-yellow-400' : 'bg-slate-200'}`} />
            <div className={`flex-1 ${weather.uvIndex >= 6 ? 'bg-amber-500' : 'bg-slate-200'}`} />
            <div className={`flex-1 ${weather.uvIndex >= 8 ? 'bg-orange-500' : 'bg-slate-200'}`} />
            <div className={`flex-1 ${weather.uvIndex >= 11 ? 'bg-purple-800' : 'bg-slate-200'}`} />
          </div>
          <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
            <span>Low (1-2)</span>
            <span>Mod (3-5)</span>
            <span>High (6-7)</span>
            <span>Very High (8-10)</span>
            <span>Extr (11+)</span>
          </div>
        </div>

        {/* Photoprotection Checklist */}
        <div className="space-y-2 text-xs mb-3">
          <div className="flex items-center justify-between gap-2 flex-wrap text-slate-700 bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-slate-500">Recommended Sunscreen</span>
            <span className="font-bold text-slate-800 break-words">
              {weather.uvIndex >= 8 ? 'SPF 50+ Broad Spectrum' : 'SPF 30+ PA+++'}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 flex-wrap text-slate-700 bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-slate-500">Peak Radiation Window</span>
            <span className="font-bold text-slate-800 break-words">11:30 AM - 02:45 PM IST</span>
          </div>
          <div className="flex items-center justify-between gap-2 flex-wrap text-slate-700 bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-slate-500">Heat Index / RealFeel</span>
            <span className="font-bold text-slate-800 break-words">{weather.feelsLike}°C (Humidex)</span>
          </div>
        </div>
      </div>

      <div className={`rounded-xl p-2.5 border text-xs ${uvStyle.bg} ${uvStyle.border}`}>
        <p className={`text-xs break-words leading-relaxed ${uvStyle.text}`}>
          <strong>MoES Advisory: </strong>
          {uvStyle.desc}
        </p>
      </div>
    </div>
  );
};
