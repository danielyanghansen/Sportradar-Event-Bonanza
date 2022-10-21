import React, { useEffect, useState } from 'react';

export type MatchListElementProps = {
  matchName: string;
  onClick: () => void;
};
export type MatchListProps = {
  matches?: Array<MatchListElementProps>;
};

const MatchList = ({ matches }: MatchListProps) => {
  const [autoHighlightDuration, setAutoHighlightDuratation] = useState(5000); //Here incase we need it later
  const [highlightedMatch, setHighlightedMatch] = useState<
    MatchListElementProps | undefined
  >();
  const MatchListElement = (match: MatchListElementProps) => {
    const selectionStatus =
      !!highlightedMatch && match.matchName === highlightedMatch.matchName;
    const borderColor: string = selectionStatus ? 'red' : '';
    const borderWidth = selectionStatus ? '5px' : '1px';
    return (
      <button
        onClick={match.onClick}
        style={{
          width: '100%',
          borderColor: borderColor,
          borderWidth: borderWidth,
          borderRadius: '15px',
          minHeight: '50px',
        }}
      >
        Match Name: {match.matchName}
      </button>
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!!matches) {
        const item = matches[Math.floor(Math.random() * matches.length)];
        setHighlightedMatch(item);
        item.onClick();
        console.log('Clicking event: ' + item.matchName);
      }
    }, autoHighlightDuration); // Randomly click something every x millisecond
    return () => clearInterval(interval);
  }, [autoHighlightDuration]);

  useEffect(() => {}, [highlightedMatch]); //for blinking and showcasing the selected match

  return (
    <div style={{ maxHeight: '90%', overflowY: 'hidden', padding: '20px' }}>
      {!!matches ? (
        matches.map((m) => (
          <MatchListElement
            matchName={m.matchName}
            onClick={() => {
              setHighlightedMatch(m);
              m.onClick();
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
