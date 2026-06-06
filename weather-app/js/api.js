/* api.js — OpenWeatherMap calls */

const API = (() => {
  const BASE     = 'https://api.openweathermap.org/data/2.5';
  const FORECAST = `${BASE}/forecast`;
  const CURRENT  = `${BASE}/weather`;

  // Replace with your key from openweathermap.org (free tier works)
  let KEY = localStorage.getItem('owm_key') || 'YOUR_API_KEY_HERE';

  function setKey(key) {
    KEY = key;
    localStorage.setItem('owm_key', key);
  }

  function getKey() { return KEY; }

  async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  // Current weather by city name
  async function getCurrentWeather(city, units = 'metric') {
    const url = `${CURRENT}?q=${encodeURIComponent(city)}&units=${units}&appid=${KEY}`;
    return fetchJSON(url);
  }

  // 5-day / 3h forecast
  async function getForecast(city, units = 'metric') {
    const url = `${FORECAST}?q=${encodeURIComponent(city)}&units=${units}&appid=${KEY}`;
    return fetchJSON(url);
  }

  return { getCurrentWeather, getForecast, setKey, getKey };
})();
