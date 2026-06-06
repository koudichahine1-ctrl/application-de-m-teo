# Skye — Weather App

A clean, dark-themed weather app using the OpenWeatherMap API. No frameworks, no build tools — just HTML, CSS, and vanilla JS.

---

## Features

- Current weather (temp, humidity, wind, visibility, pressure)
- Sunrise & sunset times
- 5-day forecast
- Toggle °C / °F
- Remembers last searched city (localStorage)
- Fully responsive

## Setup

1. Get a free API key at [openweathermap.org](https://openweathermap.org/api)
2. Open `js/api.js` and replace `YOUR_API_KEY_HERE` with your key:
   ```js
   let KEY = localStorage.getItem('owm_key') || 'YOUR_API_KEY_HERE';
   ```
3. Open `index.html` in your browser — done.

> **Note:** The free OWM tier activates your key within ~2 hours of registration.

## Project Structure

```
weather-app/
├── index.html          # Markup
├── css/
│   ├── reset.css       # Minimal reset
│   └── style.css       # All styles
├── js/
│   ├── api.js          # Fetch logic (OWM endpoints)
│   ├── ui.js           # DOM rendering
│   └── app.js          # Entry point, event wiring
└── README.md
```

## Architecture

Three JS modules with clear responsibilities:

| Module | Role |
|--------|------|
| `api.js` | Network calls only |
| `ui.js`  | DOM updates only |
| `app.js` | Glue: events + state |

## Deploy

Works on any static host (GitHub Pages, Netlify, Vercel).

For GitHub Pages: push to a repo → Settings → Pages → Deploy from branch `main`.

## License

MIT
