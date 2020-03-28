import React from 'react';
import './App.css';
import CreateGameForm from './home/index.js'
import 'antd/dist/antd.css'

function App(props) {
  return (
    <div className="App">
      <h1>Hell's a Popping</h1>
      <CreateGameForm />
    </div>
  );
}

export default App;
