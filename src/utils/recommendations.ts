import { CurrentWeather, DailyForecast, PlanningRecommendation, UnitSystem } from '../types';
import { formatPrecipitation, formatTemperature, formatWindSpeed } from './conversions';

export function generatePlanningRecommendations(
  current: CurrentWeather,
  daily: DailyForecast,
  unit: UnitSystem
): PlanningRecommendation[] {
  const recommendations: PlanningRecommendation[] = [];

  // 1. Severe Weather Alerts & Immediate Hazards
  const isThunderstorm = current.weathercode >= 95;
  const isSnowing = [71, 73, 75, 77, 85, 86, 56, 57, 66, 67].includes(current.weathercode);
  const todayPrecip = daily.precipitation_sum?.[0] ?? 0;
  const todayMaxWind = daily.windspeed_10m_max?.[0] ?? current.windspeed;
  const currentTemp = current.temperature;

  if (isThunderstorm) {
    recommendations.push({
      id: 'severe-thunderstorm',
      type: 'alert',
      title: 'Thunderstorm Warning',
      description: 'Active electrical storms in the area. Seek indoor shelter and postpone outdoor recreational activities.',
      iconName: 'Zap',
      metric: 'Severe',
    });
  } else if (isSnowing) {
    recommendations.push({
      id: 'snow-warning',
      type: 'caution',
      title: 'Snow & Freezing Conditions',
      description: 'Snowfall or freezing precipitation present. Drive cautiously, allow extra transit time, and watch for icy patches on walkways.',
      iconName: 'Snowflake',
      metric: `${formatTemperature(currentTemp, unit)}`,
    });
  }

  // 2. Rain & Umbrella Advice
  const upcomingRainyDays = daily.precipitation_sum.filter((p, i) => i > 0 && p >= 2.5).length;
  if (todayPrecip >= 5) {
    recommendations.push({
      id: 'heavy-rain-today',
      type: 'caution',
      title: 'Pack Rain Gear & Umbrella',
      description: `Significant precipitation expected today (${formatPrecipitation(todayPrecip, unit)}). Waterproof outerwear and an umbrella are strongly recommended.`,
      iconName: 'Umbrella',
      metric: `${formatPrecipitation(todayPrecip, unit)}`,
    });
  } else if (todayPrecip >= 1) {
    recommendations.push({
      id: 'light-rain-today',
      type: 'info',
      title: 'Light Showers Expected',
      description: `Occasional showers anticipated (${formatPrecipitation(todayPrecip, unit)}). Keep a compact umbrella handy if commuting outdoors.`,
      iconName: 'CloudRain',
      metric: `${formatPrecipitation(todayPrecip, unit)}`,
    });
  } else if (upcomingRainyDays >= 2) {
    recommendations.push({
      id: 'rain-ahead',
      type: 'info',
      title: 'Showers Later in the Week',
      description: `Rain is forecasted on ${upcomingRainyDays} days over the coming week. Plan outdoor chores or events accordingly.`,
      iconName: 'CloudRain',
      metric: `${upcomingRainyDays} days`,
    });
  }

  // 3. Wind & Gale Warnings
  if (todayMaxWind >= 50) {
    recommendations.push({
      id: 'high-wind',
      type: 'alert',
      title: 'High Wind Warning',
      description: `Gusty conditions with winds up to ${formatWindSpeed(todayMaxWind, unit)}. Secure loose outdoor items and anticipate minor travel delays.`,
      iconName: 'Wind',
      metric: `${formatWindSpeed(todayMaxWind, unit)}`,
    });
  } else if (todayMaxWind >= 35) {
    recommendations.push({
      id: 'breezy-day',
      type: 'info',
      title: 'Breezy Weather',
      description: `Moderate winds up to ${formatWindSpeed(todayMaxWind, unit)}. A windbreaker or jacket is advised when outdoors.`,
      iconName: 'Wind',
      metric: `${formatWindSpeed(todayMaxWind, unit)}`,
    });
  }

  // 4. Thermal Comfort / Dress Code
  if (currentTemp <= 0) {
    recommendations.push({
      id: 'freezing-cold',
      type: 'caution',
      title: 'Sub-Zero Freezing Temperatures',
      description: `Thermometer reads ${formatTemperature(currentTemp, unit)}. Wear thermal base layers, insulated winter coat, gloves, and a warm hat.`,
      iconName: 'ThermometerSnowflake',
      metric: `${formatTemperature(currentTemp, unit)}`,
    });
  } else if (currentTemp >= 30) {
    recommendations.push({
      id: 'high-heat',
      type: 'caution',
      title: 'Elevated Heat & UV Exposure',
      description: `Highs around ${formatTemperature(currentTemp, unit)}. Stay hydrated with plenty of water, wear sunscreen (SPF 30+), and seek shade during midday peak.`,
      iconName: 'Sun',
      metric: `${formatTemperature(currentTemp, unit)}`,
    });
  }

  // 5. Best Day for Outdoor Activities (Window of Opportunity)
  if (daily.time && daily.time.length > 1) {
    let bestDayIndex = -1;
    let lowestPrecip = 999;

    for (let i = 0; i < daily.time.length; i++) {
      const precip = daily.precipitation_sum[i] ?? 0;
      const code = daily.weathercode[i];
      const maxWind = daily.windspeed_10m_max[i] ?? 0;
      // Prefer clear/sunny (0, 1, 2) with lowest precip and wind < 30
      if (precip <= lowestPrecip && [0, 1, 2].includes(code) && maxWind < 35) {
        lowestPrecip = precip;
        bestDayIndex = i;
      }
    }

    if (bestDayIndex !== -1) {
      const bestDateStr = daily.time[bestDayIndex];
      const dateObj = new Date(`${bestDateStr}T12:00:00`);
      const dayName = bestDayIndex === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'long' });
      const maxT = daily.temperature_2m_max[bestDayIndex];

      recommendations.push({
        id: 'best-outdoor-window',
        type: 'positive',
        title: `Prime Outdoor Window: ${dayName}`,
        description: `Favorable calm conditions (${formatTemperature(maxT, unit)}, minimal rain risk). Ideal for running, outdoor sports, or weekend errands.`,
        iconName: 'Sparkles',
        metric: dayName,
      });
    }
  }

  // Fallback pleasant recommendation if few warnings
  if (recommendations.length < 2) {
    recommendations.push({
      id: 'general-comfort',
      type: 'positive',
      title: 'Stable Atmospheric Conditions',
      description: 'No severe weather disturbances detected. Standard routine activities and transit should proceed smoothly.',
      iconName: 'CheckCircle2',
      metric: 'Good',
    });
  }

  return recommendations;
}
