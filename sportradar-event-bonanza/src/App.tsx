import React from 'react';
import logo1024 from './logo1024.png'
import './App.css';
import Map from './components/Map';

function App() {
  return (
    <div className='App' style={{ alignContent: "center" }}>
      <a href="/" style={{ textDecoration: "none", color: "black" }}>
        <h1 style={{ fontFamily: "monospace" }}>
          Sportradar Event Bonanza InfoScreen 0.0.1
        </h1>
      </a>
      <img src={logo1024} className="App-logo" alt="logo" />
      <Map />
    </div>
  );
}

export default App;
