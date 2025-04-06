

1. Install dependencies:

```
npm install
 or
yarn install
```


2. Set up environment variables (see below)
3. Run the development server:

```
npm run dev
 or
yarn dev
```


4. Open [http://localhost:3000](http://localhost:3000) in your browser


## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
OPENWEATHER_API_KEY=your_openweather_api_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
STORMGLASS_API_KEY=your_stormglass_api_key
```

### Required API Keys:

1. **OpenWeather API**: For basic weather data. Get a key at [OpenWeather](https://openweathermap.org/api)
2. **Google Maps API**: For map functionality. Get a key at [Google Cloud Platform](https://console.cloud.google.com/)
3. **StormGlass API**: For marine data. Get a key at [StormGlass](https://stormglass.io/)


## Usage

### Dashboard

The main dashboard provides an overview of current marine conditions, fishing predictions, and a map with fishing spots.

### Map View

The full-screen map allows you to:

- View recommended fishing spots
- See restricted and overfished areas
- Get territorial compliance alerts
- Report overfished areas or unsafe conditions
- Save favorite fishing locations


### Route Optimizer

Plan the most fuel-efficient route to your fishing destination:

1. Select your starting point (current location, harbor, or custom coordinates)
2. Choose your destination
3. Adjust your boat's speed and fuel consumption
4. Calculate the optimal route with time and fuel estimates


### Report Activity

Report fishing conditions or request assistance:

1. Choose the type of report (overfished area, dangerous conditions, etc.)
2. Provide a description
3. Set the urgency level
4. Submit to alert other fishermen


### Alerts

View important notifications about:

- Weather conditions
- Naval exercises
- Fishing festivals
- Government announcements


## Project Structure

```
fishing-assistant/
├── app/                  # Next.js app router
│   ├── api/              # API routes
│   ├── alerts/           # Alerts page
│   ├── map/              # Map page
│   ├── report/           # Report activity page
│   ├── route-optimizer/  # Route optimizer page
│   ├── settings/         # Settings page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── ui/               # UI components (shadcn)
│   ├── alerts.tsx
│   ├── dashboard.tsx
│   ├── enhanced-fishing-predictions.tsx
│   ├── enhanced-map.tsx
│   ├── enhanced-weather.tsx
│   ├── fishing-map.tsx
│   ├── fishing-predictions.tsx
│   ├── improved-route-optimizer.tsx
│   ├── map-fullscreen.tsx
│   ├── report-activity.tsx
│   ├── route-optimizer.tsx
│   └── weather.tsx
├── lib/                  # Utility functions
│   └── marine-data-service.ts
├── public/               # Static assets
├── .env.local            # Environment variables (create this)
├── next.config.js
├── package.json
├── README.md
└── tsconfig.json
```

## Deployment

The application can be deployed to Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Configure the environment variables
4. Deploy


## Future Enhancements

- User authentication and profiles
- Catch reporting and statistics
- Advanced weather radar overlays
- Offline maps and navigation
- Community forums and fishing tips
- Multi-language support (Tamil, Telugu)
- Mobile app versions (iOS, Android)



## Acknowledgements

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Google Maps API](https://developers.google.com/maps)
- [OpenWeather API](https://openweathermap.org/api)
- [StormGlass API](https://stormglass.io/)
- [Lucide Icons](https://lucide.dev/)
