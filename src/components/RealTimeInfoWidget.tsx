'use client'

import React, { useState, useEffect } from 'react';
import { Cloud, Clock, Wind } from 'lucide-react';

interface WeatherData {
  temperature: string;
  condition: string;
}

interface AirQualityData {
  aqi: number;
  dominentpol: string;
}

const BremenInfoWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('https://wttr.in/Bremen?format=j1');
        const data = await response.json();
        setWeather({
          temperature: data.current_condition[0].temp_C,
          condition: data.current_condition[0].weatherDesc[0].value,
        });
      } catch (err) {
        setError('Failed to fetch weather data');
      }
    };

    const fetchAirQuality = async () => {
      try {
        const response = await fetch('https://api.waqi.info/feed/bremen/?token=demo');
        const data = await response.json();
        setAirQuality({
          aqi: data.data.aqi,
          dominentpol: data.data.dominentpol,
        });
      } catch (err) {
        setError('Failed to fetch air quality data');
      }
    };

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Europe/Berlin'
      }));
    };

    fetchWeather();
    fetchAirQuality();
    updateTime();

    const weatherInterval = setInterval(fetchWeather, 600000); // Update weather every 10 minutes
    const timeInterval = setInterval(updateTime, 1000); // Update time every second
    const airQualityInterval = setInterval(fetchAirQuality, 600000); // Update air quality every 10 minutes

    return () => {
      clearInterval(weatherInterval);
      clearInterval(timeInterval);
      clearInterval(airQualityInterval);
    };
  }, []);

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-teal-400 dark:from-blue-700 dark:to-teal-600 p-6 rounded-xl shadow-lg text-white flex flex-col justify-between md:col-span-2 lg:col-span-2 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4">Bremen, Germany</h2>
      
      <div className="flex flex-col space-y-4">
        <div className="flex items-center bg-white bg-opacity-20 p-3 rounded-lg">
          <Clock className="w-6 h-6 mr-3" />
          <span className="text-lg sm:text-xl font-semibold">
            {currentTime || 'Loading...'}
          </span>
        </div>
        
        {weather && (
          <div className="flex items-center bg-white bg-opacity-20 p-3 rounded-lg">
            <Cloud className="w-6 h-6 mr-3" />
            <span className="text-lg sm:text-xl font-semibold">
              {weather.temperature}°C, {weather.condition}
            </span>
          </div>
        )}
        
        {airQuality && (
          <div className="flex flex-col items-start bg-white bg-opacity-20 p-3 rounded-lg">
            <div className="flex items-center mb-2">
              <Wind className="w-6 h-6 mr-3" />
              <span className="text-lg font-semibold">Air Quality</span>
            </div>
            <p className="text-base">AQI: {airQuality.aqi}</p>
            <p className="text-base">Main Pollutant: {airQuality.dominentpol}</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-xs text-white text-opacity-70">
        Data updates every 10 minutes
      </div>
    </div>
  );
};

export default BremenInfoWidget;