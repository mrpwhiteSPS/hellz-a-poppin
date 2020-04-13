import React from 'react';
import {withRouter} from 'react-router-dom';
import { w3cwebsocket as WS } from "websocket";
import {ActionHandlers} from '../utils/WebhookMessages.js';
import {Button} from 'antd';
// Displays:
// Player's name
// Hand

class Player extends React.Component{
  state = {
    clientId: undefined,
    gameId: undefined,
    data: {
    }
  }
  client = new WS('ws://localhost:8000');

  GetGameHandler = ({_id: id, ...game}) => {
    
    this.setState({game: {id, ...game}})
  }
  // ClaimedPosition = (data) => {
  //   console.log("ClaimedPosition", {data})
  // }

  actionHandlers = {
    ...ActionHandlers,
    GetGame: this.GetGameHandler
    // ClaimedPosition: this.ClaimedPosition
  }
  componentDidMount = () => {
    const {gameId} = this.props.match.params
    this.client.onopen = () => {
      const body = {
        action: "GetGame",
        data: {
          gameId
        }
      }
      this.client.send(JSON.stringify(body))
    };
    this.client.onmessage = ({data: msgData}) => {
      const {clientId, gameId, action, data} = JSON.parse(msgData)
      if (this.state.clientId === undefined) {
        this.setState(
          {
            clientId,
            gameId,
            data
          },
          this.actionHandlers[action](data)
        )
        return  
      }

      this.actionHandlers[action](data)
    };
  }

  handleStartGame = () => {
    const {playerId} = this.props.match.params
    const message = {
      clientId: this.state.clientId,
      action: "StartGame",
      data: {
        gameId: this.state.gameId,
        playerId
      }
    }
    this.client.send(JSON.stringify(message))
  }

  componentWillUnmount = ()=>{
    this.client.close();
  }
  
  render = () =>{
    const {playerId} = this.props.match.params
    const Game = this.state.data.rounds === undefined ?
          <Button onClick={this.handleStartGame}>Start Game </Button>
          :
          <h1>GAME STARTED!!!</h1>;
    return (
      <div>
        <p>{playerId}</p>
        {Game}
      </div>
    )
  }
}

export default withRouter(Player)