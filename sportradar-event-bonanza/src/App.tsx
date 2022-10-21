import React, { useEffect, useState } from 'react';
import logo1024 from './logo1024.png';
import './App.css';
import Map from './components/Map';
import { Col, Row, Container } from 'react-bootstrap';
import {io} from 'socket.io-client';

function App() {
  const [endpoint, setEndpoint] = useState('http://192.168.0.87:8069/socket.io');
  const [EndpointText, setEndpointText] = useState(endpoint);
  const [message, setMessage] = useState('ws message');

  let socket = io(endpoint);

  useEffect(() => {
    socket != null && socket.disconnect();
    socket = io(endpoint);
    socket.on('FromAPI', (data) => {
      setMessage(data);
    });
  }, [endpoint]);

  let onConnected = () => {
    console.log('Connected');
  };

  useEffect(() => {
    console.log(message);
  }, [message]);

  return (
    <div className="App" style={{ alignContent: 'center' }}>
      {/* text field and button to update endpoint */}
      <input
        type="text"
        value={EndpointText}
        onChange={(e) => setEndpointText(e.target.value)}
        onKeyUp={(e) => {
          if (e.keyCode == 0x0d) setEndpoint(EndpointText);
        }}
       
      />
      <button onClick={() => setEndpoint(EndpointText)}>Update</button>
      <a href="/" style={{ textDecoration: 'none', color: 'black' }}>
        <Container>
          <p  style={{ color: 'white' }}>{endpoint}</p>
          <Row>
            <Col md={2}>
              <img src={logo1024} className="App-logo" alt="logo" height={90} />
            </Col>
            <Col>
              <h1 style={{ fontFamily: 'monospace', color: 'white' }}>
                Sportradar Event Bonanza InfoScreen 0.0.1
              </h1>
            </Col>
          </Row>
        </Container>
      </a>

      <Row sm={12}>
        <Col sm={3}>
          <p>
            Her kan du se en oversikt over alle arrangementer som er i gang.
          </p>
        </Col>
        <Col>
          <Map />
        </Col>
      </Row>
    </div>
  );
}

export default App;
