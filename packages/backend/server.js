// packages/backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import cron from 'node-cron';
import { MongoClient, ServerApiVersion } from 'mongodb';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 5001;

const uri = "mongodb+srv://uduv:HsgfUaAEXKiuG3Q@atlascluster.qlodsp0.mongodb.net/?appName=AtlasCluster";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
// const CITIES = ["Tokyo"]; // Only fetch weather data for Tokyo
const CITIES = ["Tokyo", "Delhi", "Shanghai", "São Paulo", "Mexico City", "Cairo", "Mumbai", "Beijing", "Dhaka", "Osaka", "New York", "Karachi", "Buenos Aires", "Istanbul", "Chongqing", "Kolkata", "Lagos", "Manila", "Rio de Janeiro", "Guangzhou"];
const API_KEY = "iKMmPupoTWJP0ug3ahz18N0OcDNA35rh";

async function fetchWeatherData() {
  try {
    // Connect the client to the server
    await client.connect();
    const db = client.db("weatherDB");
    const weatherCollection = db.collection("weathers_cities");

    // Fetch weather data for each city
    for (const city of CITIES) {
      const cityUrl = encodeURIComponent(city);
      const response = await fetch(`https://api.tomorrow.io/v4/weather/realtime?location=${cityUrl}&apikey=${API_KEY}`);
      const data = await response.json();
      console.log(data);
      if (data && data.data) {
        const weatherData = {
          city: data.location.name ? data.location.name : 'Unknown City',
          temperature: data.data.values.temperature ? data.data.values.temperature : 'N/A',
          temperatureApparent: data.data.values.temperatureApparent ? data.data.values.temperatureApparent : 'N/A',
          humidity: data.data.values.humidity ? data.data.values.humidity : 'N/A',
          cloudBase: data.data.values.cloudBase ? data.data.values.cloudBase : 'N/A',
          cloudCeiling: data.data.values.cloudCeiling ? data.data.values.cloudCeiling : 'N/A',
          cloudCover: data.data.values.cloudCover ? data.data.values.cloudCover : 'N/A',
          dewPoint: data.data.values.dewPoint ? data.data.values.dewPoint : 'N/A',
          freezingRainIntensity: data.data.values.freezingRainIntensity ? data.data.values.freezingRainIntensity : 'N/A',
          precipitationProbability: data.data.values.precipitationProbability ? data.data.values.precipitationProbability : 'N/A',
          pressureSurfaceLevel: data.data.values.pressureSurfaceLevel ? data.data.values.pressureSurfaceLevel : 'N/A',
          rainIntensity: data.data.values.rainIntensity ? data.data.values.rainIntensity : 'N/A',
          sleetIntensity: data.data.values.sleetIntensity ? data.data.values.sleetIntensity : 'N/A',
          snowIntensity: data.data.values.snowIntensity ? data.data.values.snowIntensity : 'N/A',
          uvHealthConcern: data.data.values.uvHealthConcern ? data.data.values.uvHealthConcern : 'N/A',
          uvIndex: data.data.values.uvIndex ? data.data.values.uvIndex : 'N/A',
          visibility: data.data.values.visibility ? data.data.values.visibility : 'N/A',
          weatherCode: data.data.values.weatherCode ? data.data.values.weatherCode : 'N/A',
          windDirection: data.data.values.windDirection ? data.data.values.windDirection : 'N/A',
          windGust: data.data.values.windGust ? data.data.values.windGust : 'N/A',
          windSpeed: data.data.values.windSpeed ? data.data.values.windSpeed : 'N/A',
          date: new Date(data.data.time) // Convert 'time' to a Date object
        };
        await weatherCollection.insertOne(weatherData);
      } else {
        console.error(`Invalid data received for city: ${city}`, data);
      }
    }
  } catch (error) {
    console.error('Error fetching weather data', error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

// Set up cron job to fetch weather data
cron.schedule('0 * * * *', fetchWeatherData); // Runs every hour

app.get('/api/weather', async (req, res) => {
  try {
    await client.connect();
    const db = client.db("weatherDB");
    const weatherCollection = db.collection("weathers");
    const weather = await weatherCollection.find().sort({ date: -1 }).limit(10).toArray();
    res.json(weather);
  } catch (error) {
    console.error('Error fetching weather data from MongoDB', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

fetchWeatherData(); // Initial call to populate data
