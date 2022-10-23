import { useEffect, useState } from 'react';
import { EventGetMatch, EventGetResponse, Sport } from '../types';
import useSWR from 'swr';

const url =
  'https://dev.fn.sportradar.com/common/en/Europe:Oslo/gismo/event_get';

interface Options {
  sportFilter?: number;
  limit?: number;
}

const useFetchEventGetAPI = ({
  sportFilter = Sport.Football,
  limit = 10,
}: Options) => {
  const [eventGetMatches, setEventGetMatches] = useState<EventGetMatch[]>([]);

  const { data, error } = useSWR<EventGetResponse>(
    url,
    (url) => fetch(url).then((r) => r.json()),
    { refreshInterval: 10000 }
  );

  useEffect(() => {
    if (!data) return;

    let fetched: EventGetMatch[] = data.doc[0].data.map((event) => event.match);

    fetched = [...fetched, ...eventGetMatches];

    setEventGetMatches(
      fetched
        .filter((match) => {
          if (!!sportFilter) {
            return match._sid === sportFilter;
          }
          return false;
        })
        .filter(
          (match, index) => fetched.find((m) => m._id === match._id) === match
        )
        .sort((match1, match2) => {
          return (
            Number(match1.timeinfo.started) - Number(match2.timeinfo.started)
          );
        })
        .slice(0, limit)
    );
    //only the first 10 elements
  }, [data, sportFilter]);

  return eventGetMatches;
};

export default useFetchEventGetAPI;
