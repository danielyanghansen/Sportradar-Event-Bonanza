import React, { useEffect, useState } from 'react';
import Image from 'react-bootstrap/Image';

export type MatchListElementProps = {
  matchName: string;
  onClick: () => void;
  coordinates?: [lat: number, lng: number];
  matchObj: any;
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
    const sportsType: string = match.matchObj._sid as string;
    const matchScore: string = !!match.matchObj
      ? match.matchObj.result.home + ' - ' + match.matchObj.result.away
      : 'Loading...';

    /* const sportsName : string = (sportsType in SPORT_ID_DICT)
      ? SPORT_ID_DICT[sportsType as number] as string
      : "unknown sport" as string
    ; */
    const selectionStatus =
      !!highlightedMatch &&
      match.matchObj._id === highlightedMatch.matchObj._id;
    const borderColor: string = selectionStatus ? 'red' : '';
    const borderWidth = selectionStatus ? '5px' : '1px';
    return (
      <button
        onClick={() => {
          match.onClick();
          console.log(match.matchObj);
        }}
        style={{
          width: '100%',
          borderColor: borderColor,
          borderWidth: borderWidth,
          borderRadius: '15px',
          minHeight: '50px',
          marginBottom: '3px',
        }}
      >
        <Image
          src={
            'https://img.sportradar.com/ls/sports/big/' + sportsType + '.png'
          }
          style={{ maxHeight: '50px' }}
        />
        <p>{match.matchName}</p>
        <p style={{fontSize:'2.5em'}}><strong>{matchScore}</strong></p>
        {/*         <p>{match.matchObj.result.home} : {match.matchObj.result.away}</p> */}
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
    <div style={{ maxHeight: '90%', overflowY: 'hidden', padding: '20px'}}>
      {!!matches ? (
        matches.map((m) => (
          <MatchListElement
            matchName={m.matchName}
            onClick={() => {
              setHighlightedMatch(m);
              m.onClick();
            }}
            matchObj={m.matchObj}
            
          />
        ))
      ) : (
        <div>No matches</div>
      )}
    </div>
  );
};

export default MatchList;
