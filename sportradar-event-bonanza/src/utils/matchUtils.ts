import { EventGetMatch } from '../types';

export const getMatchName = (match: EventGetMatch): string =>
  `${match.teams.home.name} vs ${match.teams.away.name}`;

export const getMatchScore = (match: EventGetMatch): string =>
  `${match.result.home} : ${match.result.away}`;
