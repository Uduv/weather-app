// packages/frontend/src/Weather.js
import React, { useEffect, useState } from 'react';

const Weather = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const logEvent = (message) => {
      setLogs((prevLogs) => [...prevLogs, { message, timestamp: new Date() }]);
    };

    const fetchWeatherData = async () => {
      logEvent('Fetching weather data...');
      try {
        const response = await fetch('/api/weather');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setWeatherData(data);
        logEvent('Weather data fetched successfully.');
      } catch (error) {
        logEvent(`Error fetching weather data: ${error.message}`);
      }
    };

    fetchWeatherData();
  }, []);

  return (
    // Update the JSX to display the weather data and logs
    <div 
    style={{background: '#21313C', border: 'none', borderRadius: '20px', boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)', width: '95vw', paddingBottom: '50px', marginBottom: '50px'}} 
    >
      <h1 className='Title'>Weather Data</h1>
      <ul>
        {weatherData.map((weather, index) => (
          <li key={index}>
            {weather.city}: {weather.temperature}°C, {weather.description}
          </li>
        ))}
      </ul>
      <h2>Logs</h2>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>
            [{log.timestamp.toLocaleTimeString()}] {log.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Weather;
