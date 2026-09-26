import React from 'react';
import { Calendar, CloudRain, Sun, AlertTriangle } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { WeatherData, AlertColor } from '../../types';

interface WeeklyOutlookWidgetProps {
  weather: WeatherData;
}

export const WeeklyOutlookWidget: React.FC<WeeklyOutlookWidgetProps> = ({ weather }) => {
  const getAlertPill = (color: AlertColor) => {
    switch (color) {
      case 'red':
        return 'bg-red-500 text-white';
      case 'orange':
        return 'bg-amber-500 text-white';
      case 'yellow':
        return 'bg-yellow-400 text-slate-900';
      case 'green':
      default:
        return 'bg-emerald-500 text-white';
    }
  };

  const chartData = weather.daily.map((d) => ({
    day: d.day,
    max: d.maxTemp,
    min: d.minTemp,
    rain: d.rainProb,
  }));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col justify-between h-full min-h-[380px] break-words">
      <div>
        <div className="flex items-start justify-between gap-2.5 flex-wrap pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shrink-0 mt-0.5">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-slate-900 font-display break-words">
                7-Day Synoptic Weather Outlook
              </h3>
              <p className="text-[11px] text-slate-500 break-words mt-0.5">Medium-Range Numerical Weather Prediction (NWP)</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500 shrink-0">IMD 7-Day Model</span>
        </div>

        {/* Recharts Temperature Trend Curve */}
        <div className="h-28 w-full mb-3 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} domain={['auto', 'auto']} axisLine={false} tickLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white text-xs p-2 rounded shadow-lg border border-slate-700">
                        <p className="font-bold">{data.day}</p>
                        <p className="text-sky-300">Max: {data.max}°C / Min: {data.min}°C</p>
                        <p className="text-slate-300">Rain Chance: {data.rain}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="max"
                stroke="#0284c7"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#tempGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 7 Days List Rows */}
        <div className="space-y-1.5 mb-2">
          {weather.daily.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 border border-slate-100 text-xs transition-colors"
            >
              <div className="flex items-center gap-2 w-24">
                <span className="font-bold text-slate-800">{item.day}</span>
                <span className="text-[10px] text-slate-400">{item.date}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-600 truncate flex-1">
                <CloudRain className={`w-3.5 h-3.5 ${item.rainProb > 40 ? 'text-sky-500' : 'text-slate-400'}`} />
                <span className="truncate">{item.condition}</span>
                <span className="text-[10px] text-slate-400 font-medium">({item.rainProb}%)</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="text-right">
                  <span className="font-bold text-slate-900">{item.maxTemp}°</span>
                  <span className="text-slate-400 text-[11px] ml-1">/ {item.minTemp}°</span>
                </div>
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${getAlertPill(item.alertLevel)}`}
                  title={`IMD Warning Level: ${item.alertLevel.toUpperCase()}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap text-[11px] text-slate-500">
        <span className="break-words">Color Dots: Official IMD Alert Protocol</span>
        <span className="flex items-center gap-1.5 flex-wrap shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Green
          <span className="w-2 h-2 rounded-full bg-yellow-400" /> Yellow
          <span className="w-2 h-2 rounded-full bg-amber-500" /> Orange
          <span className="w-2 h-2 rounded-full bg-red-500" /> Red
        </span>
      </div>
    </div>
  );
};
