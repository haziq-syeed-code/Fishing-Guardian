# Fishing Assistant Application

A comprehensive web application designed to assist fishermen in Tamil Nadu with weather information, fishing predictions, route optimization, safety alerts, and community reporting.

![Fishing Assistant Dashboard](https://placeholder.pics/svg/800x400/DEDEDE/555555/Fishing%20Assistant%20Dashboard)

## Overview

Fishing Assistant is a Next.js application that provides fishermen with real-time marine data, fishing predictions, route optimization, territorial compliance alerts, and a community reporting system. The application aims to improve fishing efficiency, reduce fuel consumption, enhance safety, and promote sustainable fishing practices.

## Features

### Marine Weather Data
- Real-time weather conditions including temperature, wind speed, wave height
- Tide information and forecasts
- Visibility and pressure data
- UV index and current information

### Fishing Predictions
- AI-powered fishing spot recommendations
- Species-specific predictions
- Best time of day for fishing
- Probability ratings for different locations

### Interactive Map
- Fishing zones and recommended spots
- Restricted and overfished areas
- Territorial boundary alerts
- Community-reported hazards and conditions
- Custom location marking

### Route Optimization
- Fuel-efficient route planning
- Time and distance calculations
- Customizable boat parameters (speed, fuel consumption)
- Multiple waypoints navigation
- Harbor-to-fishing spot routing

### Safety Alerts
- Weather warnings and alerts
- Territorial boundary notifications
- Naval exercise and restricted zone warnings
- Community-reported hazards

### Activity Reporting
- Report overfished areas
- Mark dangerous conditions
- Request emergency assistance
- View community reports history

### Offline Support
- Basic functionality without internet connection
- Cached map data
- Stored critical alerts

## Technologies Used

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Maps**: Google Maps API
- **Weather Data**: OpenWeather API, StormGlass API
- **State Management**: React Hooks
- **Styling**: Tailwind CSS, Lucide React icons

## Prerequisites

Before you begin, ensure you have:
- Node.js 18.x or higher
- npm or yarn
- Required API keys (see Environment Variables section)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/haziq-syeed-code/fishing-assistant.git
   cd fishing-assistant
