import React, { useState } from 'react';
import { Search, MapPin, X, Check, Compass } from 'lucide-react';
import { City } from '../types';
import { POPULAR_CITIES } from '../data/cities';

interface CitySelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: City;
  onSelectCity: (city: City) => void;
}

export const CitySelectModal: React.FC<CitySelectModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity,
}) => {
  const [search, setSearch] = useState('');
  const [customError, setCustomError] = useState('');
  const [customLoading, setCustomLoading] = useState(false);

  if (!isOpen) return null;

  const filteredCities = POPULAR_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.hindiName.includes(search) ||
      c.state.toLowerCase().includes(search.toLowerCase()) ||
      c.zone.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (city: City) => {
    onSelectCity(city);
    onClose();
  };

  const handleCustomCitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    setCustomError('');

    // Check if city exists in list
    const found = POPULAR_CITIES.find(
      (c) => c.name.toLowerCase() === search.trim().toLowerCase()
    );
    if (found) {
      handleSelect(found);
      return;
    }

    setCustomLoading(true);
    try {
      const params = new URLSearchParams({ name: search.trim(), count: '1', language: 'en', format: 'json' });
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);
      if (!response.ok) throw new Error(`Geocoding failed: ${response.status}`);
      const result = (await response.json()).results?.[0];
      if (!result) {
        setCustomError('No matching location found. Try a city or district name.');
        return;
      }
      handleSelect({
        id: `geocoded_${result.id}`,
        name: result.name,
        hindiName: result.name,
        state: result.admin1 || result.country || 'Geocoded location',
        lat: result.latitude,
        lon: result.longitude,
        zone: result.admin1 || result.country || 'Open-Meteo coordinates',
        coastal: false,
      });
    } catch (error) {
      setCustomError(error instanceof Error ? error.message : 'Unable to geocode this location.');
    } finally {
      setCustomLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Select Meteorological Observatory
              </h3>
              <p className="text-xs text-slate-500">Search Indian cities, districts or weather stations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <form onSubmit={handleCustomCitySubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCustomError('');
              }}
              placeholder="Search by city (e.g., Delhi, Mumbai, Shimla, Kochi)..."
              className="w-full bg-white text-slate-900 text-sm pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              autoFocus
            />
          </form>
          {customError && <p className="mt-2 text-xs text-red-600">{customError}</p>}
        </div>

        {/* Popular Cities Grid */}
        <div className="p-4 max-h-80 overflow-y-auto space-y-1.5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            IMD Regional Meteorological Centers
          </div>

          {filteredCities.length > 0 ? (
            filteredCities.map((city) => {
              const isSelected = city.id === selectedCity.id;
              return (
                <button
                  key={city.id}
                  onClick={() => handleSelect(city)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-50 border-sky-300 ring-2 ring-sky-500/20'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{city.name}</span>
                        <span className="text-xs text-slate-400 font-hindi">
                          ({city.hindiName})
                        </span>
                        {city.coastal && (
                          <span className="text-[9px] bg-cyan-100 text-cyan-800 px-1.5 py-0.5 rounded font-medium">
                            Coastal
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">
                        {city.state} • <span className="text-slate-400">{city.zone}</span>
                      </div>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-sky-600" />}
                </button>
              );
            })
          ) : (
            <div className="text-center py-6 text-slate-500 text-xs">
              <p>No exact preset match for "{search}".</p>
              <p className="mt-1 font-medium text-sky-600">
                {customLoading ? 'Finding coordinates...' : 'Press Enter to geocode this location.'}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Coordinates mapped to Open-Meteo & IMD Synoptic Grids</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
