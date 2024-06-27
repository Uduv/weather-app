// packages/backend/server.js
import express from 'express';
import cron from 'node-cron';
import { MongoClient, ServerApiVersion } from 'mongodb';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

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

const CITIES = [
  "Tokyo",
  "Delhi",
  "Shanghai",
  "São Paulo",
  "Mexico City",
  "Cairo",
  "Mumbai",
  "Beijing",
  "Dhaka",
  "Osaka",
  "New York",
  "Karachi",
  "Buenos Aires",
  "Istanbul",
  "Chongqing",
  "Kolkata",
  "Lagos",
  "Manila",
  "Rio de Janeiro",
  "Guangzhou",
  "Lahore",
  "Shenzhen",
  "Bangalore",
  "Moscow",
  "Paris",
  "Jakarta",
  "London",
  "Lima",
  "Bangkok",
  "Hyderabad",
  "Tehran",
  "Chicago",
  "Bogotá",
  "Chengdu",
  "Nanjing",
  "Wuhan",
  "Ho Chi Minh City",
  "Luanda",
  "Hong Kong",
  "Ahmedabad",
  "Kuala Lumpur",
  "Hangzhou",
  "Pune",
  "Riyadh",
  "Santiago",
  "Madrid",
  "Baghdad",
  "Toronto",
  "Singapore",
  "Miami",
  "Belo Horizonte",
  "Los Angeles",
  "Boston",
  "Houston",
  "Dallas",
  "Philadelphia",
  "Atlanta",
  "San Francisco",
  "Washington, D.C.",
  "Sydney"
];

async function connectToMongoDB() {
  if (!client.isConnected()) {
    await client.connect();
  }
}

async function fetchWeatherData() {
  try {
    await client.connect(); // Ensure client is connected
    const db = client.db("weatherDB");
    const weatherCollection = db.collection("weathers");

    for (const city of CITIES) {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`);
      const data = await response.json();

      if (data && data.main) {
        const weatherData = {
          city: city,
          temperature: data.main.temp,
          description: data.weather[0].description,
          date: new Date()
        };
        await weatherCollection.insertOne(weatherData);
      } else {
        console.error(`Invalid data received for city: ${city}`, data);
      }
    }
  } catch (error) {
    console.error('Error fetching weather data', error);
  }
}

cron.schedule('0 * * * *', fetchWeatherData); // Runs every hour

app.get('/api/weather/:city', async (req, res) => {
  const city = req.params.city;
  try {
    await client.connect(); // Ensure client is connected
    const db = client.db("weatherDB");
    const weatherCollection = db.collection("weathers");
    const weather = await weatherCollection.find({ city }).sort({ date: -1 }).limit(1).toArray();
    res.json(weather);
  } catch (error) {
    console.error('Error fetching weather data from MongoDB', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

fetchWeatherData(); // Initial call to populate data
