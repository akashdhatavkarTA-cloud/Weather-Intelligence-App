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

---

## 🚢 Deployment Guide

### Part 1: Exporting from Google AI Studio to GitHub

You can export this codebase directly from AI Studio into a GitHub repository using either of the two methods below:

#### Method A: Direct GitHub Export (Recommended)
1. In the **Google AI Studio** workspace header/settings menu (top right), click the **Share** or **Settings / Export** icon.
2. Select **Export to GitHub**.
3. Authenticate with your GitHub account if prompted.
4. Choose whether to create a **New Repository** (public or private) or push to an existing repository.
5. Confirm the export. AI Studio will commit and push all project files directly to your GitHub repository.

#### Method B: Export via ZIP Download & Push
1. In AI Studio, open the project menu and choose **Download ZIP**.
2. Extract the downloaded ZIP folder to your local machine.
3. Open a terminal inside the unzipped folder and initialize Git:
   ```bash
   git init
   git add .
   git commit -m "Initial commit from Google AI Studio"
   git branch -M main

Create a new repository on GitHub.
Link and push to GitHub:
Bash
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main

Part 2: Deploying to Cloudflare Pages
Cloudflare Pages provides fast, global hosting for Vite/React single-page applications with zero server configuration required.
Step 1: Connect your GitHub Repository
Log in to the Cloudflare Dashboard.
In the left-hand navigation sidebar, go to Workers & Pages.
Click Create Application > select the Pages tab > click Connect to Git.
Select your GitHub account and choose the weather-intelligence repository you exported in Part 1.
Click Begin setup.
Step 2: Configure Build Settings
Fill in the project configuration with the following parameters:
Configuration Setting	Value
Project Name	weather-intelligence (or your preferred subdomain)
Production Branch	main
Framework Preset	Vite
Build Command	npm run build
Build Output Directory	dist
Root Directory	(Leave empty / root)
(Optional) Under Environment Variables, ensure NODE_VERSION is set to 18 or 20 if prompted.
Step 3: Deploy
Click Save and Deploy.
Cloudflare will automatically clone your repository, install dependencies, run npm run build, and publish the generated assets from dist/.
Once the build completes, Cloudflare will assign you a live production URL (e.g., https://weather-intelligence.pages.dev).
Step 4: Continuous Deployment
Every subsequent git push to your main branch will automatically trigger a new production deployment in Cloudflare Pages.
