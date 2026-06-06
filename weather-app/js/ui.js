/* ui.js — DOM rendering, no fetch logic */

const UI = (() => {

  // Elements
  const el = {
    emptyState:  document.getElementById('empty-state'),
    errorMsg:    document.getElementById('error-msg'),
    loader:      document.getElementById('loader'),
    card:        document.getElementById('weather-card'),
    cityName:    document.getElementById('city-name'),
    cityDate:    document.getElementById('city-date'),
    cityDesc:    document.getElementById('city-desc'),
    tempBig:     document.getElementById('temp-big'),
    tempFeels:   document.getElementById('temp-feels'),
    iconWrap:    document.getElementById('weather-icon-wrap'),
    humidity:    document.getElementById('humidity'),
    wind:        document.getElementById('wind'),
    visibility:  document.getElementById('visibility'),
    pressure:    document.getElementById('pressure'),
    sunrise:     document.getElementById('sunrise'),
    sunset:      document.getElementById('sunset'),
    forecastRow: document.getElementById('forecast-row'),
  };

  // Weather code → emoji
  const weatherEmoji = {
    '01': '☀️', '02': '🌤️', '03': '☁️', '04': '☁️',
    '09': '🌧️', '10': '🌦️', '11': '⛈️', '13': '❄️', '50': '🌫️',
  };

  function getEmoji(iconCode) {
    const prefix = iconCode.slice(0, 2);
    const isNight = iconCode.endsWith('n');
    if (prefix === '01' && isNight) return '🌙';
    return weatherEmoji[prefix] || '🌡️';
  }

  function formatTime(unix, offset) {
    const d = new Date((unix + offset) * 1000);
    const h = d.getUTCHours().toString().padStart(2, '0');
    const m = d.getUTCMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  function formatDate() {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
    });
  }

  function unitLabel(units) {
    return units === 'metric' ? '°C' : '°F';
  }

  function windUnit(units) {
    return units === 'metric' ? 'km/h' : 'mph';
  }

  // States
  function showLoader() {
    el.emptyState.classList.add('hidden');
    el.errorMsg.classList.add('hidden');
    el.card.classList.add('hidden');
    el.loader.classList.remove('hidden');
  }

  function showError(msg = 'City not found. Try again.') {
    el.loader.classList.add('hidden');
    el.card.classList.add('hidden');
    el.emptyState.classList.add('hidden');
    el.errorMsg.textContent = msg;
    el.errorMsg.classList.remove('hidden');
  }

  function showEmpty() {
    el.loader.classList.add('hidden');
    el.errorMsg.classList.add('hidden');
    el.card.classList.add('hidden');
    el.emptyState.classList.remove('hidden');
  }

  // Render current weather + forecast
  function renderWeather(current, forecast, units) {
    const u = unitLabel(units);
    const wu = windUnit(units);
    const tz = current.timezone;

    // Hero
    el.cityName.textContent = `${current.name}, ${current.sys.country}`;
    el.cityDate.textContent = formatDate();
    el.cityDesc.textContent = current.weather[0].description;
    el.tempBig.textContent  = `${Math.round(current.main.temp)}${u}`;
    el.tempFeels.textContent = `Feels like ${Math.round(current.main.feels_like)}${u}`;
    el.iconWrap.textContent = getEmoji(current.weather[0].icon);

    // Stats
    el.humidity.textContent   = `${current.main.humidity}%`;
    el.wind.textContent       = `${Math.round(current.wind.speed * (units === 'metric' ? 3.6 : 1))} ${wu}`;
    el.visibility.textContent = `${(current.visibility / 1000).toFixed(1)} km`;
    el.pressure.textContent   = `${current.main.pressure} hPa`;

    // Sun
    el.sunrise.textContent = formatTime(current.sys.sunrise, tz);
    el.sunset.textContent  = formatTime(current.sys.sunset, tz);

    // Forecast — one reading per day (noon slot preferred)
    renderForecast(forecast.list, u);

    // Show card
    el.loader.classList.add('hidden');
    el.errorMsg.classList.add('hidden');
    el.emptyState.classList.add('hidden');
    el.card.classList.remove('hidden');

    // Re-trigger animation
    el.card.style.animation = 'none';
    el.card.offsetHeight; // reflow
    el.card.style.animation = '';
  }

  function renderForecast(list, u) {
    // Group by day, pick ~noon entry
    const days = {};
    list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      const hour = item.dt_txt.split(' ')[1];
      if (!days[date] || hour === '12:00:00') {
        days[date] = item;
      }
    });

    const entries = Object.entries(days).slice(0, 5);
    el.forecastRow.innerHTML = entries.map(([date, item]) => {
      const dayName = new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' });
      const emoji   = getEmoji(item.weather[0].icon);
      const high    = Math.round(item.main.temp_max);
      const low     = Math.round(item.main.temp_min);
      return `
        <div class="forecast-day">
          <span class="forecast-day-name">${dayName}</span>
          <span class="forecast-icon">${emoji}</span>
          <span class="forecast-high">${high}${u}</span>
          <span class="forecast-low">${low}${u}</span>
        </div>
      `;
    }).join('');
  }

  return { showLoader, showError, showEmpty, renderWeather };
})();
