import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export interface MatchEvent {
  id: number;
  type: number;
  startTime: number;
  side: string;
  mtime: string;
  info: string;
  matchscore: [number, number];
}

/**
 * For score and general indexing: Home as index 0 (or t1 team 1), away as index 1 (t2)
 */
export interface Match {
  matchID: number;
  active: boolean;
  sportID: number;
  startTime: number;
  currentScore: [number, number];
  coordinates: [number | undefined, number | undefined];
  //Team 1
  t1name: string;
  t1namenatural: string;
  t1id: number;
  t1abbr: string;
  //Team 2
  t2name: string;
  t2namenatural: string;
  t2id: number;
  t2abbr: string;
  //EventStream
  events: MatchEvent[];
}

export type MessageAction =
  | 'MATCH_START'
  | 'MATCH_END'
  | 'EVENT_REGISTER'
  | 'EVENT_REMOVE';

export const useReceiveEvents = (wsendpoint = 'localhost:8069/socket.io') => {
  const [endpoint, setEndpoint] = useState(wsendpoint);
  const [EndpointText, setEndpointText] = useState(endpoint);
  const [message, setMessage] = useState('ws message');
  const [matches, setMatches] = useState<Match[] | undefined>([]);

  let socket = io(endpoint, { transports: ['websocket'] });

  useEffect(() => {
    socket != null && socket.disconnect();
    socket = io(endpoint);
    socket.on('FromAPI', (data) => {
      setMessage(data);
    });
  }, [endpoint]);

  useEffect(() => {
    console.log('WS Recv: ' + message);
    const messageJson = JSON.parse(message);
    const messageAction: string = messageJson.messageAction as string;
    var newMatchList = matches as Match[];
    const matchIndex: number | undefined = newMatchList.findIndex(
      (match: Match) => {
        return match.matchID === messageJson.matchid;
      }
    );

    switch (messageAction) {
      case 'MATCH_START':
        const newMatch: Match = messageJson.map((matchjson: any) => {
          return {
            matchID: matchjson.matchid,
            active: true,
            sportID: matchjson.sportid,
            startTime: matchjson.stime,
            currentScore: [0, 0],
            coordinates: [undefined, undefined], //get from API
            //Team 1
            t1name: matchjson.t1name,
            t1namenatural: matchjson.t1namenatural,
            t1id: matchjson.t1id,
            t1abbr: matchjson.t1abbr,
            //Team 2
            t2name: matchjson.t2name,
            t2namenatural: matchjson.t2namenatural,
            t2id: matchjson.t2id,
            t2abbr: matchjson.t2abbr,
            //EventStream
            events: [
              {
                id: matchjson.id * 10, //"Leftshift" in terms of base10,
                type: 0,
                startTime: matchjson.stime,
                side: 'none',
                mtime: '00:00',
                info: 'Match Start',
                matchscore: [0, 0],
              },
            ],
          };
        });
        newMatchList.push(newMatch);
        break;
      case 'MATCH_END':
        if (!!matchIndex) {
          newMatchList[matchIndex].active = false;
        }
        break;
      case 'EVENT_REGISTER':
        const newEvent: MatchEvent = messageJson.map((eventjson: any) => {
          return {
            id: eventjson.id,
            type: eventjson.type,
            startTime: eventjson.stime,
            side: eventjson.side,
            mtime: eventjson.mtime,
            info: eventjson.info,
            matchscore: eventjson.matchscore,
          };
        });
        if (!!matchIndex) {
          newMatchList[matchIndex].events.push(newEvent as MatchEvent);
        }
        break;
      case 'EVENT_REMOVE':
        if (!!matchIndex) {
          const indexForRemoval = newMatchList[matchIndex].events.findIndex(
            (event: MatchEvent) => {
              return event.id === messageJson.id;
            }
          );
          if (!!indexForRemoval) {
            newMatchList[matchIndex].events.splice(indexForRemoval, 1);
          }
        }
        break;
    }
    setMatches(newMatchList);
  }, [message]);

  return matches;
};
