import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { DailyForecast, UnitSystem } from '../types';
import {
  convertPrecipitation,
  convertTemperature,
  formatPrecipitation,
  formatTemperature,
} from '../utils/conversions';
import { getWeatherMeta } from '../utils/weatherCodes';
import { Eye, EyeOff, BarChart3 } from 'lucide-react';

interface ForecastChartProps {
  daily: DailyForecast;
  unit: UnitSystem;
}

interface ChartDataPoint {
  day: string;
  fullDate: string;
  condition: string;
  maxTemp: number;
  minTemp: number;
  rawPrecip: number;
  precip: number;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ daily, unit }) => {
  // Toggle states for individual series
  const [showMaxTemp, setShowMaxTemp] = useState(true);
  const [showMinTemp, setShowMinTemp] = useState(true);
  const [showPrecip, setShowPrecip] = useState(true);

  // Prepare chart dataset
  const chartData: ChartDataPoint[] = useMemo(() => {
    const count = Math.min(daily.time.length, 7);
    return Array.from({ length: count }, (_, i) => {
      const dateStr = daily.time[i];
      const dateObj = new Date(`${dateStr}T12:00:00`);
      const dayLabel = i === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      const fullDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const meta = getWeatherMeta(daily.weathercode[i]);

      const convertedMax = convertTemperature(daily.temperature_2m_max[i], unit);
      const convertedMin = convertTemperature(daily.temperature_2m_min[i], unit);
      const rawP = daily.precipitation_sum[i] ?? 0;
      const convertedPrecip = convertPrecipitation(rawP, unit);

      return {
        day: `${dayLabel} (${fullDate})`,
        fullDate,
        condition: meta.label,
        maxTemp: convertedMax,
        minTemp: convertedMin,
        rawPrecip: rawP,
        precip: convertedPrecip,
      };
    });
  }, [daily, unit]);

  const tempUnitLabel = unit === 'imperial' ? '°F' : '°C';
  const precipUnitLabel = unit === 'imperial' ? 'in' : 'mm';

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0]?.payload as ChartDataPoint;
      return (
        <div className="bg-[#0a0c10]/95 border border-white/20 p-3.5 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl text-xs space-y-2 min-w-[180px]">
          <div className="border-b border-white/10 pb-1.5">
            <p className="font-bold text-slate-100">{dataPoint.day}</p>
            <p className="text-[11px] text-slate-400">{dataPoint.condition}</p>
          </div>

          <div className="space-y-1.5 pt-0.5">
            {showMaxTemp && (
              <div className="flex items-center justify-between text-amber-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
                  <span>Max Temp:</span>
                </span>
                <span className="font-bold">{dataPoint.maxTemp}{tempUnitLabel}</span>
              </div>
            )}
            {showMinTemp && (
              <div className="flex items-center justify-between text-sky-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.6)]" />
                  <span>Min Temp:</span>
                </span>
                <span className="font-bold">{dataPoint.minTemp}{tempUnitLabel}</span>
              </div>
            )}
            {showPrecip && (
              <div className="flex items-center justify-between text-indigo-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(129,140,248,0.6)]" />
                  <span>Precipitation:</span>
                </span>
                <span className="font-bold">{dataPoint.precip} {precipUnitLabel}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="forecast-dual-axis-chart-container" className="frosted-glass rounded-3xl p-5 sm:p-6 shadow-2xl">
      {/* Chart Header & Interactive Series Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-sky-400" />
            <h3 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
              7-Day Atmospheric Trajectory
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Dual Y-axis correlation: Temperature ({tempUnitLabel}) vs. Precipitation ({precipUnitLabel})
          </p>
        </div>

        {/* Interactive Legend Toggles */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Max Temp Toggle */}
          <button
            id="toggle-max-temp-series"
            type="button"
            onClick={() => setShowMaxTemp((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              showMaxTemp
                ? 'frosted-pill bg-amber-500/15 border-amber-400/40 text-amber-200 shadow-sm'
                : 'frosted-pill opacity-40 text-slate-500'
            }`}
            title="Toggle High Temperature series"
          >
            {showMaxTemp ? <Eye className="w-3.5 h-3.5 text-amber-400" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
            <span>High Temp</span>
          </button>

          {/* Min Temp Toggle */}
          <button
            id="toggle-min-temp-series"
            type="button"
            onClick={() => setShowMinTemp((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              showMinTemp
                ? 'frosted-pill bg-sky-500/15 border-sky-400/40 text-sky-200 shadow-sm'
                : 'frosted-pill opacity-40 text-slate-500'
            }`}
            title="Toggle Low Temperature series"
          >
            {showMinTemp ? <Eye className="w-3.5 h-3.5 text-sky-400" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="w-2 h-2 rounded-full bg-sky-400 inline-block shadow-[0_0_6px_rgba(56,189,248,0.6)]" />
            <span>Low Temp</span>
          </button>

          {/* Precipitation Toggle */}
          <button
            id="toggle-precip-series"
            type="button"
            onClick={() => setShowPrecip((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              showPrecip
                ? 'frosted-pill bg-indigo-500/15 border-indigo-400/40 text-indigo-200 shadow-sm'
                : 'frosted-pill opacity-40 text-slate-500'
            }`}
            title="Toggle Precipitation series"
          >
            {showPrecip ? <Eye className="w-3.5 h-3.5 text-indigo-400" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block shadow-[0_0_6px_rgba(129,140,248,0.6)]" />
            <span>Precipitation</span>
          </button>
        </div>
      </div>

      {/* Dual Axis Recharts Canvas */}
      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" vertical={false} />
            
            <XAxis
              dataKey="fullDate"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              dy={8}
            />

            {/* Left Y-Axis: Temperature */}
            <YAxis
              yAxisId="left-temp"
              orientation="left"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              tickFormatter={(val) => `${val}°`}
              domain={['auto', 'auto']}
              label={{
                value: `Temp (${tempUnitLabel})`,
                angle: -90,
                position: 'insideLeft',
                fill: '#64748b',
                fontSize: 10,
                offset: 12,
              }}
            />

            {/* Right Y-Axis: Precipitation */}
            <YAxis
              yAxisId="right-precip"
              orientation="right"
              stroke="#818cf8"
              fontSize={11}
              tickLine={false}
              tickFormatter={(val) => `${val}`}
              domain={[0, 'auto']}
              label={{
                value: `Precip (${precipUnitLabel})`,
                angle: 90,
                position: 'insideRight',
                fill: '#818cf8',
                fontSize: 10,
                offset: 12,
              }}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Precipitation Bar Series (Right Axis) */}
            {showPrecip && (
              <Bar
                yAxisId="right-precip"
                dataKey="precip"
                name="Precipitation"
                fill="#6366f1"
                opacity={0.5}
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
            )}

            {/* High Temperature Line (Left Axis) */}
            {showMaxTemp && (
              <Line
                yAxisId="left-temp"
                type="monotone"
                dataKey="maxTemp"
                name="High Temp"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: '#f59e0b', r: 4, strokeWidth: 1, stroke: '#0a0c10' }}
                activeDot={{ r: 6, fill: '#fbbf24', stroke: '#0a0c10', strokeWidth: 2 }}
              />
            )}

            {/* Low Temperature Line (Left Axis) */}
            {showMinTemp && (
              <Line
                yAxisId="left-temp"
                type="monotone"
                dataKey="minTemp"
                name="Low Temp"
                stroke="#38bdf8"
                strokeWidth={3}
                strokeDasharray="4 4"
                dot={{ fill: '#38bdf8', r: 4, strokeWidth: 1, stroke: '#0a0c10' }}
                activeDot={{ r: 6, fill: '#7dd3fc', stroke: '#0a0c10', strokeWidth: 2 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-2">
        <span>Click series chips above to toggle lines and bars</span>
        <span className="font-mono text-slate-500">Powered by Open-Meteo High-Resolution Models</span>
      </div>
    </div>
  );
};
