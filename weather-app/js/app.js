/* app.js — entry point, event wiring */

const App = (() => {
  let units     = localStorage.getItem('units') || 'metric';
  let lastCity  = localStorage.getItem('last_city') || '';

  const searchInput = document.getElementById('search-input');
  const searchBtn   = document.getElementById('search-btn');
  const unitToggle  = document.getElementById('unit-toggle');

  // Fetch both endpoints then render
  async function load(city) {
    if (!city.trim()) return;
    UI.showLoader();
    try {
      const [current, forecast] = await Promise.all([
        API.getCurrentWeather(city, units),
        API.getForecast(city, units),
      ]);
      UI.renderWeather(current, forecast, units);
      lastCity = city;
      localStorage.setItem('last_city', city);
    } catch (err) {
      // 401 = bad key, 404 = city not found
      if (err.message.includes('401')) {
        UI.showError('Invalid API key. Check config.js.');
      } else {
        UI.showError('City not found. Try again.');
      }
    }
  }

  // Toggle °C / °F
  function toggleUnits() {
    units = units === 'metric' ? 'imperial' : 'metric';
    localStorage.setItem('units', units);
    if (lastCity) load(lastCity);
  }

  // Init
  function init() {
    searchBtn.addEventListener('click', () => load(searchInput.value));
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') load(searchInput.value);
    });
    unitToggle.addEventListener('click', toggleUnits);

    if (lastCity) {
      searchInput.value = lastCity;
      load(lastCity);
    } else {
      UI.showEmpty();
    }
  }

  return { init };
})();

App.init();
