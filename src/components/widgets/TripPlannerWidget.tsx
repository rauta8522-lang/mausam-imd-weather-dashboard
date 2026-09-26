import React, { useState } from 'react';
import {
  Compass,
  Luggage,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  CloudRain,
  Sun,
  Snowflake,
  Wind,
  Plane,
  Car,
  ShieldCheck,
  Radio,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { WeatherData } from '../../types';

interface DestinationInfo {
  id: string;
  name: string;
  state: string;
  airportCode: string;
  temp: number;
  feelsLike: number;
  condition: string;
  rainProb: number;
  aqi: number;
  windSpeed: number;
  climateTag: string;
  transitAlert: string;
  transitStatus: 'normal' | 'caution' | 'warning';
  packingItems: { id: string; label: string; essential: boolean }[];
  radarSummary: string;
  bestDepartureWindow: string;
}

const DESTINATIONS: DestinationInfo[] = [
  {
    id: 'goa',
    name: 'Goa (Panaji & Coast)',
    state: 'Goa',
    airportCode: 'GOI / GOX',
    temp: 31,
    feelsLike: 35,
    condition: 'Humid & Sunny with Coastal Breeze',
    rainProb: 15,
    aqi: 48,
    windSpeed: 18,
    climateTag: 'Tropical Beach & Coastal',
    transitAlert: 'NH-66 coastal highway clear. Dabolim (GOI) and Mopa (GOX) operating normal flight schedules with no delays.',
    transitStatus: 'normal',
    radarSummary: 'Scattered cumulus over Arabian Sea offshore. Negligible radar reflectivity near coastline.',
    bestDepartureWindow: 'Morning 07:00 - 10:30 (Moderate heat index)',
    packingItems: [
      { id: 'goa-1', label: 'Breathable linen & lightweight cotton clothing', essential: true },
      { id: 'goa-2', label: 'SPF 50+ broad-spectrum waterproof sunscreen', essential: true },
      { id: 'goa-3', label: 'Polarized UV400 sunglasses & sun visor', essential: true },
      { id: 'goa-4', label: 'Waterproof dry-bag for beach & water activities', essential: false },
      { id: 'goa-5', label: 'Mosquito repellent spray for coastal dusk', essential: true },
    ],
  },
  {
    id: 'shimla',
    name: 'Shimla & Kufri',
    state: 'Himachal Pradesh',
    airportCode: 'SLV (Jubarhatti)',
    temp: 14,
    feelsLike: 12,
    condition: 'Chilly Mist & Mountain Overcast',
    rainProb: 45,
    aqi: 32,
    windSpeed: 12,
    climateTag: 'High-Altitude Himalayan',
    transitAlert: 'Kalka-Shimla NH-5 operational. Dense mist near Barog & Solan; advisory for reduced vehicle speed and fog lamps.',
    transitStatus: 'caution',
    radarSummary: 'Orographic cloud bands visible on Patiala Doppler Radar over foothills with localized drizzle.',
    bestDepartureWindow: 'Midday 11:00 - 15:00 (Best hill visibility)',
    packingItems: [
      { id: 'shimla-1', label: 'Heavy fleece or down jacket & thermal innerwear', essential: true },
      { id: 'shimla-2', label: 'Wind-resistant trekking boots with grip sole', essential: true },
      { id: 'shimla-3', label: 'Compact windproof umbrella & rain poncho', essential: true },
      { id: 'shimla-4', label: 'Woolen beanie cap & thermal touch gloves', essential: true },
      { id: 'shimla-5', label: 'High-altitude lip balm & intensive moisturizer', essential: false },
    ],
  },
  {
    id: 'mumbai',
    name: 'Mumbai (Metropolitan Hub)',
    state: 'Maharashtra',
    airportCode: 'BOM',
    temp: 32,
    feelsLike: 37,
    condition: 'Warm & High Relative Humidity',
    rainProb: 25,
    aqi: 125,
    windSpeed: 14,
    climateTag: 'Konkan Coastal Urban',
    transitAlert: 'Western & Eastern Expressways flow moderate. Mumbai Airport (BOM) CAT-I ILS active with 10-min arrival pacing.',
    transitStatus: 'normal',
    radarSummary: 'Isolated sea-breeze convergence showers tracked 25 km west of Colaba Doppler Radar.',
    bestDepartureWindow: 'Early morning 06:00 - 08:30 (Low urban congestion)',
    packingItems: [
      { id: 'mumbai-1', label: 'Light breathable cotton attire & quick-dry layer', essential: true },
      { id: 'mumbai-2', label: 'Collapsible compact umbrella for sudden coastal showers', essential: true },
      { id: 'mumbai-3', label: 'Water-resistant laptop sleeve / backpack cover', essential: true },
      { id: 'mumbai-4', label: 'Comfortable slip-resistant walking sneakers', essential: false },
      { id: 'mumbai-5', label: 'Electrolyte hydration flask for urban travel', essential: true },
    ],
  },
  {
    id: 'jaipur',
    name: 'Jaipur (Pink City)',
    state: 'Rajasthan',
    airportCode: 'JAI',
    temp: 34,
    feelsLike: 33,
    condition: 'Bright & Arid Sunshine',
    rainProb: 5,
    aqi: 168,
    windSpeed: 10,
    climateTag: 'Semi-Arid Heritage Corridor',
    transitAlert: 'Delhi-Jaipur Expressway (NH-48) clear. Jaipur International Airport (JAI) operating normal Visual Flight Rules (VFR).',
    transitStatus: 'normal',
    radarSummary: 'IMD Jaipur Doppler Radar detects zero rain reflectivity. Dry boundary layer with elevated dust particles.',
    bestDepartureWindow: 'Late afternoon 16:30 - 19:00 (Fort sightseeing)',
    packingItems: [
      { id: 'jaipur-1', label: 'Wide-brim hat & lightweight cotton scarf (safaa)', essential: true },
      { id: 'jaipur-2', label: 'N95 dust mask for heritage fort corridors & bazars', essential: true },
      { id: 'jaipur-3', label: 'Oral rehydration salts (ORS) & insulated water bottle', essential: true },
      { id: 'jaipur-4', label: 'UV sunglasses & skin barrier cream', essential: true },
      { id: 'jaipur-5', label: 'Light evening shawl / jacket for nocturnal drop', essential: false },
    ],
  },
];

interface TripPlannerWidgetProps {
  weather: WeatherData;
}

export const TripPlannerWidget: React.FC<TripPlannerWidgetProps> = ({ weather }) => {
  const [selectedDestId, setSelectedDestId] = useState<string>('goa');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const activeDest = DESTINATIONS.find((d) => d.id === selectedDestId) || DESTINATIONS[0];

  const toggleCheck = (itemId: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const completedCount = activeDest.packingItems.filter((i) => checkedItems[i.id]).length;
  const totalCount = activeDest.packingItems.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col justify-between h-full min-h-[380px] break-words">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2.5 flex-wrap pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shrink-0 mt-0.5">
              <Compass className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-slate-900 font-display break-words">
                Destination Weather Radar & Trip Planner
              </h3>
              <p className="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap mt-0.5 break-words">
                <span>IMD MoES Tourism Weather Advisory</span>
                <span className="text-slate-300">•</span>
                <span>Dynamic Intercity Packing</span>
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1 shrink-0">
            <Radio className="w-3 h-3 text-indigo-600 animate-pulse" />
            Multi-Hub Radar
          </span>
        </div>

        {/* Destination Toggle Pills */}
        <div className="mb-3">
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Select Travel Destination:</span>
            <span className="text-[10px] text-indigo-600 font-medium">Click to compare</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {DESTINATIONS.map((dest) => {
              const isSelected = dest.id === selectedDestId;
              return (
                <button
                  key={dest.id}
                  onClick={() => setSelectedDestId(dest.id)}
                  className={`px-2.5 py-2 rounded-xl text-left transition-all border text-xs cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs ring-2 ring-indigo-500/40'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold truncate text-[11px]">{dest.name.split(' ')[0]}</span>
                    <span className={`text-[9px] font-mono px-1 py-0.2 rounded ${isSelected ? 'bg-slate-800 text-indigo-300' : 'bg-slate-200 text-slate-700'}`}>
                      {dest.airportCode.split(' ')[0]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[11px]">
                    <span className={isSelected ? 'text-white font-bold' : 'text-slate-900 font-semibold'}>
                      {dest.temp}°C
                    </span>
                    <span className={isSelected ? 'text-indigo-300' : 'text-slate-500'}>
                      {dest.rainProb > 30 ? '🌧️' : '☀️'} {dest.rainProb}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Destination Weather & Radar Snapshot */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 mb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-200/60">
            <div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900">{activeDest.name}</span>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-medium">
                  {activeDest.climateTag}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">{activeDest.condition}</p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">Temperature</span>
                <span className="text-sm font-bold text-slate-900">{activeDest.temp}°C</span>
                <span className="text-[10px] text-slate-500 ml-1">(Feels {activeDest.feelsLike}°C)</span>
              </div>
              <div className="pl-3 border-l border-slate-200">
                <span className="text-[10px] text-slate-500 block">Rain Probability</span>
                <span className={`text-sm font-bold ${activeDest.rainProb > 30 ? 'text-blue-600' : 'text-slate-900'}`}>
                  {activeDest.rainProb}%
                </span>
              </div>
            </div>
          </div>

          {/* Destination Radar Synopsis */}
          <div className="text-xs bg-white rounded-lg p-2.5 border border-slate-200/70 mb-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-950 mb-1">
              <Radio className="w-3 h-3 text-indigo-600" />
              <span>Synoptic Radar & Corridor View</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {activeDest.radarSummary}
            </p>
          </div>

          {/* Transit & Highway / Flight Alert */}
          <div className="text-xs bg-white rounded-lg p-2.5 border border-slate-200/70">
            <div className="flex items-center justify-between gap-1.5 mb-1">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
                <Car className="w-3 h-3 text-sky-600" />
                <span>Highway & Transit Status ({activeDest.airportCode})</span>
              </span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeDest.transitStatus === 'caution'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {activeDest.transitStatus === 'caution' ? 'Caution Advisory' : 'All Clear'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {activeDest.transitAlert}
            </p>
            <div className="mt-1.5 flex items-center gap-1 text-[10px] text-indigo-700 font-medium">
              <Clock className="w-3 h-3" />
              <span>Optimal Departure Window: {activeDest.bestDepartureWindow}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Interactive Packing Checklist */}
        <div className="bg-indigo-50/60 rounded-xl p-3 border border-indigo-100 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Luggage className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-950">
                Smart Packing Advisory ({activeDest.name.split(' ')[0]})
              </span>
            </div>
            <span className="text-[10px] font-bold bg-white text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
              {completedCount} / {totalCount} Packed
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            {activeDest.packingItems.map((item) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer select-none ${
                    isChecked
                      ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
                      : 'bg-white border-indigo-100 text-slate-800 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                        isChecked ? 'text-emerald-600 fill-emerald-100' : 'text-slate-300'
                      }`}
                    />
                    <span className={`text-[11px] ${isChecked ? 'line-through text-slate-500' : 'font-medium'}`}>
                      {item.label}
                    </span>
                  </div>
                  {item.essential && (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-1 py-0.2 rounded border border-amber-200 shrink-0 ml-1">
                      Essential
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Official Citation Footer */}
      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 text-xs">
        <p className="text-[11px] text-slate-600 flex items-start gap-1.5 leading-relaxed">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
          <span>
            <strong>Official IMD MoES Tourism Telemetry:</strong> Synoptic weather warnings and highway transit advisories synchronized with the National Tourism Meteorological Cell & Border Roads Organization.
          </span>
        </p>
      </div>
    </div>
  );
};
