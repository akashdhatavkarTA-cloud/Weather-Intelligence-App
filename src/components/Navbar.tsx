import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, Compass, Check, X } from 'lucide-react';
import { GeoCity, UnitSystem } from '../types';
import { searchCities } from '../services/weatherApi';

interface NavbarProps {
  unit: UnitSystem;
  onUnitChange: (newUnit: UnitSystem) => void;
  onSelectCity: (city: GeoCity) => void;
  selectedCity: GeoCity | null;
  onSearchError: (err: string | null) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  unit,
  onUnitChange,
  onSelectCity,
  selectedCity,
  onSearchError,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoCity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<any>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle typing with debounced geocoding search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onSearchError(null);
    setNoResults(false);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (val.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceTimer.current = setTimeout(async () => {
      try {
        const results = await searchCities(val);
        setSuggestions(results);
        setNoResults(results.length === 0);
        setIsOpen(true);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          onSearchError(`Could not search location "${val}". Please verify network connection.`);
        }
      } finally {
        setIsSearching(false);
      }
    }, 350);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
      return;
    }

    setIsSearching(true);
    onSearchError(null);
    try {
      const results = await searchCities(query);
      if (results.length > 0) {
        handleSelect(results[0]);
      } else {
        setNoResults(true);
        setIsOpen(true);
        onSearchError(`No location found matching "${query}". Try searching another city.`);
      }
    } catch (err: any) {
      onSearchError(`Search request failed for "${query}". Check your connection and retry.`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (city: GeoCity) => {
    onSelectCity(city);
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setNoResults(false);
  };

  const clearQuery = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setNoResults(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0a0c10]/80 backdrop-blur-xl shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Title */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-amber-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-white/20">
            <Compass className="w-5 h-5 text-white drop-shadow-sm" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-100 flex items-center gap-2">
              Weather Intelligence
              <span className="hidden sm:inline-block text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full frosted-pill text-slate-300">
                Open-Meteo
              </span>
            </h1>
          </div>
        </div>

        {/* Search Bar with Autocomplete Dropdown */}
        <div ref={searchRef} className="relative flex-1 max-w-md mx-2">
          <form onSubmit={handleFormSubmit} className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                id="city-search-input"
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={() => {
                  if (suggestions.length > 0 || noResults) {
                    setIsOpen(true);
                  }
                }}
                placeholder={selectedCity ? `Search city (current: ${selectedCity.name})...` : 'Search city or airport...'}
                className="w-full bg-white/[0.06] hover:bg-white/[0.08] border border-white/10 focus:border-white/30 focus:bg-white/[0.1] focus:ring-1 focus:ring-white/20 rounded-xl pl-10 pr-10 py-2 text-sm text-slate-100 placeholder:text-slate-400 backdrop-blur-md transition-all outline-none"
              />
              <div className="absolute right-3 flex items-center gap-1.5">
                {isSearching ? (
                  <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                ) : query ? (
                  <button
                    type="button"
                    onClick={clearQuery}
                    className="text-slate-400 hover:text-white cursor-pointer p-0.5 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : null}
              </div>
            </div>
          </form>

          {/* Autocomplete Dropdown */}
          {isOpen && (
            <div
              id="search-suggestions-dropdown"
              className="absolute left-0 right-0 top-full mt-2 bg-[#0a0c10]/95 border border-white/15 rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-hidden z-50 divide-y divide-white/10"
            >
              {suggestions.length > 0 ? (
                suggestions.map((city) => (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => handleSelect(city)}
                    className="w-full text-left px-4 py-2.5 hover:bg-white/10 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-sky-400 shrink-0 group-hover:scale-110 transition-transform" />
                      <div>
                        <span className="text-sm font-medium text-slate-100 group-hover:text-white">
                          {city.name}
                        </span>
                        <span className="text-xs text-slate-400 ml-2">
                          {[city.admin1, city.country].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    </div>
                    {city.country_code && (
                      <span className="text-[10px] font-mono uppercase frosted-pill text-slate-300 px-1.5 py-0.5 rounded">
                        {city.country_code}
                      </span>
                    )}
                  </button>
                ))
              ) : noResults ? (
                <div className="p-4 text-center text-sm text-slate-400">
                  No cities found matching &quot;{query}&quot;. Please check the spelling.
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Unit Toggle: Metric vs Imperial */}
        <div className="shrink-0 flex items-center gap-1.5 frosted-pill p-1 rounded-xl">
          <button
            id="unit-metric-toggle"
            type="button"
            onClick={() => onUnitChange('metric')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              unit === 'metric'
                ? 'frosted-pill-active'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Metric Units (°C, km/h, mm)"
          >
            °C / km/h
          </button>
          <button
            id="unit-imperial-toggle"
            type="button"
            onClick={() => onUnitChange('imperial')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              unit === 'imperial'
                ? 'frosted-pill-active'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Imperial Units (°F, mph, in)"
          >
            °F / mph
          </button>
        </div>

      </div>
    </header>
  );
};
