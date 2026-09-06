# 🌦️ Weather Intelligence

A modern, responsive weather intelligence and forecast dashboard built with **React**, **TypeScript**, **Tailwind CSS**, and **Recharts**. Powered directly by the **Open-Meteo API**, this application provides real-time meteorological telemetry, 7-day atmospheric projections, dual-axis interactive analytics, and context-aware planning advice—all within a frosted glass aesthetic.

---

## ✨ Features

- **Live Atmospheric Telemetry**: Current temperature, daily high/low, wind speed, wind direction compass bearing, precipitation accumulation, and WMO weather condition badges.
- **Dynamic Weather Theming**: Hero weather card dynamically adapts its frosted glass gradient, ambient glow, and specular reflections based on current conditions (clear day/night, rain, overcast, snow, thunderstorm).
- **7-Day Synoptic Forecast**: Card-based breakdown showing daily minimum/maximum temperatures, expected precipitation volume, peak wind speeds, and descriptive WMO status icons.
- **Dual-Axis Trajectory Chart**: Interactive visualization built with Recharts correlating daily temperature curves (highs/lows) against precipitation bars, with interactive series visibility toggles.
- **Smart Planning Intelligence**: Context-aware recommendations evaluating weather telemetry for outdoor activities, UV/sun protection, rain gear necessities, and wind advisories.
- **Global City Autocomplete**: Debounced search leveraging Open-Meteo's Geocoding API with immediate suggestions for worldwide cities, regions, and countries.
- **Recent Search History**: Quick-access pills for recently viewed locations saved with client-side local persistence.
- **Unit Conversion**: Seamless one-click switching between **Metric** (°C, km/h, mm) and **Imperial** (°F, mph, in) measurement systems.
- **Zero API Key Requirement**: Completely client-side, powered by Open-Meteo's open meteorological data without requiring personal API keys or rate-limit friction.
- **Glassmorphism UI**: High-contrast, dark aesthetic featuring multi-layered backdrop blurs, specular borders, luminous radial accents, and smooth hover interactions.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Data Provider**: [Open-Meteo Weather & Geocoding API](https://open-meteo.com/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.0 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/weather-intelligence.git
   cd weather-intelligence

1. Install Dependencies
   <>bash
  npm install
2. Start the Development Server
   <>bash
   npm run dev
Open http://localhost:3000 in your browser.
3. Build for Production
   <>bash
   npm run build
Meteorological data and geocoding services are provided by the Open-Meteo API under the CC BY 4.0 license.
