import React from 'react';
import './App.css';
import Home from './components/Home.js'
import Game from './components/Game.js'
import Games from './components/Games.js'
import 'antd/dist/antd.css'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App(props) {
  return (
    <Router>
      <div className="App">
        <h1>Hell's a Popping</h1>
      </div>
        <Switch>
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
