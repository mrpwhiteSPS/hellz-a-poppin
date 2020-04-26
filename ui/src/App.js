import React from 'react';
import './App.css';
import Home from './components/Home.js'
import Game from './components/Game.js'
import Games from './components/Games.js'
import Player from './components/Player.js'
import 'antd/dist/antd.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App(props) {
  return (
    <Router>
      <div className="App">
        <Link to="/"><h1>Hellz a Popping</h1></Link>
      </div>
        <Switch>
        <Route path="/games/:gameId/players/:playerId">
          <Player />
        </Route>
        <Route path="/games/:gameId">
          <Game />
        </Route>
        <Route path="/games">
          <Games />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
