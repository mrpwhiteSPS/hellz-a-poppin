import React from 'react';
import { w3cwebsocket as WS } from "websocket";
import {withRouter} from 'react-router-dom';
import {ActionHandlers} from '../utils/WebhookMessages.js'
import { 
  Col,
  Row,
  Form,
  Input,
  Button
} from 'antd';

class Game extends React.Component{
  state = {
    clientId: undefined,
    game: {
      id: undefined,
      name: undefined,
      seats : []
    }
  }

  GetGameHandler = ({_id: id, ...game}) => {
    
    this.setState({game: {id, ...game}})
  }

  ClaimSeatHanlder = ({playerName, seatPosition}) => {
    const message = {
      clientId: this.state.clientId,
      action: "ClaimSeat",
      data: {
        gameId: this.state.game.id,
        position: seatPosition,
        playerId: playerName
      }
    }
    this.client.send(JSON.stringify(message))
    this.props.history.push(`/games/${this.state.game.id}/players/${playerName}`);
  }
  
  ClaimedPositionHandler = ({_id: id, ...game}) => {
    this.setState({game: {id, ...game}})
  }

  actionHandlers = {
    ...ActionHandlers,
    GetGame: this.GetGameHandler,
    ClaimedPosition: this.ClaimedPositionHandler
  }
  
  client = new WS('ws://localhost:8000');
  
  componentDidMount(){
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
      const {clientId, action, data} = JSON.parse(msgData)
      if (this.state.clientId === undefined) {
        this.setState(
          {clientId},
          this.actionHandlers[action](data)
        )
        return  
      }
      this.actionHandlers[action](data)
    };
  }
  
  componentWillUnmount = ()=>{
    this.client.close();
  }
  
  render(){
    const {id, name, seats} = this.state.game
    // console.log(this.state.game)
    return (
      <div>
        <h1>ID - {id}</h1>
        <h1>Name - {name}</h1>
        <h1>Seats</h1>
        {seats.reduce( (acc, {position, player_id}) => {
          return player_id === undefined ?
            acc.concat(
              <UnclaimedSeat
                key={position} 
                position={position} 
                onFinish={this.ClaimSeatHanlder}
              />
            ):
            acc.concat(
              <ClaimedSeat
                key={player_id}
                playerId={player_id}
              />
            )
        }, [])}
      </div>
    )

  }
}

function UnclaimedSeat(props){
  let layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 15,
    },
  };
  return (
    <Form
      {...layout}
      name={`claim-seat-${props.position}`} 
      onFinish={props.onFinish}
      initialValues={
        {seatPosition: props.position}
      }
    >
      <Row justify="center">
        <Col span={12}>
          <Form.Item
            label="Name of Player"
            name="playerName"
          >
            <Input/>
          </Form.Item>
        </Col>
        <Col span={3}>
          <Form.Item
            name="seatPosition"
          >
            <Button type="primary" htmlType="submit">
                Claim Seat
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

function ClaimedSeat(props){
  return (
    <Row justify="center">
      <Col span={12}>
        <p>Player ID: {props.playerId}</p>
      </Col>
    </Row>
  );
}

export default withRouter(Game);
