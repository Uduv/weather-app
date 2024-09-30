// packages/frontend/src/App.js
import React from 'react';
import Weather from './Weather';
import Dashboard from './Dashboard';

function App() {
  return (
    <div className="App">
      <Weather />
      <Dashboard />
    </div>
  );
}

export default App;
