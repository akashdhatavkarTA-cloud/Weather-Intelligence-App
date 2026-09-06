import React from 'react';
import { DailyForecast, UnitSystem } from '../types';
import { getWeatherMeta } from '../utils/weatherCodes';
import { formatPrecipitation, formatTemperature, formatWindSpeed } from '../utils/conversions';
import { WeatherIcon } from './WeatherIcon';
import { Droplets, Wind, ArrowUp, ArrowDown } from 'lucide-react';

interface ForecastGridProps {
  daily: DailyForecast;
  unit: UnitSystem;
}

export const ForecastGrid: React.FC<ForecastGridProps> = ({ daily, unit }) => {
  const count = Math.min(daily.time.length, 7);
  const days = Array.from({ length: count }, (_, i) => i);

  return (
    <section id="seven-day-forecast-section" className="mb-8">
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <h3 className="text-lg font-bold text-slate-100 tracking-tight">7-Day Forecast</h3>
          <p className="text-xs text-slate-400">Detailed atmospheric trajectory and precipitation forecast</p>
        </div>
        <span className="text-xs font-medium frosted-pill text-slate-300 px-3 py-1 rounded-full">
          Daily Sync
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {days.map((index) => {
          const dateStr = daily.time[index];
          // dateStr is 'YYYY-MM-DD'
          const dateObj = new Date(`${dateStr}T12:00:00`);
          const dayName = index === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const monthDay = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          const code = daily.weathercode[index];
          const meta = getWeatherMeta(code);
          const maxTemp = daily.temperature_2m_max[index];
          const minTemp = daily.temperature_2m_min[index];
          const precip = daily.precipitation_sum[index] ?? 0;
          const windSpeed = daily.windspeed_10m_max[index] ?? 0;

          const hasPrecip = precip > 0.5;

          return (
            <div
              key={dateStr}
              id={`forecast-day-${index}`}
              className={`flex flex-col justify-between p-3.5 rounded-2xl transition-all duration-200 ${
                index === 0
                  ? 'bg-white/[0.09] border border-sky-400/50 shadow-[0_8px_32px_0_rgba(56,189,248,0.2)] ring-1 ring-sky-400/30 backdrop-blur-xl -translate-y-0.5'
                  : 'frosted-glass frosted-glass-hover'
              }`}
            >
              {/* Day Header */}
              <div className="text-center pb-2 border-b border-white/10">
                <div className="flex items-center justify-center gap-1.5">
                  <span className={`text-sm font-bold ${index === 0 ? 'text-sky-300' : 'text-slate-200'}`}>
                    {dayName}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">{monthDay}</span>
              </div>

              {/* Weather Icon & Condition */}
              <div className="my-3 flex flex-col items-center justify-center text-center">
                <div className="p-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-sky-300 mb-1.5 backdrop-blur-md">
                  <WeatherIcon code={code} isDay={1} className="w-6 h-6 drop-shadow-sm" />
                </div>
                <span className="text-xs font-medium text-slate-200 line-clamp-1" title={meta.label}>
                  {meta.label}
                </span>
              </div>

              {/* High / Low Temps */}
              <div className="flex items-center justify-between text-xs py-1.5 px-2 bg-black/25 border border-white/5 rounded-lg mb-2 backdrop-blur-sm">
                <div className="flex items-center gap-0.5 font-bold text-slate-100">
                  <ArrowUp className="w-3 h-3 text-rose-400" />
                  <span>{formatTemperature(maxTemp, unit, false)}°</span>
                </div>
                <div className="flex items-center gap-0.5 font-medium text-slate-400">
                  <ArrowDown className="w-3 h-3 text-sky-400" />
                  <span>{formatTemperature(minTemp, unit, false)}°</span>
                </div>
              </div>

              {/* Precipitation & Wind stats */}
              <div className="space-y-1 text-[11px]">
                <div
                  className={`flex items-center justify-between px-1.5 py-0.5 rounded ${
                    hasPrecip ? 'bg-sky-500/15 border border-sky-400/25 text-sky-200' : 'text-slate-400'
                  }`}
                  title="Daily Precipitation Sum"
                >
                  <span className="flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-sky-400" />
                    <span>Rain</span>
                  </span>
                  <span className="font-semibold">{formatPrecipitation(precip, unit)}</span>
                </div>

                <div
                  className="flex items-center justify-between px-1.5 py-0.5 text-slate-400"
                  title="Daily Peak Wind Speed"
                >
                  <span className="flex items-center gap-1">
                    <Wind className="w-3 h-3 text-slate-500" />
                    <span>Wind</span>
                  </span>
                  <span>{formatWindSpeed(windSpeed, unit)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
