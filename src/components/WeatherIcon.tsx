import React from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Moon,
  CloudMoon,
} from 'lucide-react';
import { getWeatherMeta } from '../utils/weatherCodes';

interface WeatherIconProps {
  code: number;
  isDay?: number;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  code,
  isDay = 1,
  className = 'w-6 h-6',
  size,
}) => {
  const meta = getWeatherMeta(code);

  if (isDay === 0) {
    if (meta.code === 0) {
      return <Moon className={className} size={size} />;
    }
    if (meta.code === 1 || meta.code === 2) {
      return <CloudMoon className={className} size={size} />;
    }
  }

  switch (meta.iconName) {
    case 'Sun':
      return <Sun className={className} size={size} />;
    case 'CloudSun':
      return <CloudSun className={className} size={size} />;
    case 'Cloud':
      return <Cloud className={className} size={size} />;
    case 'CloudFog':
      return <CloudFog className={className} size={size} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={className} size={size} />;
    case 'CloudRain':
      return <CloudRain className={className} size={size} />;
    case 'CloudSnow':
      return <CloudSnow className={className} size={size} />;
    case 'CloudLightning':
      return <CloudLightning className={className} size={size} />;
    default:
      return <Sun className={className} size={size} />;
  }
};
