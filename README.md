# Weather App

A simple bilingual weather card for Cairo built with React and Material UI. It fetches current conditions from OpenWeatherMap and supports live Arabic/English toggling.

- Live demo: [weatherappbytarek.netlify.app](https://weatherappbytarek.netlify.app/)  
- Current location: Cairo, Egypt (static lat/lon in code)

## Features
- Current temperature with icon, min/max, and condition text.
- Arabic/English toggle powered by `react-i18next` with RTL/LTR layout switch.
- Moment.js date display localized with the selected language.
- Material UI styling with the Tajawal font loaded from `public/fonts`.
- Loading spinner while the API request completes.

## Tech stack
- React (CRA), Material UI, Axios
- i18next + i18next-browser-languagedetector + i18next-http-backend
- Moment.js for localized date formatting

## Getting started
1) Install dependencies  
```bash
npm install
```

2) Start the dev server  
```bash
npm start
```
App runs at http://localhost:3000.

3) Run tests  
```bash
npm test
```

4) Build for production  
```bash
npm run build
```

## API usage
- Data source: OpenWeatherMap current weather endpoint.
- The sample key is hard-coded in `src/App.js`. For your own deployments, create a `.env` file and store a key as `REACT_APP_OPENWEATHER_API_KEY`, then update the request URL to read from `process.env.REACT_APP_OPENWEATHER_API_KEY`.
- Latitude/longitude are set to Cairo (30.033333, 31.233334); change them in `src/App.js` to target a different city.

## Localization
- Arabic translations live in `public/locales/ar/translation.json`.
- i18next configuration is in `src/i18n.js`. The language toggle in `App.js` flips both the locale and text direction.

## Folder notes
- `src/App.js`: main UI, API call, language toggle.
- `src/App.css`: theme background and Tajawal font-face declarations.
- `public/fonts/tajawal`: bundled Arabic-friendly font used by MUI theme.
