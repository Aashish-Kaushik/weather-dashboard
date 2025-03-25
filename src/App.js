// React (Frontend - src/App.js)
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY; // Store API key in .env.local

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const currentWeatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(currentWeatherResponse.data);

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      setForecastData(forecastResponse.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data.');
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  const formatForecast = (forecastList) => {
    const dailyForecast = {};
    forecastList.forEach((item) => {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyForecast[date]) {
        dailyForecast[date] = [];
      }
      dailyForecast[date].push(item);
    });
    return Object.values(dailyForecast).slice(0, 5); // Get only the first 5 days
  };

  return (
    <div className="App">
      <h1>Weather Dashboard</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {weatherData && (
        <div className="weather-info">
          <h2>
            {weatherData.name}, {weatherData.sys.country}
          </h2>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Description: {weatherData.weather[0].description}</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
        </div>
      )}

      {forecastData && (
        <div className="forecast-container">
          <h2>5-Day Forecast</h2>
          {formatForecast(forecastData.list).map((dayForecast, index) => (
            <div key={index} className="forecast-day">
              <h3>{dayForecast[0].dt_txt.split(' ')[0]}</h3>
              <div className="forecast-items">
                {dayForecast.map((item) => (
                  <div key={item.dt} className="forecast-item">
                    <p>{item.dt_txt.split(' ')[1]}</p>
                    <p>{item.main.temp}°C</p>
                    <p>{item.weather[0].description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
