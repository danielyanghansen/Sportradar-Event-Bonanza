import React, { useEffect } from 'react';
import { Match } from '../types';
import MatchListElement from './MatchListElement';
import { flyBetweenPlacesInterval } from '../App';

export type MatchListProps = {
  matches: Array<Match>;
  selectedMatch: Match | undefined;
  onSelect: (index: number) => void;
};

const MatchList = ({ matches, selectedMatch, onSelect }: MatchListProps) => {
  useEffect(() => {
    const interval = setInterval(() => {
      if (matches.length) {
        onSelect(Math.floor(Math.random() * matches.length));
      }
    }, flyBetweenPlacesInterval); // Randomly click something every x millisecond
    return () => clearInterval(interval);
  }, [matches, onSelect]);

  return (
    <div style={{ overflowY: 'hidden', padding: '20px' }}>
      {!!matches ? (
        matches.map((match) => (
          <MatchListElement
            key={match._id}
            match={match}
            isHighlighted={match === selectedMatch}
            onClick={() => {
              onSelect(matches.indexOf(match));
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
