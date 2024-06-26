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
const CITIES = ["Tokyo"]; // Only fetch weather data for Tokyo
// const CITIES = ["Tokyo", "Delhi", "Shanghai", "São Paulo", "Mexico City", "Cairo", "Mumbai", "Beijing", "Dhaka", "Osaka", "New York", "Karachi", "Buenos Aires", "Istanbul", "Chongqing", "Kolkata", "Lagos", "Manila", "Rio de Janeiro", "Guangzhou"];
const API_KEY = "iKMmPupoTWJP0ug3ahz18N0OcDNA35rh";

async function fetchWeatherData() {
  try {
    // Connect the client to the server
    await client.connect();
    const db = client.db("weatherDB");
    const weatherCollection = db.collection("weathers");

    // Fetch weather data for each city
    for (const city of CITIES) {
      const cityUrl = encodeURIComponent(city);
      const response = await fetch(`https://api.tomorrow.io/v4/weather/realtime?location=${cityUrl}&apikey=${API_KEY}`);
      const data = await response.json();

      if (data && data.data) {
        const weatherData = {
          city: city,
          temperature: data.data.temperature ? data.data.temperature.value : 'N/A',
          description: data.data.weather_code ? data.data.weather_code.value : 'N/A',
          date: new Date()
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
