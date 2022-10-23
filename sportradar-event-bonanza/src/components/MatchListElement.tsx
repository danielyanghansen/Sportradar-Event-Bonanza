import { EventGetMatch } from '../types';
import Image from 'react-bootstrap/Image';
import React from 'react';
import {
  getMatchScore,
  getMatchScores,
  getMatchName,
} from '../utils/matchUtils';

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
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p style={{ width: '50%', textAlign: 'left', fontWeight: '600' }}>
          {getMatchName(match)[0]}
        </p>
        <p>vs</p>
        <p style={{ width: '50%', textAlign: 'right', fontWeight: '600' }}>
          {getMatchName(match)[1]}
        </p>
      </div>
      <p style={{ fontSize: '2.5em' }}>
        <strong>{getMatchScores(match)[0]}</strong> -{' '}
        <strong>{getMatchScores(match)[1]}</strong>
      </p>
      {/*         <p>{match.matchObj.result.home} : {match.matchObj.result.away}</p> */}
    </button>
  );
};

export default MatchListElement;
