import React, { useEffect, useState } from 'react';
import logo1024 from './logo1024.png';
import './App.css';
import Map from './components/Map';
import { Col, Row, Container } from 'react-bootstrap';
import MatchList, { MatchListElementProps } from './components/MatchList';
/* import { MatchEvent, Match, useReceiveEvents } from './hooks/useReceiveEvents'; */
import {
  MatchStatus,
  useFetchAllRecentEvents,
} from './hooks/useFetchAllRecentEvents';
import { useAsync } from 'react-async';

function MockOnClick() {
  console.log('OnClick triggered');
}

const mockListElements: Array<MatchListElementProps> = [
];

function App() {
  const [sportFilter, setSportFilter] = useState<number | undefined>(1);
  const [data, setData] = useState<Object | undefined>(undefined);

  const [matchStatuses, setMatchStatuses] = useState<MatchStatus[] | undefined>(
    []
  );
  const [matchList, setMatchList] = useState<
    MatchListElementProps[] | undefined
  >(mockListElements);

  const url =
    'https://dev.fn.sportradar.com/common/en/Europe:Oslo/gismo/event_get';

  useEffect(() => {
    const fetchStatuses = async () => {
      const statusesPromise = await fetch(url)
        .then((response: any) => response.json())
        .then((res: any) => {
          const resdata = res.doc[0].resdata.filter((e: any) => {
            if (!!sportFilter) {
              return e.match._sid === sportFilter;
            }
            return false;
          });
          const newMatchStatuses: MatchStatus[] = resdata.map(
            (matchentry: any) => {
              return {
                matchid: matchentry.match._id,
                sportID: matchentry.match._sid,
                t1name: matchentry.match.teams.home.name,
                t2name: matchentry.match.teams.away.name,
                score: [
                  matchentry.match.result.home,
                  matchentry.match.result.away,
                ],
              };
            }
          );
          return newMatchStatuses;
        });
      const statuses = await statusesPromise;
      console.log(statuses);
      setMatchStatuses(statuses);
    };

    fetchStatuses();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const fetchData = async () => {
        // get the data from the api
        const response = await fetch(url);
        // convert the data to json
        const json = await response.json();

        // set state with the result
        setData(json);
        //console.log(json);
      };

      // call the function
      fetchData()
        // make sure to catch any error
        .catch(console.error);
      console.log(data);
    }, 10500); // Randomly click something every x millisecond
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // declare the async data fetching function
    const fetchData = async () => {
      // get the data from the api
      const response = await fetch(url);
      // convert the data to json
      const json = await response.json();

      // set state with the result
      setData(json);
      //console.log(json);
    };

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
    console.log(data);
  }, []);

  useEffect(() => {
    if (!!data) {
      const tempdata = data as any;
      const mockStatuses: MatchListElementProps[] = tempdata.doc[0].data
      .filter((mst: any) => {
        if (!!sportFilter) {
          return mst._sid === sportFilter;
        }
        return false;
      })
      .sort((mst1:any, mst2:any) => {
        return mst1.match.timeinfo.started > mst2.match.timeinfo.started
      })
      .slice(0,10) //only the first 10 elements
      
      .map(
        (mst: any) => {
          return {
            matchName: mst.match.teams.home.name + ' VS ' + mst.match.teams.away.name,
            onClick: MockOnClick,
            coordinates: [mst.match.result.home, mst.match.result.away],
            matchObj: mst.match,
          };
        }
      );
      setMatchList(mockStatuses);
    }
  }, [data]);
  /*   const mockStatuses: MatchListElementProps[] = matchStatuses.map((mst: MatchStatus) => {
    return {
      matchName: mst.t1name + " VS " + mst.t2name,
      onClick: MockOnClick,
      coordinates: mst.score
    };
  }); */

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
                Sportradar Event Bonanza InfoScreen 0.0.2
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
          <MatchList
            matches={
              matchList
            }
          />
        </Col>
        <Col>
          <Map matches={mockListElements} />
        </Col>
      </Row>
    </div>
  );
}

export default App;
