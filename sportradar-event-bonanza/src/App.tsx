import React, { useState } from 'react';
import img from './img.png';
import './App.css';
import Map from './components/Map';
import Image from 'react-bootstrap/Image';

import MatchList from './components/MatchList';
/* import { MatchEvent, Match, useReceiveEvents } from './hooks/useReceiveEvents'; */
import { Sport } from './types';
import SportSelectDropdown from './components/SportSelectDropdown';
import Textbar from './components/Textbar';
import useMatches from './hooks/useMatches';

function App() {
  const [sportFilter, setSportFilter] = useState<number | undefined>(
    Sport.Football
  );

  const matches = useMatches({ sportFilter });

  return (
    <div className="App" style={{ alignContent: 'center' }}>
      <div className="map_layer">
        <Map matches={matches} />
      </div>
      <div className="overlay_layer">
        <div className="app_title">
          <a
            href="/"
            style={{
              textDecoration: 'none',
              color: 'black',
            }}
          >
            <h1
              style={{
                fontSize: '3em',
                fontFamily: 'monospace',
                color: 'white',
              }}
            >
              <img src={img} alt="logo" height={60} /> Event Bonanza InfoScreen
              0.0.4
            </h1>
          </a>
        </div>
        <div className="match_list">
          <SportSelectDropdown
            sportIdList={[1, 2, 3, 4, 5, 6, 7]}
            onClick={(filterId: number) => {
              setSportFilter(filterId);
            }}
          />
          <Image
            src={
              'https://img.sportradar.com/ls/sports/big/' +
              (!!sportFilter ? sportFilter : 1).toString() +
              '.png'
            }
            style={{ maxHeight: '40px' }}
          />
          <MatchList matches={matches} />
        </div>
        <div className="text_bar">
          <Textbar matches={matches} />
        </div>
      </div>
    </div>
  );
}

export default App;
