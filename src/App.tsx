import { useState, useEffect, useCallback } from 'react';
import { GeoCity, ForecastApiResponse, UnitSystem } from './types';
import { DEFAULT_TORONTO, fetchForecast, WeatherApiError } from './services/weatherApi';
import { Navbar } from './components/Navbar';
import { SearchHistory } from './components/SearchHistory';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { ForecastGrid } from './components/ForecastGrid';
import { ForecastChart } from './components/ForecastChart';
import { PlanningCard } from './components/PlanningCard';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorBanner } from './components/ErrorBanner';
import { RefreshCw } from 'lucide-react';

const RECENT_CITIES_KEY = 'weather_intelligence_recent_cities';
const UNIT_STORAGE_KEY = 'weather_intelligence_unit_pref';

export default function App() {
  // Unit system state with local preference persistence
  const [unit, setUnit] = useState<UnitSystem>(() => {
    try {
      const saved = localStorage.getItem(UNIT_STORAGE_KEY);
      return saved === 'imperial' ? 'imperial' : 'metric';
    } catch {
      return 'metric';
    }
  });

  // Current active city (defaults to Toronto, Ontario, Canada)
  const [selectedCity, setSelectedCity] = useState<GeoCity>(DEFAULT_TORONTO);

  // Weather data & loading states
  const [forecast, setForecast] = useState<ForecastApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Search history state (up to 5 recent cities)
  const [searchHistory, setSearchHistory] = useState<GeoCity[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_CITIES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.slice(0, 5);
        }
      }
    } catch {
      // ignore
    }
    return [DEFAULT_TORONTO];
  });

  // Save unit preference changes
  const handleUnitChange = (newUnit: UnitSystem) => {
    setUnit(newUnit);
    try {
      localStorage.setItem(UNIT_STORAGE_KEY, newUnit);
    } catch {
      // ignore
    }
  };

  // Add city to search history (max 5, deduplicated)
  const addToSearchHistory = useCallback((city: GeoCity) => {
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.id !== city.id && item.name !== city.name);
      const updated = [city, ...filtered].slice(0, 5);
      try {
        localStorage.setItem(RECENT_CITIES_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  // Clear search history
  const handleClearHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem(RECENT_CITIES_KEY);
    } catch {
      // ignore
    }
  };

  // Fetch forecast whenever selectedCity changes
  const loadForecast = useCallback(async (city: GeoCity) => {
    setIsLoading(true);
    setErrorMessage(null);

    const controller = new AbortController();
    try {
      const data = await fetchForecast(city.latitude, city.longitude, controller.signal);
      setForecast(data);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        const msg =
          err instanceof WeatherApiError
            ? err.message
            : `Failed to fetch forecast for ${city.name}. Please check your connection.`;
        setErrorMessage(msg);
      }
    } finally {
      setIsLoading(false);
    }

    return () => controller.abort();
  }, []);

  useEffect(() => {
    loadForecast(selectedCity);
  }, [selectedCity, loadForecast]);

  // Handle city selection from search or recent chips
  const handleSelectCity = (city: GeoCity) => {
    setSelectedCity(city);
    addToSearchHistory(city);
    setErrorMessage(null);
  };

  return (
    <div id="weather-app-wrapper" className="min-h-screen bg-[#0a0c10] text-[#f8fafc] flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white relative overflow-x-hidden">
      {/* Ambient background light orbs that illuminate behind frosted glass panels */}
      <div className="fixed top-[-15%] left-[20%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none -z-10" />
      <div className="fixed top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-sky-500/10 blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[550px] h-[550px] rounded-full bg-amber-500/5 blur-[150px] pointer-events-none -z-10" />

      {/* Header & Navigation Bar */}
      <Navbar
        unit={unit}
        onUnitChange={handleUnitChange}
        onSelectCity={handleSelectCity}
        selectedCity={selectedCity}
        onSearchError={setErrorMessage}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search History Filter Chips */}
        <SearchHistory
          history={searchHistory}
          currentCity={selectedCity}
          onSelectCity={handleSelectCity}
          onClearHistory={handleClearHistory}
        />

        {/* Explicit Inline Error Banner */}
        {errorMessage && (
          <ErrorBanner
            message={errorMessage}
            onRetry={() => loadForecast(selectedCity)}
            onDismiss={() => setErrorMessage(null)}
          />
        )}

        {/* Loading State or Weather Dashboard */}
        {isLoading && !forecast ? (
          <LoadingSkeleton />
        ) : forecast ? (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Row / Refresh Bar */}
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1 px-1">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse" />
                <span className="tracking-wide">Station: <strong className="text-slate-200 font-semibold">{selectedCity.name}, {selectedCity.country}</strong></span>
              </div>
              <button
                id="refresh-forecast-btn"
                type="button"
                onClick={() => loadForecast(selectedCity)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full frosted-pill text-slate-300 hover:text-white hover:border-white/20 transition-all cursor-pointer"
                title="Refresh atmospheric data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-sky-400' : ''}`} />
                <span className="hidden sm:inline font-medium">Refresh Data</span>
              </button>
            </div>

            {/* Main Weather Card: Confined Dynamic Theming with 0.5s Transitions */}
            <CurrentWeatherCard
              city={selectedCity}
              current={forecast.current_weather}
              daily={forecast.daily}
              unit={unit}
            />

            {/* 7-Day Forecast Grid */}
            <ForecastGrid daily={forecast.daily} unit={unit} />

            {/* Dual-Axis Forecast Chart & Planning Recommendations Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              <div className="lg:col-span-2">
                <ForecastChart daily={forecast.daily} unit={unit} />
              </div>
              <div className="lg:col-span-1">
                <PlanningCard
                  current={forecast.current_weather}
                  daily={forecast.daily}
                  unit={unit}
                />
              </div>
            </div>
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/30 backdrop-blur-md py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Weather Intelligence • Live telemetry sourced from{' '}
            <a
              href="https://open-meteo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 underline underline-offset-2"
            >
              Open-Meteo API
            </a>
          </p>
          <p className="text-slate-500">
            Default Location: Toronto, ON, Canada • Zero Backend Static Architecture
          </p>
        </div>
      </footer>
    </div>
  );
}
