import { WeatherCategory, WeatherTheme } from '../types';

export interface WeatherMeta {
  code: number;
  label: string;
  category: WeatherCategory;
  iconName: 'Sun' | 'CloudSun' | 'Cloud' | 'CloudFog' | 'CloudDrizzle' | 'CloudRain' | 'CloudSnow' | 'CloudLightning';
}

export const WMO_CODE_MAP: Record<number, WeatherMeta> = {
  0: { code: 0, label: 'Clear Sky', category: 'sunny', iconName: 'Sun' },
  1: { code: 1, label: 'Mainly Clear', category: 'sunny', iconName: 'CloudSun' },
  2: { code: 2, label: 'Partly Cloudy', category: 'cloudy', iconName: 'CloudSun' },
  3: { code: 3, label: 'Overcast', category: 'cloudy', iconName: 'Cloud' },
  45: { code: 45, label: 'Foggy', category: 'cloudy', iconName: 'CloudFog' },
  48: { code: 48, label: 'Depositing Rime Fog', category: 'cloudy', iconName: 'CloudFog' },
  51: { code: 51, label: 'Light Drizzle', category: 'rainy', iconName: 'CloudDrizzle' },
  53: { code: 53, label: 'Moderate Drizzle', category: 'rainy', iconName: 'CloudDrizzle' },
  55: { code: 55, label: 'Dense Drizzle', category: 'rainy', iconName: 'CloudDrizzle' },
  56: { code: 56, label: 'Light Freezing Drizzle', category: 'snowy', iconName: 'CloudSnow' },
  57: { code: 57, label: 'Dense Freezing Drizzle', category: 'snowy', iconName: 'CloudSnow' },
  61: { code: 61, label: 'Slight Rain', category: 'rainy', iconName: 'CloudRain' },
  63: { code: 63, label: 'Moderate Rain', category: 'rainy', iconName: 'CloudRain' },
  65: { code: 65, label: 'Heavy Rain', category: 'rainy', iconName: 'CloudRain' },
  66: { code: 66, label: 'Light Freezing Rain', category: 'snowy', iconName: 'CloudSnow' },
  67: { code: 67, label: 'Heavy Freezing Rain', category: 'snowy', iconName: 'CloudSnow' },
  71: { code: 71, label: 'Slight Snow Fall', category: 'snowy', iconName: 'CloudSnow' },
  73: { code: 73, label: 'Moderate Snow Fall', category: 'snowy', iconName: 'CloudSnow' },
  75: { code: 75, label: 'Heavy Snow Fall', category: 'snowy', iconName: 'CloudSnow' },
  77: { code: 77, label: 'Snow Grains', category: 'snowy', iconName: 'CloudSnow' },
  80: { code: 80, label: 'Slight Rain Showers', category: 'rainy', iconName: 'CloudRain' },
  81: { code: 81, label: 'Moderate Rain Showers', category: 'rainy', iconName: 'CloudRain' },
  82: { code: 82, label: 'Violent Rain Showers', category: 'rainy', iconName: 'CloudRain' },
  85: { code: 85, label: 'Slight Snow Showers', category: 'snowy', iconName: 'CloudSnow' },
  86: { code: 86, label: 'Heavy Snow Showers', category: 'snowy', iconName: 'CloudSnow' },
  95: { code: 95, label: 'Thunderstorm', category: 'thunderstorm', iconName: 'CloudLightning' },
  96: { code: 96, label: 'Thunderstorm with Slight Hail', category: 'thunderstorm', iconName: 'CloudLightning' },
  99: { code: 99, label: 'Thunderstorm with Heavy Hail', category: 'thunderstorm', iconName: 'CloudLightning' },
};

export function getWeatherMeta(code: number): WeatherMeta {
  if (WMO_CODE_MAP[code]) {
    return WMO_CODE_MAP[code];
  }
  // Fallbacks based on ranges
  if (code >= 95) return { code, label: 'Thunderstorm', category: 'thunderstorm', iconName: 'CloudLightning' };
  if (code >= 70 && code <= 77) return { code, label: 'Snow', category: 'snowy', iconName: 'CloudSnow' };
  if (code >= 50 && code <= 67) return { code, label: 'Rain', category: 'rainy', iconName: 'CloudRain' };
  if (code >= 80 && code <= 82) return { code, label: 'Rain Showers', category: 'rainy', iconName: 'CloudRain' };
  if (code >= 85 && code <= 86) return { code, label: 'Snow Showers', category: 'snowy', iconName: 'CloudSnow' };
  if (code >= 2 && code <= 48) return { code, label: 'Cloudy', category: 'cloudy', iconName: 'Cloud' };
  return { code, label: 'Clear Sky', category: 'sunny', iconName: 'Sun' };
}

