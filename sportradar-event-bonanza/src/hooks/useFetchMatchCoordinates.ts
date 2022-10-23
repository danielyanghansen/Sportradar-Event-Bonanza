import { useEffect, useState } from 'react';
import { MatchCoordinatesResponse } from '../types';

const coordsUrl = (matchId: number | string) =>
  `https://dev.fn.sportradar.com/common/en/Europe:Berlin/gismo/match_coordinates/${matchId}`;

const useFetchMatchCoordinates = (
  matchIds: number[]
): Record<number, MatchCoordinatesResponse> => {
  const [matchCoordinates, setMatchCoordinates] = useState<
    Record<number, MatchCoordinatesResponse>
  >([]);

  useEffect(() => {
    const matchCoordinatePromises: Promise<
      [number, MatchCoordinatesResponse]
    >[] = matchIds.map((id) => {
      return !!matchCoordinates[id]
        ? new Promise((res) => res([id, matchCoordinates[id]]))
        : fetch(coordsUrl(id))
            .then((r) => r.json())
            .then((r) => [id, r]);
    });

    Promise.all(matchCoordinatePromises).then((values) => {
      setMatchCoordinates(
        values.reduce(
          (acc, [id, match]) => ({ ...acc, [id]: match }),
          matchCoordinates
        )
      );
    });
  }, [...matchIds]);

  return matchCoordinates;
};

export default useFetchMatchCoordinates;
