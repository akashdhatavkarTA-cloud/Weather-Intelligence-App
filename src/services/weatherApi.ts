import { ForecastApiResponse, GeoCity } from '../types';

export const DEFAULT_TORONTO: GeoCity = {
  id: 6167865,
  name: 'Toronto',
  admin1: 'Ontario',
  country: 'Canada',
  country_code: 'CA',
  latitude: 43.7001,
  longitude: -79.4163,
  timezone: 'America/Toronto',
};

export class WeatherApiError extends Error {
  constructor(message: string, public readonly isNetworkError = false) {
    super(message);
    this.name = 'WeatherApiError';
  }
}

/**
 * Searches cities using Open-Meteo Geocoding API
 */
export async function searchCities(query: string, signal?: AbortSignal): Promise<GeoCity[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const endpoint = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=5&language=en&format=json`;

  try {
    const response = await fetch(endpoint, { signal });
    if (!response.ok) {
      throw new WeatherApiError(`Geocoding service returned HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country || '',
      country_code: item.country_code,
      admin1: item.admin1,
      timezone: item.timezone,
    }));
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw err;
    }
    if (err instanceof WeatherApiError) {
      throw err;
    }
    throw new WeatherApiError(
      'Unable to connect to the geocoding service. Please check your internet connection.',
      true
    );
  }
}

/**
 * Fetches current weather and 7-day forecast from Open-Meteo Forecast API
 */
export async function fetchForecast(
  latitude: number,
  longitude: number,
  signal?: AbortSignal
): Promise<ForecastApiResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current_weather: 'true',
    daily: 'weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max',
    timezone: 'auto',
  });

  const endpoint = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  try {
    const response = await fetch(endpoint, { signal });
    if (!response.ok) {
      throw new WeatherApiError(`Weather forecast service returned HTTP ${response.status}: ${response.statusText}`);
    }

    const data: ForecastApiResponse = await response.json();

    if (!data || !data.current_weather || !data.daily) {
      throw new WeatherApiError('Incomplete weather forecast payload received from server.');
    }

    return data;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw err;
    }
    if (err instanceof WeatherApiError) {
      throw err;
    }
    throw new WeatherApiError(
      'Failed to load weather forecast metrics. Please verify your connection or retry shortly.',
      true
    );
  }
}