/**
 * Returns specific themes strictly confined to the main weather card container:
 * - clear/sunny = warm golden gradient
 * - rain = dark slate-blue
 * - snow = icy pastel
 * - clouds = overcast gray
 * - thunderstorm = deep electric indigo/charcoal
 */
export function getWeatherTheme(code: number, isDay = 1): WeatherTheme {
  const meta = getWeatherMeta(code);

  if (meta.category === 'sunny') {
    if (isDay === 0) {
      // Clear night with frosted glass depth
      return {
        category: 'sunny',
        gradient: 'linear-gradient(135deg, rgba(30, 27, 75, 0.88) 0%, rgba(49, 46, 129, 0.85) 50%, rgba(15, 23, 42, 0.92) 100%)',
        borderClass: 'border-indigo-400/30',
        glowClass: 'shadow-[0_20px_50px_rgba(49,46,129,0.25)]',
        textPrimary: 'text-amber-100',
        textSecondary: 'text-indigo-200/80',
        badgeBg: 'bg-indigo-950/60 text-amber-200 border border-indigo-400/30',
        accentColor: '#fbbf24',
      };
    }
    // Warm golden frosted glass gradient
    return {
      category: 'sunny',
      gradient: 'linear-gradient(135deg, rgba(251, 191, 36, 0.92) 0%, rgba(245, 158, 11, 0.92) 55%, rgba(217, 119, 6, 0.96) 100%)',
      borderClass: 'border-amber-300/50',
      glowClass: 'shadow-[0_20px_50px_rgba(245,158,11,0.28)]',
      textPrimary: 'text-slate-950',
      textSecondary: 'text-amber-950/80',
      badgeBg: 'bg-black/20 text-slate-950 border border-amber-950/20',
      accentColor: '#fbbf24',
    };
  }

  if (meta.category === 'rainy') {
    // Dark slate-blue frosted glass
    return {
      category: 'rainy',
      gradient: 'linear-gradient(135deg, rgba(15, 23, 42, 0.88) 0%, rgba(30, 41, 59, 0.85) 40%, rgba(30, 58, 138, 0.85) 85%, rgba(23, 37, 84, 0.92) 100%)',
      borderClass: 'border-sky-400/35',
      glowClass: 'shadow-[0_20px_50px_rgba(30,58,138,0.28)]',
      textPrimary: 'text-sky-50',
      textSecondary: 'text-sky-200/80',
      badgeBg: 'bg-sky-950/60 text-sky-200 border border-sky-400/30',
      accentColor: '#38bdf8',
    };
  }

  if (meta.category === 'snowy') {
    // Icy pastel frosted glass gradient
    return {
      category: 'snowy',
      gradient: 'linear-gradient(135deg, rgba(15, 23, 42, 0.88) 0%, rgba(30, 41, 59, 0.85) 35%, rgba(51, 65, 85, 0.85) 65%, rgba(71, 85, 105, 0.9) 100%)',
      borderClass: 'border-cyan-300/40',
      glowClass: 'shadow-[0_20px_50px_rgba(56,189,248,0.2)]',
      textPrimary: 'text-cyan-50',
      textSecondary: 'text-cyan-100/80',
      badgeBg: 'bg-slate-900/60 text-cyan-200 border border-cyan-300/30',
      accentColor: '#67e8f9',
    };
  }

  if (meta.category === 'thunderstorm') {
    // Dark dramatic electric thunderstorm
    return {
      category: 'thunderstorm',
      gradient: 'linear-gradient(135deg, rgba(10, 10, 20, 0.92) 0%, rgba(49, 46, 129, 0.85) 50%, rgba(67, 56, 202, 0.8) 80%, rgba(30, 27, 75, 0.95) 100%)',
      borderClass: 'border-purple-400/40',
      glowClass: 'shadow-[0_20px_50px_rgba(129,140,248,0.25)]',
      textPrimary: 'text-purple-50',
      textSecondary: 'text-purple-200/80',
      badgeBg: 'bg-purple-950/60 text-purple-200 border border-purple-400/30',
      accentColor: '#c084fc',
    };
  }

  // Overcast gray (clouds)
  return {
    category: 'cloudy',
    gradient: 'linear-gradient(135deg, rgba(17, 20, 28, 0.9) 0%, rgba(30, 36, 48, 0.88) 40%, rgba(46, 56, 77, 0.85) 75%, rgba(61, 74, 102, 0.88) 100%)',
    borderClass: 'border-slate-400/30',
    glowClass: 'shadow-[0_20px_50px_rgba(0,0,0,0.4)]',
    textPrimary: 'text-zinc-50',
    textSecondary: 'text-zinc-300/80',
    badgeBg: 'bg-zinc-900/70 text-zinc-200 border border-zinc-500/30',
    accentColor: '#a1a1aa',
  };
}
