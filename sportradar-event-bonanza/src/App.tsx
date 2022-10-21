import React, { useEffect, useState } from 'react';
import logo1024 from './logo1024.png';
import './App.css';
import Map from './components/Map';
import { Col, Row, Container } from 'react-bootstrap';
import {io} from 'socket.io-client';
import MatchList, { MatchListElementProps } from './components/MatchList';
import SimpleModal from './components/SimpleModal';

import socketIOClient from 'socket.io-client';

function MockOnClick() {
  console.log('OnClick triggered');
}

const mockListElements: Array<MatchListElementProps> = [
  {
    matchName: 'Test1 Test1 Test1 Test1 Test1 Test1 Test1 Test1 ',
    onClick: MockOnClick,
  },
  {
    matchName: 'Test2',
    onClick: MockOnClick,
  },
  {
    matchName: 'Test3',
    onClick: MockOnClick,
  },
  {
    matchName: 'Test4',
    onClick: MockOnClick,
  },
  {
    matchName: 'Test5',
    onClick: MockOnClick,
  },
  {
    matchName: 'Test6',
    onClick: MockOnClick,
  },
  {
    matchName: 'Test7',
    onClick: MockOnClick,
  },
  {
    matchName: 'Test8',
    onClick: MockOnClick,
  },
  {
    matchName: 'Test9',
    onClick: MockOnClick,
  },
  {
    matchName: 'Test10',
    onClick: MockOnClick,
  },
  {
    matchName: 'Test11',
    onClick: MockOnClick,
  },
];

function App() {
  const [endpoint, setEndpoint] = useState('http://192.168.0.87:8069/socket.io');
  const [EndpointText, setEndpointText] = useState(endpoint);
  const [message, setMessage] = useState('ws message');
/*   const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("testing content");
  const [modalCoords, setModalCoords] = useState([1000,100]); */

  let socket = io(endpoint, {transports: ['websocket']});

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
          <MatchList matches={mockListElements} />
        </Col>
        <Col>
          <Map />
        </Col>
      </Row>
{/*         <SimpleModal
          xoffset = {modalCoords[0]}
          yoffset = {modalCoords[1]}
          showModal = {true}
          content = {modalContent}
          /> */}
    </div>
  );
}

export default App;
