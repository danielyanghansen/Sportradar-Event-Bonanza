import React, { useEffect, useState } from 'react';
import { EventGetMatch } from '../types';
import MatchListElement from './MatchListElement';

export type MatchListProps = {
  matches: Array<EventGetMatch>;
};

const MatchList = ({ matches }: MatchListProps) => {
  const autoHighlightDuration = 5000;
  const [highlightedMatchId, setHighlightedMatchId] = useState<number>();

  useEffect(() => {
    const interval = setInterval(() => {
      if (matches.length) {
        const item = matches[Math.floor(Math.random() * matches.length)];
        setHighlightedMatchId(item._id);
      }
    }, autoHighlightDuration); // Randomly click something every x millisecond
    return () => clearInterval(interval);
  }, [autoHighlightDuration, matches]);

  return (
    <div style={{ maxHeight: '90%', overflowY: 'hidden', padding: '20px' }}>
      {!!matches ? (
        matches.map((match) => (
          <MatchListElement
            key={match._id}
            match={match}
            isHighlighted={match._id === highlightedMatchId}
            onClick={() => {
              setHighlightedMatchId(match._id);
            }}
          />
        ))
      ) : (
        <div>No matches</div>
      )}
    </div>
  );
};

export default MatchList;
