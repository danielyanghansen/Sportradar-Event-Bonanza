import React, { useEffect, useMemo, useState } from 'react';
import logo1024 from './logo1024.png';
import './App.css';
import Map from './components/Map';
import { Col, Row, Container } from 'react-bootstrap';
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
      {/* text field and button to update endpoint */}
      <a href="/" style={{ textDecoration: 'none', color: 'black' }}>
        <Container>
          <Row>
            <Col md={2}>
              <img src={logo1024} className="App-logo" alt="logo" height={90} />
            </Col>
            <Col>
              <h1 style={{ fontFamily: 'monospace', color: 'white' }}>
                Sportradar Event Bonanza InfoScreen 0.0.3
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
          <button onClick={() => console.log(data)}>consolelog</button>
          <MatchList matches={eventGetMatches} />
        </Col>
        <Col>
          <Map matches={matches} />
        </Col>
      </Row>
      <Row sm={12}>
        <Textbar />
      </Row>
    </div>
  );
}

export default App;
