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
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'https://wttr.in/Bremen?format=j1'
        );
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

    fetchWeather();
    fetchAirQuality();

    const weatherInterval = setInterval(fetchWeather, 600000); // Update weather every 10 minutes

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
      fetchAirQuality();
    }, 1000); // Update time every second

    return () => {
      clearInterval(weatherInterval);
      clearInterval(timeInterval);
    };
  }, []);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Europe/Berlin'
    });
  };

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-teal-400 p-4 rounded-lg shadow-lg text-white flex flex-col justify-between md:col-span-2 lg:col-span-2">
      <h2 className="text-xl sm:text-2xl font-bold mb-2">Bremen, Germany</h2>

      <div className="flex flex-col space-y-2">

        <div className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          <span className="text-base sm:text-lg">
            {formatTime(currentTime)}
          </span>
        </div>

        {weather && (
          <div className="flex items-center">
            <Cloud className="w-5 h-5 mr-2" />
            <span className="text-base sm:text-lg">
              {weather.temperature}°C, {weather.condition}
            </span>
          </div>
        )}

        {airQuality && (
          <div className="flex flex-col items-center justify-center bg-white bg-opacity-20 p-3 rounded-lg">
            <Wind className="w-8 h-8 mb-2" />
            <p className="text-sm font-semibold">Bremen Air Quality</p>
            <p className="text-xs">AQI: {airQuality.aqi}</p>
            <p className="text-xs">Main Pollutant: {airQuality.dominentpol}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BremenInfoWidget;