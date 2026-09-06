import React from 'react';
import {
  Sparkles,
  AlertTriangle,
  Umbrella,
  CloudRain,
  Wind,
  Snowflake,
  Sun,
  Zap,
  CheckCircle2,
  ThermometerSnowflake,
  CalendarCheck,
} from 'lucide-react';
import { CurrentWeather, DailyForecast, PlanningRecommendation, UnitSystem } from '../types';
import { generatePlanningRecommendations } from '../utils/recommendations';

interface PlanningCardProps {
  current: CurrentWeather;
  daily: DailyForecast;
  unit: UnitSystem;
}

export const PlanningCard: React.FC<PlanningCardProps> = ({ current, daily, unit }) => {
  const recommendations = generatePlanningRecommendations(current, daily, unit);

  const renderIcon = (iconName: string, type: PlanningRecommendation['type']) => {
    const className = 'w-5 h-5 shrink-0';
    switch (iconName) {
      case 'Zap':
        return <Zap className={`${className} text-rose-400`} />;
      case 'Snowflake':
        return <Snowflake className={`${className} text-cyan-300`} />;
      case 'Umbrella':
        return <Umbrella className={`${className} text-sky-400`} />;
      case 'CloudRain':
        return <CloudRain className={`${className} text-sky-400`} />;
      case 'Wind':
        return <Wind className={`${className} text-amber-400`} />;
      case 'Sun':
        return <Sun className={`${className} text-amber-400`} />;
      case 'ThermometerSnowflake':
        return <ThermometerSnowflake className={`${className} text-cyan-400`} />;
      case 'Sparkles':
        return <Sparkles className={`${className} text-emerald-400`} />;
      case 'CheckCircle2':
        return <CheckCircle2 className={`${className} text-emerald-400`} />;
      default:
        return <AlertTriangle className={`${className} text-neutral-400`} />;
    }
  };

  const getTypeStyles = (type: PlanningRecommendation['type']) => {
    switch (type) {
      case 'alert':
        return {
          container: 'bg-rose-500/10 border-rose-400/30 shadow-[0_4px_20px_0_rgba(244,63,94,0.1)]',
          badge: 'bg-rose-500/20 text-rose-200 border-rose-400/40',
          badgeText: 'Alert',
        };
      case 'caution':
        return {
          container: 'bg-amber-500/10 border-amber-400/30 shadow-[0_4px_20px_0_rgba(245,158,11,0.08)]',
          badge: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
          badgeText: 'Notice',
        };
      case 'positive':
        return {
          container: 'bg-emerald-500/10 border-emerald-400/30 shadow-[0_4px_20px_0_rgba(16,185,129,0.08)]',
          badge: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
          badgeText: 'Optimal',
        };
      case 'info':
      default:
        return {
          container: 'bg-white/[0.05] border-white/10 shadow-[0_4px_20px_0_rgba(0,0,0,0.2)]',
          badge: 'frosted-pill text-slate-300',
          badgeText: 'Forecast',
        };
    }
  };

  return (
    <div
      id="smart-planning-recommendations-card"
      className="frosted-glass rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-400/30 backdrop-blur-md">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
                Planning Intelligence
              </h3>
              <p className="text-xs text-slate-400">Context-aware advice & condition analysis</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-slate-300 frosted-pill px-2.5 py-1 rounded-full">
            {recommendations.length} insights
          </span>
        </div>

        <div className="space-y-3">
          {recommendations.map((item) => {
            const styles = getTypeStyles(item.type);
            return (
              <div
                key={item.id}
                id={`recommendation-item-${item.id}`}
                className={`p-3.5 rounded-2xl border backdrop-blur-md transition-all hover:translate-x-0.5 ${styles.container}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{renderIcon(item.iconName, item.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-xs font-bold text-slate-100 tracking-wide">
                        {item.title}
                      </h4>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${styles.badge}`}>
                        {styles.badgeText}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300/90 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Evaluated continuously against live WMO telemetry</span>
        <span className="text-emerald-400 font-medium">Ready for transit & outdoors</span>
      </div>
    </div>
  );
};
