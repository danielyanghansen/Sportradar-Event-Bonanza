import React from 'react';
import logo1024 from './logo1024.png'
import './App.css';
import Map from './components/Map';
import {Col, Row, Container} from 'react-bootstrap';

function App() {
  return (
    <div className='App' style={{ alignContent: "center" }}>
      <a href="/" style={{ textDecoration: "none", color: "black" }}>
        <Container >
          <Row>
          <Col md={2}>
        <img src={logo1024} alt="logo" height={90} />
        </Col>
        <Col>
        <h1 style={{ fontFamily: "monospace" }} >
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
