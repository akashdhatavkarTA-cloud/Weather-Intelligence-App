import { UnitSystem } from '../types';

export function convertTemperature(celsius: number, unit: UnitSystem): number {
  if (unit === 'imperial') {
    return Math.round(((celsius * 9) / 5 + 32) * 10) / 10;
  }
  return Math.round(celsius * 10) / 10;
}

export function formatTemperature(celsius: number, unit: UnitSystem, includeDegree = true): string {
  const val = Math.round(convertTemperature(celsius, unit));
  return `${val}°${includeDegree ? (unit === 'imperial' ? 'F' : 'C') : ''}`;
}

export function convertWindSpeed(kmh: number, unit: UnitSystem): number {
  if (unit === 'imperial') {
    return Math.round(kmh * 0.621371 * 10) / 10;
  }
  return Math.round(kmh * 10) / 10;
}

export function formatWindSpeed(kmh: number, unit: UnitSystem): string {
  const val = convertWindSpeed(kmh, unit);
  return `${val} ${unit === 'imperial' ? 'mph' : 'km/h'}`;
}

export function convertPrecipitation(mm: number, unit: UnitSystem): number {
  if (unit === 'imperial') {
    return Math.round(mm * 0.0393701 * 100) / 100;
  }
  return Math.round(mm * 10) / 10;
}

export function formatPrecipitation(mm: number, unit: UnitSystem): string {
  const val = convertPrecipitation(mm, unit);
  return `${val} ${unit === 'imperial' ? 'in' : 'mm'}`;
}
