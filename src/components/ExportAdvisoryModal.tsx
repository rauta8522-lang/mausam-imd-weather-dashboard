import React, { useState } from 'react';
import {
  X,
  Printer,
  Copy,
  Download,
  Check,
  Share2,
  AlertTriangle,
  Sparkles,
  Calendar,
  MapPin,
  Shield,
} from 'lucide-react';
import { City, WeatherData, Persona, AIBriefing } from '../types';

interface ExportAdvisoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: City;
  weather: WeatherData;
  primaryPersona: Persona;
  secondaryPersona: Persona | null;
  briefing: AIBriefing | null;
}

export const ExportAdvisoryModal: React.FC<ExportAdvisoryModalProps> = ({
  isOpen,
  onClose,
  city,
  weather,
  primaryPersona,
  secondaryPersona,
  briefing,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const alertBadgeText = {
    red: '🔴 RED ALERT (TAKE ACTION)',
    orange: '🟠 ORANGE ALERT (BE PREPARED)',
    yellow: '🟡 YELLOW WATCH (BE UPDATED)',
    green: '🟢 GREEN (NO WARNING / ROUTINE)',
  }[weather.alertLevel];

  const formattedBulletinText = `🇮🇳 INDIA METEOROLOGICAL DEPARTMENT (IMD - MoES)
NATIONAL WEATHER FORECASTING CENTRE, NEW DELHI
OFFICIAL CITIZEN BIOMETEOROLOGICAL ADVISORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Location: ${city.name} (${city.hindiName}), ${city.state}
⏰ Issue Time: ${weather.updatedAt}
🎯 Citizen Focus: ${primaryPersona.title}${
    secondaryPersona ? ` + ${secondaryPersona.title} (Hybrid Mode)` : ''
  }
⚠️ IMD Warning Protocol: ${alertBadgeText}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📰 SYNOPTIC BRIEFING:
${briefing?.headline || `${primaryPersona.title} Weather Advisory`}

💡 TAILORED PERSONA IMPACT:
${
  briefing?.tailoredImpact ||
  `Current temp ${weather.temp}°C with ${weather.humidity}% humidity. Exercise standard caution.`
}

🛡️ ACTIONABLE ADVISORY:
${
  briefing?.actionRecommendation ||
  'Heed regular IMD bulletins and plan activities around diurnal weather patterns.'
}

⏱️ OPTIMAL ACTIVITY WINDOW:
${briefing?.goldenWindow || 'Morning hours 06:00 - 08:30 IST'}

📊 KEY METRIC TELEMETRY:
• Temperature: ${weather.temp}°C (Feels like ${weather.feelsLike}°C)
• Weather Condition: ${weather.condition}
• Precipitation Probability: ${weather.rainProb}% (${weather.rainMm} mm)
• Wind Speed: ${weather.windSpeed} km/h (Gusts: ${weather.windGusts} km/h from ${weather.windDirection})
• Air Quality Index (AQI): ${weather.aqi} (${weather.aqiCategory})
• Solar UV Index: ${weather.uvIndex} (${weather.uvCategory})
• Surface Visibility: ${weather.visibility} km (${weather.visibilityDesc})
• Soil Moisture: ${weather.soilMoisture}%
${city.coastal ? `• Sea State: ${weather.seaState} (Waves: ${weather.waveHeight}m)` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ministry of Earth Sciences, Government of India • Mausam Portal
Official Public Release for Planning & Safety`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(formattedBulletinText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy bulletin', err);
    }
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([formattedBulletinText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `IMD_Advisory_${city.name.replace(/\s+/g, '_')}_${new Date()
      .toISOString()
      .slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center font-bold text-white text-sm">
              मौ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-display">
                  Export Daily Meteorological Advisory
                </h3>
                <span className="text-[10px] bg-slate-800 text-sky-300 font-semibold px-2 py-0.5 rounded border border-slate-700">
                  MoES • IMD
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official citizen advisory snapshot ready for printing or digital distribution
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Bulletin Area */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[65vh] space-y-4 text-slate-800 bg-slate-50/50 print:m-0 print:p-2">
          {/* Government / IMD Letterhead */}
          <div className="text-center pb-3 border-b-2 border-slate-300">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Government of India • Ministry of Earth Sciences
            </div>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              INDIA METEOROLOGICAL DEPARTMENT (IMD)
            </h2>
            <div className="text-xs text-slate-600">
              National Weather Forecasting Centre, Mausam Bhawan, New Delhi
            </div>
          </div>

          {/* Target Profile & Warning Pill */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                <span className="font-semibold text-slate-900">{city.name}, {city.state}</span>
                <span className="text-slate-400">({city.lat.toFixed(2)}°N, {city.lon.toFixed(2)}°E)</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-medium text-slate-500">Profile Focus:</span>
                <span className="font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {primaryPersona.title}
                </span>
                {secondaryPersona && (
                  <span className="font-bold text-violet-800 bg-violet-50 px-2 py-0.5 rounded border border-violet-200">
                    + {secondaryPersona.title}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                  weather.alertLevel === 'red'
                    ? 'bg-red-600 text-white'
                    : weather.alertLevel === 'orange'
                    ? 'bg-amber-500 text-white'
                    : weather.alertLevel === 'yellow'
                    ? 'bg-yellow-400 text-slate-900'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {alertBadgeText}
              </span>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {weather.updatedAt}
              </div>
            </div>
          </div>

          {/* AI Synoptic Advisory Box */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Synoptic Impact & Action Guidance</span>
            </div>

            <h4 className="text-base font-bold text-slate-900">
              {briefing?.headline || 'Standard Biometeorological Assessment'}
            </h4>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              <strong className="text-slate-900">Citizen Impact: </strong>
              {briefing?.tailoredImpact}
            </p>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              <strong className="text-slate-900">Recommended Advisory: </strong>
              {briefing?.actionRecommendation}
            </p>

            {briefing?.goldenWindow && (
              <div className="text-xs font-semibold text-amber-900 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 inline-block">
                Optimal Activity Window: {briefing.goldenWindow}
              </div>
            )}
          </div>

          {/* Key Observations Grid */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
              Station Ground Observations
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block text-[11px]">Temperature</span>
                <strong className="text-slate-900 text-sm">{weather.temp}°C</strong>
                <span className="text-slate-400 block text-[10px]">Feels like {weather.feelsLike}°C</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block text-[11px]">Precipitation</span>
                <strong className="text-slate-900 text-sm">{weather.rainProb}%</strong>
                <span className="text-slate-400 block text-[10px]">{weather.rainMm} mm</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block text-[11px]">Surface Wind</span>
                <strong className="text-slate-900 text-sm">{weather.windSpeed} km/h</strong>
                <span className="text-slate-400 block text-[10px]">{weather.windDirection}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block text-[11px]">Air Quality (AQI)</span>
                <strong className="text-slate-900 text-sm">{weather.aqi}</strong>
                <span className="text-slate-400 block text-[10px]">{weather.aqiCategory}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white px-5 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print Bulletin</span>
            </button>
            <button
              onClick={handleDownloadTxt}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Download (.txt)</span>
            </button>
          </div>

          <button
            onClick={handleCopyText}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-sky-600 hover:bg-sky-700 shadow-sm'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Bulletin to Clipboard!' : 'Copy WhatsApp / Text Bulletin'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
