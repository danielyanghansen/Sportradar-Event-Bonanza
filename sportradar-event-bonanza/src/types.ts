export interface EventGetResponse {
  queryUrl: string;
  doc: [EventGetDoc];
}

interface EventGetDoc {
  data: EventGetEvent[];
  event: 'event_get';
}

export interface EventGetEvent {
  _id: number;
  _sid: Sport;
  match: EventGetMatch;
}

export interface EventGetMatch {
  _id: number;
  _sid: Sport;
  teams: {
    away: Team;
    home: Team;
  };
  timeinfo: {
    started: string;
    running: boolean;
    played: string;
    remaining: string;
  };
  result: {
    home: number;
    away: number;
  };
}

export interface Match extends EventGetMatch {
  coordinates: [lat: number, lng: number];
  location?: string;
}

interface Team {
  abbr: string;
  name: string;
  mediumname: string;
}

export enum Sport {
  Football = 1,
}

export interface MatchCoordinatesResponse {
  queryUrl: string;
  doc: [
    {
      event: 'match_coordinates';
      _dob: number;
      _maxage: number;
      data: {
        coordinates?: string;
        location?: string;
      };
    }
  ];
}
