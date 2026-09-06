export type UnitSystem = 'metric' | 'imperial';

export interface GeoCity {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code?: string;
  admin1?: string; // State / Province
  timezone?: string;
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
}

export interface DailyForecast {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  windspeed_10m_max: number[];
}

export interface ForecastApiResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  elevation?: number;
  current_weather: CurrentWeather;
  daily: DailyForecast;
  daily_units: {
    temperature_2m_max: string;
    temperature_2m_min: string;
    precipitation_sum: string;
    windspeed_10m_max: string;
  };
}

export type WeatherCategory = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'thunderstorm';

export interface WeatherTheme {
  category: WeatherCategory;
  gradient: string;
  borderClass: string;
  glowClass: string;
  textPrimary: string;
  textSecondary: string;
  badgeBg: string;
  accentColor: string;
}

export interface PlanningRecommendation {
  id: string;
  type: 'alert' | 'caution' | 'positive' | 'info';
  title: string;
  description: string;
  iconName: string;
  metric?: string;
}
