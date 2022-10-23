import { EventGetMatch } from '../types';

export const getMatchName = (match: EventGetMatch): [string, string] =>
  [match.teams.home.name, match.teams.away.name];

export const getMatchScore = (match: EventGetMatch): string =>
  `${match.result.home} : ${match.result.away}`;

export const getMatchScores = (match: EventGetMatch): [number, number] => 
[match.result.home, match.result.away];
