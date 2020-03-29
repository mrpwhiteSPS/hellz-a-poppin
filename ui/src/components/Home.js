import React from 'react';
import { 
  Button, 
  Input,
  Form,
  Select
} from 'antd';
import {withRouter} from 'react-router-dom'
import Axios from 'axios';
const { Option } = Select

class Home extends React.Component {
  numPlayerData = [3, 4, 5, 6, 7, 8, 9, 10]
  state = {
    numPlayers: 3
  }
  layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 8,
    },
  };

  onFinish = async(game) => {
    try {
      const {data: message} =  await Axios
        .post(
          "http://localhost:3001/games",
          {...game }
        )
        .then((res) =>{
          return res
        })
        .catch(err => console.log(err));
      this.props.history.push(`/games/${message}`);
    } catch {
      // TODO: Something better
      const message = "Failed to create game"
      this.setState({message});
    }
  };

  render(){
    return (
      <Form 
        {...this.layout} 
        name="nest-messages" 
        onFinish={this.onFinish} 
      >
        <Form.Item
          label="Game Name"
          name="gameName"
        >
          <Input/>
        </Form.Item>
        <Form.Item
          label="Number of Players"
          name="numPlayers"
        >
          <Select
            onChange={this.handleNumPlayerChange}
            placeholder="Select the number of players"
          >
            {this.numPlayerData.map(numPlayer => (
            <Option key={numPlayer}>{numPlayer}</Option>
          ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    )
  } 

};

export default withRouter(Home);