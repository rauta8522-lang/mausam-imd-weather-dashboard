import React from 'react';
import {
  Wind,
  Droplets,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  CloudRain,
  Sun,
  Cloud,
  CloudLightning,
  CloudFog,
} from 'lucide-react';
import { WeatherData, City, LanguageCode } from '../types';
import { t } from '../data/translations';

interface CurrentWeatherHeroProps {
  weather: WeatherData;
  city: City;
  language?: LanguageCode;
}

export const CurrentWeatherHero: React.FC<CurrentWeatherHeroProps> = ({
  weather,
  city,
  language = 'en',
}) => {
  const getWeatherIcon = (cond: string) => {
    const c = cond.toLowerCase();
    if (c.includes('rain') || c.includes('shower') || c.includes('drizzle')) {
      return <CloudRain className="w-12 h-12 text-sky-500" />;
    }
    if (c.includes('thunder') || c.includes('squall')) {
      return <CloudLightning className="w-12 h-12 text-amber-500" />;
    }
    if (c.includes('fog') || c.includes('haze') || c.includes('mist')) {
      return <CloudFog className="w-12 h-12 text-slate-400" />;
    }
    if (c.includes('cloud') || c.includes('overcast')) {
      return <Cloud className="w-12 h-12 text-slate-400" />;
    }
    return <Sun className="w-12 h-12 text-amber-500" />;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 relative overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Main Temperature & City Summary */}
        <div className="flex items-center gap-5">
          <div className="p-3 bg-sky-50 rounded-2xl border border-sky-100 shrink-0">
            {getWeatherIcon(weather.condition)}
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold font-display text-slate-900 tracking-tight">
                {weather.temp}°C
              </span>
              <span className="text-sm font-semibold text-slate-500">
                {t('feelsLike', language)} {weather.feelsLike}°C
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="font-bold text-slate-800 text-base">{weather.condition}</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">
                H: {weather.tempMax}° / L: {weather.tempMin}°
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1">
              {t('observatoryStation', language)}: {city.name} ({city.zone})
            </p>
          </div>
        </div>

        {/* Essential Quick Dials Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
          {/* Humidity */}
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/60">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
              <Droplets className="w-3.5 h-3.5 text-sky-500" />
              <span>{t('humidity', language)}</span>
            </div>
            <div className="text-sm font-bold text-slate-900">{weather.humidity}%</div>
            <div className="text-[10px] text-slate-500">
              {weather.humidity > 70 ? 'High / Muggy' : weather.humidity < 35 ? 'Dry' : 'Normal'}
            </div>
          </div>

          {/* Wind */}
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/60">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
              <Wind className="w-3.5 h-3.5 text-teal-600" />
              <span>{t('windSpeed', language)}</span>
            </div>
            <div className="text-sm font-bold text-slate-900">
              {weather.windSpeed} <span className="text-xs font-normal">km/h</span>
            </div>
            <div className="text-[10px] text-slate-500">
              {weather.windDirection} • Gusts {weather.windGusts} km/h
            </div>
          </div>

          {/* Rain Probability */}
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/60">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
              <CloudRain className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t('rainProbability', language)}</span>
            </div>
            <div className="text-sm font-bold text-slate-900">{weather.rainProb}%</div>
            <div className="text-[10px] text-slate-500">
              {weather.rainMm > 0 ? `${weather.rainMm} mm expected` : 'Minimal rain'}
            </div>
          </div>

          {/* Visibility */}
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/60">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
              <Eye className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('visibility', language)}</span>
            </div>
            <div className="text-sm font-bold text-slate-900">
              {weather.visibility} <span className="text-xs font-normal">km</span>
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              {weather.visibility < 1 ? 'Dense Fog' : weather.visibility < 4 ? 'Hazy' : 'Clear'}
            </div>
          </div>
        </div>

        {/* Sunrise / Sunset Sun Track */}
        <div className="flex sm:flex-col justify-between sm:justify-center gap-3 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 shrink-0 text-xs">
          <div className="flex items-center gap-2">
            <Sunrise className="w-4 h-4 text-amber-500 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wide">{t('sunrise', language)}</div>
              <div className="font-bold text-slate-800">{weather.sunrise} IST</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Sunset className="w-4 h-4 text-orange-500 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wide">{t('sunset', language)}</div>
              <div className="font-bold text-slate-800">{weather.sunset} IST</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
