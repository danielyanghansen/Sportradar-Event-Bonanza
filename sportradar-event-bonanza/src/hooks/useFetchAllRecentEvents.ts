import React, { useEffect, useState } from 'react';

export interface MatchStatus {
  matchid: number;
  sportID: number;
  t1name: string;
  t2name: string;
  score: [number, number];
}

export const useFetchAllRecentEvents = (filtersportid: number | undefined) => {
  const [matchStatuses, setMatchStatuses] = useState<MatchStatus[] | undefined>(
    []
  );
  const [isEmpty, setIsEmpty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const url =
    'https://dev.fn.sportradar.com/common/en/Europe:Oslo/gismo/event_get';

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    fetch(url)
      .then((response) => response.json())
      .then((res: any) => {
        const resdata = res.doc[0].resdata.filter((e: any) => {
          if (!!filtersportid) {
            return e.match._sid === filtersportid;
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
        setMatchStatuses(newMatchStatuses);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  });

  return {
    matchStatuses,
    loading,
    error,
  };
};
