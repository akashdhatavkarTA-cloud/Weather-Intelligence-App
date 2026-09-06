import React from 'react';
import { Wind, Droplets, ArrowUp, ArrowDown, Navigation, Calendar } from 'lucide-react';
import { CurrentWeather, DailyForecast, GeoCity, UnitSystem } from '../types';
import { getWeatherMeta, getWeatherTheme } from '../utils/weatherCodes';
import { formatPrecipitation, formatTemperature, formatWindSpeed } from '../utils/conversions';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  city: GeoCity;
  current: CurrentWeather;
  daily: DailyForecast;
  unit: UnitSystem;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  city,
  current,
  daily,
  unit,
}) => {
  const meta = getWeatherMeta(current.weathercode);
  const theme = getWeatherTheme(current.weathercode, current.is_day);

  const todayHigh = daily.temperature_2m_max?.[0] ?? current.temperature;
  const todayLow = daily.temperature_2m_min?.[0] ?? current.temperature;
  const todayPrecip = daily.precipitation_sum?.[0] ?? 0;

  // Format timestamp
  const dateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <section
      id="current-weather-container"
      aria-label="Current Weather Intelligence"
      style={{
        background: theme.gradient,
        transition: 'background-color 0.5s ease, background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease',
      }}
      className={`relative w-full rounded-3xl p-6 sm:p-8 border ${theme.borderClass} ${theme.glowClass} shadow-2xl overflow-hidden transition-all duration-500 mb-8 backdrop-blur-2xl`}
    >
      {/* Specular frosted glass reflection overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-black/25 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between min-h-[220px]">
        {/* Top bar: Location & Condition Badge */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md ${theme.badgeBg}`}>
                {current.is_day === 1 ? 'Live Daytime' : 'Live Nighttime'}
              </span>
              <span className={`text-xs font-medium ${theme.textSecondary} flex items-center gap-1`}>
                <Calendar className="w-3 h-3" />
                {dateFormatted}
              </span>
            </div>
            <h2 id="current-location-title" className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${theme.textPrimary}`}>
              {city.name}
            </h2>
            <p className={`text-sm font-medium ${theme.textSecondary}`}>
              {[city.admin1, city.country].filter(Boolean).join(', ')}
              {city.latitude && (
                <span className="opacity-75 text-xs ml-2">
                  ({city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°)
                </span>
              )}
            </p>
          </div>

          {/* Condition Icon and Label */}
          <div className="flex items-center sm:flex-col sm:items-end gap-3 sm:gap-1.5">
            <div className="p-3 bg-black/20 rounded-2xl backdrop-blur-md border border-white/15 shadow-inner">
              <WeatherIcon
                code={current.weathercode}
                isDay={current.is_day}
                className="w-10 h-10 text-white drop-shadow-md"
              />
            </div>
            <span id="current-condition-text" className={`text-base font-semibold ${theme.textPrimary}`}>
              {meta.label}
            </span>
          </div>
        </div>

        {/* Center: Hero Temperature Display */}
        <div className="my-6 flex flex-wrap items-baseline gap-4 sm:gap-6">
          <div className="flex items-start">
            <span
              id="current-temperature-value"
              className={`text-6xl sm:text-7xl font-black tracking-tighter ${theme.textPrimary} drop-shadow-sm`}
            >
              {formatTemperature(current.temperature, unit, false)}
            </span>
            <span className={`text-2xl sm:text-3xl font-bold ${theme.textSecondary} ml-1 mt-1`}>
              °{unit === 'imperial' ? 'F' : 'C'}
            </span>
          </div>

          {/* High / Low pills */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-xl border border-white/15 backdrop-blur-md shadow-sm">
              <ArrowUp className="w-3.5 h-3.5 text-rose-300" />
              <span className="text-xs text-white/70">High</span>
              <span className="text-sm font-bold text-white ml-0.5">
                {formatTemperature(todayHigh, unit)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-xl border border-white/15 backdrop-blur-md shadow-sm">
              <ArrowDown className="w-3.5 h-3.5 text-sky-300" />
              <span className="text-xs text-white/70">Low</span>
              <span className="text-sm font-bold text-white ml-0.5">
                {formatTemperature(todayLow, unit)}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Metrics: Wind Speed & Direction, Precipitation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/15">
          {/* Wind Speed */}
          <div id="metric-wind-speed" className="bg-black/20 backdrop-blur-md rounded-xl p-3 border border-white/15 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs text-white/70 mb-1">
              <Wind className="w-3.5 h-3.5 text-white/90" />
              <span>Wind Speed</span>
            </div>
            <div className="text-base font-bold text-white">
              {formatWindSpeed(current.windspeed, unit)}
            </div>
          </div>

          {/* Wind Direction */}
          <div id="metric-wind-direction" className="bg-black/20 backdrop-blur-md rounded-xl p-3 border border-white/15 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs text-white/70 mb-1">
              <Navigation
                className="w-3.5 h-3.5 text-white/90 transition-transform"
                style={{ transform: `rotate(${current.winddirection}deg)` }}
              />
              <span>Direction</span>
            </div>
            <div className="text-base font-bold text-white flex items-center gap-1">
              <span>{current.winddirection}°</span>
              <span className="text-xs font-normal text-white/70">
                ({getWindDirectionCardinal(current.winddirection)})
              </span>
            </div>
          </div>

          {/* Today's Precipitation */}
          <div id="metric-precipitation" className="bg-black/20 backdrop-blur-md rounded-xl p-3 border border-white/15 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs text-white/70 mb-1">
              <Droplets className="w-3.5 h-3.5 text-white/90" />
              <span>Precipitation</span>
            </div>
            <div className="text-base font-bold text-white">
              {formatPrecipitation(todayPrecip, unit)}
            </div>
          </div>

          {/* Weather Category Indicator */}
          <div id="metric-category" className="bg-black/20 backdrop-blur-md rounded-xl p-3 border border-white/15 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs text-white/70 mb-1">
              <span className="text-white/70">Atmosphere</span>
            </div>
            <div className="text-base font-bold text-white capitalize">
              {theme.category}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

function getWindDirectionCardinal(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}
