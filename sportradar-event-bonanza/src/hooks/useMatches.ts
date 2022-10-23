import { Match } from '../types';
import useFetchEventGetAPI from './useFetchEventGetAPI';
import { useMemo } from 'react';
import useFetchMatchCoordinates from './useFetchMatchCoordinates';

interface Options {
  sportFilter?: number;
}

const useMatches = ({ sportFilter }: Options): Match[] => {
  const eventGetMatches = useFetchEventGetAPI({ limit: 10, sportFilter });
  const matchCoordinates = useFetchMatchCoordinates(
    eventGetMatches.map((match) => match._id)
  );

  return useMemo(() => {
    const matches: Match[] = [];

    for (const eventGetMatch of eventGetMatches) {
      const coords =
        matchCoordinates[eventGetMatch._id]?.doc[0].data.coordinates;
      if (coords) {
        matches.push({
          ...eventGetMatch,
          coordinates: coords.split(',').map(Number) as [number, number],
          location: matchCoordinates[eventGetMatch._id]?.doc[0].data.location,
        });
      }
    }

    return matches;
  }, [eventGetMatches, matchCoordinates]);
};

export default useMatches;
