import React from 'react';
import { Clock, CloudRain, Sun, Wind, Droplets } from 'lucide-react';
import { WeatherData } from '../../types';

interface HourlyTimelineWidgetProps {
  weather: WeatherData;
}

export const HourlyTimelineWidget: React.FC<HourlyTimelineWidgetProps> = ({ weather }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col justify-between h-full min-h-[380px] break-words">
      <div>
        <div className="flex items-start justify-between gap-2.5 flex-wrap pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 shrink-0 mt-0.5">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-slate-900 font-display break-words">
                12-Hour Diurnal Progression
              </h3>
              <p className="text-[11px] text-slate-500 break-words mt-0.5">Hourly Temperature, Rain Probability & Wind</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500 shrink-0">
            Next 12 Hours
          </span>
        </div>

        {/* Horizontal Scrollable Hourly Cards */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth">
          {weather.hourly.map((h, idx) => {
            const isNow = idx === 0;
            return (
              <div
                key={idx}
                className={`flex flex-col items-center justify-between p-3 rounded-xl border shrink-0 w-20 text-center transition-all ${
                  isNow
                    ? 'bg-sky-50/80 border-sky-300 ring-2 ring-sky-400/30'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <span className={`text-xs font-bold ${isNow ? 'text-sky-800' : 'text-slate-600'}`}>
                  {h.time}
                </span>

                <div className="my-2">
                  <span className="text-lg font-bold font-display text-slate-900">
                    {h.temp}°
                  </span>
                </div>

                {/* Rain probability bar */}
                <div className="w-full flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1 text-[10px] text-sky-600 font-bold">
                    <CloudRain className="w-3 h-3 shrink-0" />
                    <span>{h.pop}%</span>
                  </div>

                  <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-500 rounded-full"
                      style={{ width: `${Math.min(100, Math.max(5, h.pop))}%` }}
                    />
                  </div>
                </div>

                <div className="text-[9px] text-slate-400 mt-2 font-medium">
                  {h.windSpeed} km/h
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-slate-100 text-xs text-slate-500">
        <span className="break-words">Diurnal Swing: H: {weather.tempMax}° / L: {weather.tempMin}°</span>
        <span className="text-sky-600 font-medium shrink-0">Updated every 15 mins via IMD Radars</span>
      </div>
    </div>
  );
};
