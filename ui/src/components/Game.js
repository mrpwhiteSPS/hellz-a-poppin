import React from 'react';
import { w3cwebsocket as WS } from "websocket";
import {withRouter} from 'react-router-dom';


class Game extends React.Component{
  state = {
    game: {
      _id: undefined,
      gameName: undefined,
      numPlayers : undefined
    }
  }
  GetGameHandler = (data) =>{
    this.setState({game: data})
  }

  actionHandlers = {
    GetGame: this.GetGameHandler
  }
  componentDidMount(){
    console.log("CDM Game")
    const {gameId} = this.props.match.params
    const client = new WS('ws://localhost:8000');
    client.onopen = () => {
      console.log('WebSocket Client Connected');
      const body = {
        action: "GetGame",
        data: {
          gameId
        }
      }
      client.send(JSON.stringify(body))
    };
    client.onmessage = ({data: msgData}) => {
      const {action, data} = JSON.parse(msgData)
      console.log({action})
      this.actionHandlers[action](data)
    };
  }
  render(){
    const {_id, gameName, numPlayers} = this.state.game
    return (
      <div>
        <h1>game - {_id}</h1>
        <h1>game - {gameName}</h1>
        <h1>game - {numPlayers}</h1>
      </div>
    )

  }
}

export default withRouter(Game);
