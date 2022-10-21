import React, { useEffect, useState } from 'react';
import logo1024 from './logo1024.png';
import './App.css';
import Map from './components/Map';
import { Col, Row, Container } from 'react-bootstrap';

import socketIOClient from "socket.io-client";

function App() {
const [endpoint, setEndpoint] = useState("http://localhost:8069/ws-message");
const [EndpointText, setEndpointText] = useState(endpoint);
const [message, setMessage] = useState('ws message');

  useEffect(() => {
    const socket = socketIOClient(endpoint);
    socket.on("FromAPI", data => {
      setMessage(data);
    });
  }, []);
  
  let onConnected = () => {
    console.log('Connected');
  };

  useEffect(() => {
    console.log(message);
  }, [message]);

  return (
    <div className="App" style={{ alignContent: 'center' }}>
      {/* text field and button to update endpoint */}
      <input type="text" value={EndpointText} onChange={e => setEndpointText(e.target.value)} onKeyUp={e => {if (e.keyCode == 0x0D) setEndpoint(EndpointText)}} />
      <button onClick={() => setEndpoint(EndpointText)}>Update</button>
      <a href="/" style={{ textDecoration: 'none', color: 'black' }}>
        <Container>
          <p>{endpoint}</p>
          <Row>
            <Col md={2}>
              <img src={logo1024} className="App-logo" alt="logo" height={90} />
            </Col>
            <Col>
              <h1 style={{ fontFamily: 'monospace' }}>
                Sportradar Event Bonanza InfoScreen 0.0.1
              </h1>
            </Col>
          </Row>
        </Container>
      </a>
      <Map />
    </div>
  );
}

export default App;
