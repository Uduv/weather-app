# Weather App with React and Node.js

This project is a simple weather application that fetches weather data for multiple cities using a weather API, stores the data in a MongoDB database, and displays it on a React frontend. The application also logs events, such as successful data fetches and errors, and displays these logs on the main page.

## Project Structure

The project is organized as a monorepo with separate packages for the backend and frontend:

```
weather-app/
├── packages/
│   ├── backend/
│   └── frontend/
├── .gitignore
├── package.json
└── README.md
```

## Backend

The backend is built with Node.js, Express, MongoDB, and Cron. It fetches weather data every hour using a cron job, stores the data in a MongoDB database, and provides an API endpoint to retrieve the weather data.

### Setup

1. **Install Dependencies:**
   Navigate to the `packages/backend` directory and install the dependencies:
   ```sh
   cd packages/backend
   npm install
   ```

2. **Environment Variables:**
   Ensure you have a `.env` file in the `packages/backend` directory with the following content:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@atlascluster.qlodsp0.mongodb.net/?appName=AtlasCluster
   API_KEY=<your_tomorrow_io_api_key>
   ```

3. **Start the Backend:**
   Start the backend server:
   ```sh
   npm run start:backend
   ```

### API Endpoints

- **GET /api/weather:** Fetches the latest weather data from the MongoDB database.

### Weather Data Fetching

The `fetchWeatherData` function fetches weather data for a predefined list of cities from the Tomorrow.io API and stores it in the MongoDB database. The data includes the city name, temperature, and weather description.

### Cron Job

A cron job is set up to fetch weather data every hour and store it in the MongoDB database.

## Frontend

The frontend is built with React and fetches the weather data from the backend API to display it on the main page. It also logs events related to data fetching and displays these logs.

### Setup

1. **Install Dependencies:**
   Navigate to the `packages/frontend` directory and install the dependencies:
   ```sh
   cd packages/frontend
   npm install
   ```

2. **Start the Frontend:**
   Start the frontend development server:
   ```sh
   npm run start:frontend
   ```

### Components

- **Weather:** Fetches weather data from the backend API and displays it along with logs of the events.

### Displayed Information

The main page displays the following:
- **Weather Data:** A list of cities with their respective temperatures and weather descriptions.
- **Logs:** A list of log entries that record events such as successful data fetches and errors.

## Running the Project

To run the project, follow these steps:

1. **Install Monorepo Dependencies:**
   From the root directory, install all dependencies for both frontend and backend:
   ```sh
   npm install
   ```

2. **Start the Backend and Frontend:**
   From the root directory, start both servers:
   ```sh
   npm start
   ```

## Conclusion

This project demonstrates how to build a full-stack weather application with React, Node.js, MongoDB, and Cron. It includes setting up a cron job to fetch data periodically, storing data in a database, and creating a frontend to display the data and logs.

