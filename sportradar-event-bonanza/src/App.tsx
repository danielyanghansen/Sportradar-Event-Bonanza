import React from 'react';
import logo1024 from './logo1024.png'
import './App.css';
import Map from './components/Map';
import {Col, Row, Container} from 'react-bootstrap';
import React, { useState } from "react";
import logo1024 from "./logo1024.png";
import "./App.css";
import Map from "./components/Map";
import SockJsClient from "react-stomp";

const SOCKET_URL = "http://localhost:8069/ws-message";

function App() {
  const [message, setMessage] = useState("ws message");

  let onConnected = () => {
    console.log("Connected");
  };

  let onMessageReceived = (msg) => {
    setMessage(msg.message);
  };

  return (
    <div className='App' style={{ alignContent: "center" }}>
      <a href="/" style={{ textDecoration: "none", color: "black" }}>
      <SockJsClient
        url={SOCKET_URL}
        topics={["/topic/message"]}
        onConnect={onConnected}
        onDisconnect={console.log("Socket disconnected")}
        onMessage={onMessageReceived}
        debug={true}
      >
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
        </SockJsClient>
      </a>
      <Map />
    </div>
  );
}

export default App;
