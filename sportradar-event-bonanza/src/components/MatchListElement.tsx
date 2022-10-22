import { EventGetMatch } from '../types';
import Image from 'react-bootstrap/Image';
import React from 'react';
import { getMatchScore, getMatchName } from '../utils/matchUtils';

interface Props {
  match: EventGetMatch;
  isHighlighted: boolean;
  onClick: () => void;
}

const MatchListElement = ({ match, isHighlighted, onClick }: Props) => {
  const sportsType = match._sid;

  /* const sportsName : string = (sportsType in SPORT_ID_DICT)
    ? SPORT_ID_DICT[sportsType as number] as string
    : "unknown sport" as string
  ; */
  const borderColor: string = isHighlighted ? 'red' : '';
  const borderWidth = isHighlighted ? '5px' : '1px';
  return (
    <button
      onClick={onClick}
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
        src={'https://img.sportradar.com/ls/sports/big/' + sportsType + '.png'}
        style={{ maxHeight: '50px' }}
      />
      <p>{getMatchName(match)}</p>
      <p style={{ fontSize: '2.5em' }}>
        <strong>{getMatchScore(match)}</strong>
      </p>
      {/*         <p>{match.matchObj.result.home} : {match.matchObj.result.away}</p> */}
    </button>
  );
};

export default MatchListElement;
