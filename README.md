# Weather App

A bilingual weather card built with React and Material UI. It shows current conditions from OpenWeatherMap, lets you search for cities worldwide, and toggles between Arabic and English with RTL/LTR layout.

**Live demo:** [weatherappbytarek.netlify.app](https://weatherappbytarek.netlify.app/)

## Features

- Current temperature, weather icon, min/max, and condition text
- City search with MUI Autocomplete (OpenWeatherMap Geocoding API)
- Selected city saved in `localStorage` across visits
- Arabic/English toggle via `react-i18next` with RTL/LTR direction switch
- Localized date display with Moment.js
- Loading spinner while weather data is fetched
- Tajawal font and custom MUI theme

## Tech stack

- React (CRA), Material UI, Axios
- Redux Toolkit (`weatherApiSlice`) for async API state
- React Context for search query and latitude/longitude
- i18next + `react-i18next` for translations
- Moment.js for localized dates

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Add your OpenWeatherMap API key. Create a `.env` file in the project root:

```env
REACT_APP_WEATHER_API_KEY=your_api_key_here
```

Get a free key at [openweathermap.org/api](https://openweathermap.org/api).

3. Start the dev server:

```bash
npm start
```

App runs at [http://localhost:3000](http://localhost:3000).

4. Other scripts:

```bash
npm test          # Run tests
npm run build     # Production build
```

## API usage

- **Current weather:** `GET /data/2.5/weather` — called with `lat` and `lon` from `src/weatherApiSlice.js`
- **City search:** `GET /geo/1.0/direct` — used when typing in the Autocomplete field
- Default coordinates are Cairo, Egypt (`30.033333`, `31.233334`) in `src/latAndLoncontext.js`; picking a city updates them via context

Never commit your `.env` file or expose API keys in client-side code beyond what CRA injects at build time.

## Localization

- Arabic: `public/locales/ar/translation.json`
- English: `public/locales/en/translation.json`
- Config: `src/i18n.js` — language toggle in `App.js` updates locale, Moment.js, and text direction

## Project structure

```
weather-app/
├── public/
│   ├── fonts/tajawal/       # Arabic-friendly font
│   └── locales/             # i18n JSON files
├── src/
│   ├── App.js               # Main UI, Autocomplete, language toggle
│   ├── App.css              # Theme background and font-face
│   ├── weatherApiSlice.js   # Redux async thunks (weather + cities)
│   ├── store.js             # Redux store
│   ├── searchContext.js     # City search input state
│   ├── latAndLoncontext.js  # Selected coordinates (default: Cairo)
│   └── i18n.js              # i18next setup
└── package.json
```

## Author

Part of the **React Front-End Course** project collection.
