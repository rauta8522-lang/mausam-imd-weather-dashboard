import React from 'react';
import { Sprout, Droplets, CloudRain, ThermometerSnowflake, Sun, CheckCircle, ShieldCheck } from 'lucide-react';
import { WeatherData } from '../../types';

interface AgrometWidgetProps {
  weather: WeatherData;
}

export const AgrometWidget: React.FC<AgrometWidgetProps> = ({ weather }) => {
  const getSoilMoistureStatus = (sm: number) => {
    if (sm < 25) return { label: 'Dry / Stress', color: 'text-red-700 bg-red-100 border-red-300' };
    if (sm <= 55) return { label: 'Adequate / Optimum', color: 'text-emerald-700 bg-emerald-100 border-emerald-300' };
    if (sm <= 75) return { label: 'High Moisture', color: 'text-sky-700 bg-sky-100 border-sky-300' };
    return { label: 'Waterlogged', color: 'text-purple-700 bg-purple-100 border-purple-300' };
  };

  const smStatus = getSoilMoistureStatus(weather.soilMoisture);
  const sevenDayRain = (weather.rainMm * 3.5 + 8).toFixed(1);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col justify-between h-full min-h-[380px] break-words">
      <div>
        <div className="flex items-start justify-between gap-2.5 flex-wrap pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-lime-50 text-lime-700 flex items-center justify-center border border-lime-200 shrink-0 mt-0.5">
              <Sprout className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-slate-900 font-display break-words">
                Gramin Krishi Mausam Advisory
              </h3>
              <p className="text-[11px] text-slate-500 break-words mt-0.5">IMD Agromet Division & Soil Health</p>
            </div>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ${smStatus.color}`}>
            Soil: {smStatus.label}
          </span>
        </div>

        {/* Soil Moisture & 7-Day Cumulative Rain */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1 flex-wrap">
              <Droplets className="w-3.5 h-3.5 text-lime-600 shrink-0" />
              <span>Root-Zone Soil Moisture</span>
            </div>
            <div className="text-2xl font-bold font-display text-slate-900">
              {weather.soilMoisture}%
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 break-words">
              Soil Temp: {weather.soilTemp}°C @ 10cm depth
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1 flex-wrap">
              <CloudRain className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>7-Day Rain Volume</span>
            </div>
            <div className="text-2xl font-bold font-display text-slate-900">
              {sevenDayRain} <span className="text-xs font-normal text-slate-600">mm</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 break-words">Cumulative Outlook</div>
          </div>
        </div>

        {/* Agromet Action Recommendations */}
        <div className="space-y-2 mb-3">
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Agricultural Field Directives
          </div>
          <div className="bg-white rounded-xl p-2.5 border border-slate-200 shadow-2xs text-xs space-y-1.5">
            <div className="flex items-start gap-2">
              <span className="font-bold text-slate-800 shrink-0">Irrigation:</span>
              <span className="text-slate-600 break-words">
                {weather.soilMoisture > 65
                  ? 'Suspend canal/borewell irrigation. Ensure surface drainage in low-lying pulses and cotton fields.'
                  : weather.soilMoisture < 30
                  ? 'Apply light drip or sprinkler irrigation immediately during early morning hours.'
                  : 'Maintain normal irrigation interval for standing vegetative crops.'}
              </span>
            </div>

            <div className="flex items-start gap-2">
              <span className="font-bold text-slate-800 shrink-0">Pesticides:</span>
              <span className="text-slate-600 break-words">
                {weather.rainProb > 45
                  ? 'Postpone foliar sprays of fungicides or insecticides; wash-off risk high.'
                  : 'Favorable spray window between 07:00 and 10:30 AM before wind velocity picks up.'}
              </span>
            </div>

            <div className="flex items-start gap-2">
              <span className="font-bold text-slate-800 shrink-0">Harvesting:</span>
              <span className="text-slate-600 break-words">
                {weather.rainProb > 60
                  ? 'Cover harvested produce with tarpaulin sheets in open mandis.'
                  : 'Safe open threshing and sun-drying conditions.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-lime-50 rounded-xl p-2.5 border border-lime-200 text-xs">
        <p className="text-xs text-lime-950 break-words leading-relaxed">
          <strong>GKMS Advisory: </strong>
          {weather.temp > 38
            ? 'Heat stress warning for horticultural saplings. Provide straw mulching.'
            : 'Evapotranspiration rate is stable. Soil biological activity favorable.'}
        </p>
      </div>
    </div>
  );
};
