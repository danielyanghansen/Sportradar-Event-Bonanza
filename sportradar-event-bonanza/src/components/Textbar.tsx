import React from 'react';
import './Textbar.css';
import { EventGetMatch, Match } from '../types';
import {
  getMatchScore,
  getMatchScores,
  getMatchName,
} from '../utils/matchUtils';

interface Props {
  matches: Array<Match>;
}

let displayString: string = '';
let i = 0;

function Textbar({ matches }: Props) {
  // matches.slice(-1).forEach((match) => (
  //     // displayString = displayString.concat(getMatchName(match)[0] + " " + getMatchScores(match)[0] + " - " + getMatchScores(match)[1] + " " + getMatchName(match)[1])
  //     // console.log("Alfa: " + getMatchName(match)[0] + " " + getMatchScores(match)[0] + " " + getMatchScores(match)[1])
  // ))
  if (i === 4) {
    displayString = '';
    i = 0;
  }
  i++;
  const oneMatch = matches.pop();
  oneMatch &&
    (displayString = displayString.concat(
      ' ' +
        getMatchName(oneMatch)[0] +
        ' ' +
        getMatchScores(oneMatch)[0] +
        ' - ' +
        getMatchScores(oneMatch)[1] +
        ' ' +
        getMatchName(oneMatch)[1] +
        '  '
    ));

  console.log('DisplayString: ' + displayString);

  return <p className="txtbar">{displayString}</p>;
}

export default Textbar;
