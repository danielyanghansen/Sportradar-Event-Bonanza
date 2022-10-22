import React, { useEffect, useState } from 'react';
import logo1024 from './logo1024.png';
import './App.css';
import Map from './components/Map';
import { Col, Row, Container } from 'react-bootstrap';
import MatchList, { MatchListElementProps } from './components/MatchList';
import SockJS from 'sockjs-client';
import { MatchEvent, Match, useReceiveEvents } from './hooks/useReceiveEvents';

function MockOnClick() {
  console.log('OnClick triggered');
}

const mockListElements: Array<MatchListElementProps> = [
  {
    matchName: 'Test1 Test1 Test1 Test1 Test1 Test1 Test1 Test1 ',
    onClick: MockOnClick,
    coordinates: [59.9139, 10.7522],
  },
  {
    matchName: 'Test2',
    onClick: MockOnClick,
    coordinates: [41.405, 2.021],
  },
  {
    matchName: 'Test3',
    onClick: MockOnClick,
    coordinates: [40.41, -3.662],
  },
  {
    matchName: 'Test4',
    onClick: MockOnClick,
    coordinates: [51.43, -0.08],
  },
  {
    matchName: 'Test5',
    onClick: MockOnClick,
    coordinates: [48.827, 2.3],
  },
  {
    matchName: 'Test6',
    onClick: MockOnClick,
    coordinates: [51.046, 3.718],
  },
  {
    matchName: 'Test7',
    onClick: MockOnClick,
    coordinates: [50.905, 6.848],
  },
  {
    matchName: 'Test8',
    onClick: MockOnClick,
    coordinates: [64.9, 14.8],
  },
  {
    matchName: 'Test9',
    onClick: MockOnClick,
    coordinates: [65.9, 15.8],
  },
  {
    matchName: 'Test10',
    onClick: MockOnClick,
    coordinates: [66.9, 16.8],
  },
  {
    matchName: 'Test11',
    onClick: MockOnClick,
    coordinates: [67.9, 17.8],
  },
];

function App() {
  const [endpoint, setEndpoint] = useState(
    'http://192.168.0.87:8069/socket.io'
  );
  const [EndpointText, setEndpointText] = useState(endpoint);
  const [message, setMessage] = useState('ws message');

  //const matchList: Match[] = useReceiveEvents() as Match[];

  useEffect(() => {
    const sock = new SockJS(endpoint);
    sock.onopen = function () {
      console.log('open');
      sock.send('test');
    };

    sock.onmessage = function (e:any) {
      console.log('message', e.data);
      setMessage(e.data);
      sock.close();
    };

    sock.onclose = function () {
      console.log('close');
    };

    return () => {
      sock.close();
    };
  }, [endpoint]);

  useEffect(() => {
    console.log('WS Recv: ' + message);
  }, [message]);

  return (
    <div className="App" style={{ alignContent: 'center' }}>
      {/* text field and button to update endpoint */}
      <input
        type="text"
        value={EndpointText}
        onChange={(e) => setEndpointText(e.target.value)}
        onKeyUp={(e) => {
          if (e.keyCode === 0x0d) setEndpoint(EndpointText);
        }}
      />
      <button onClick={() => setEndpoint(EndpointText)}>Update</button>
      <a href="/" style={{ textDecoration: 'none', color: 'black' }}>
        <Container>
          <p style={{ color: 'white' }}>{endpoint}</p>
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
          <Map matches={mockListElements} />
        </Col>
      </Row>
    </div>
  );
}

export default App;
