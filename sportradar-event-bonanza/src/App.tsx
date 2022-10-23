import React, { useEffect, useMemo, useState } from 'react';
import img from './img.png';
import './App.css';
import Map from './components/Map';
import MatchList from './components/MatchList';
/* import { MatchEvent, Match, useReceiveEvents } from './hooks/useReceiveEvents'; */
import {
  EventGetResponse,
  EventGetMatch,
  Sport,
  MatchCoordinatesResponse,
  Match,
} from './types';
import useSWR from 'swr';
import Textbar from './components/Textbar';

function mockOnClick() {
  console.log('OnClick triggered');
}

function App() {
  const [sportFilter, setSportFilter] = useState<number | undefined>(
    Sport.Football
  );

  const url =
    'https://dev.fn.sportradar.com/common/en/Europe:Oslo/gismo/event_get';

  const coordsUrl = (matchId: number | string) =>
    `https://dev.fn.sportradar.com/common/en/Europe:Berlin/gismo/match_coordinates/${matchId}`;

  const { data, error } = useSWR<EventGetResponse>(
    url,
    (url) => fetch(url).then((r) => r.json()),
    { refreshInterval: 10000 }
  );

  const [eventGetMatches, setEventGetMatches] = useState<EventGetMatch[]>([]);
  const [matchCoordinates, setMatchCoordinates] = useState<
    Record<number, MatchCoordinatesResponse>
  >([]);

  useEffect(() => {
    if (!data) return;

    let fetched: EventGetMatch[] = data.doc[0].data
      .filter((event) => {
        if (!!sportFilter) {
          return event._sid === sportFilter;
        }
        return false;
      })
      .map((event) => event.match);

    fetched = [...fetched, ...eventGetMatches];

    setEventGetMatches(
      fetched
        .filter(
          (match, index) => fetched.find((m) => m._id === match._id) === match
        )
        .sort((match1, match2) => {
          return (
            Number(match1.timeinfo.started) - Number(match2.timeinfo.started)
          );
        })
        .slice(0, 10)
    );
    //only the first 10 elements
  }, [data, sportFilter]);

  useEffect(() => {
    const matchCoordinatePromises: Promise<
      [number, MatchCoordinatesResponse]
    >[] = eventGetMatches.map((match) => {
      return !!matchCoordinates[match._id]
        ? new Promise((res) => res([match._id, matchCoordinates[match._id]]))
        : fetch(coordsUrl(match._id))
            .then((r) => r.json())
            .then((r) => [match._id, r]);
    });

    Promise.all(matchCoordinatePromises).then((values) => {
      setMatchCoordinates(
        values.reduce(
          (acc, [id, match]) => ({ ...acc, [id]: match }),
          matchCoordinates
        )
      );
    });
  }, [eventGetMatches]);

  const matches = useMemo(() => {
    const matches: Match[] = [];

    for (const eventGetMatch of eventGetMatches) {
      const coords =
        matchCoordinates[eventGetMatch._id]?.doc[0].data.coordinates;
      if (coords) {
        matches.push({
          ...eventGetMatch,
          coordinates: coords.split(',').map(Number) as [number, number],
          onClick: mockOnClick,
        });
      }
    }

    return matches;
  }, [eventGetMatches, matchCoordinates]);

  return (
    <div className="App" style={{ alignContent: 'center' }}>
      <div className="map_layer">
        <Map matches={matches} />
      </div>
      <div className="overlay_layer">
        <a href="/" style={{ textDecoration: 'none', color: 'black' }}>
          <h1
            style={{
              fontSize: '3em',
              fontFamily: 'monospace',
              color: 'white',
            }}
          >
            <img src={img} alt="logo" height={60} /> Event Bonanza InfoScreen
            0.0.3
          </h1>
        </a>

        <div className="match_list">
          <MatchList matches={eventGetMatches} />
        </div>

        <div className="text_bar">
          <Textbar />
        </div>
      </div>
    </div>
  );
}

export default App;
