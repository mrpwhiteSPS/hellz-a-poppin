import React from 'react';
import {
  useParams
} from "react-router-dom";
function Game (){
  let {gameId} = useParams();
  return (
    <h1>game - {gameId}</h1>
  )
}

export default Game;
