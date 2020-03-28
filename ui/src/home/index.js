import React from 'react';
import { 
  Button, 
  Input,
  Form,
  Select
} from 'antd';
// import { AppstoreAddOutlined }from '@ant-design/icons';
import Axios from 'axios';
const { Option } = Select

class CreateGameForm extends React.Component {
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
  handleCreateGame = async () => {
    try {
      const {data: message} =  Axios
        .post("http://localhost:3001/",
          {
            ...this.state.game
          }
        )
        .then((res) =>{
          return res
        })
        .catch(err => console.log(err));
      this.setState({message});
    } catch {
      const message = "Failed to create game"
      this.setState({message});
    }

  }  

  onFinish = async(game) => {
    console.log(game)
    this.setState(
      {game},
      await this.handleCreateGame()
    )
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
            defaultValue={this.state.numPlayers}
            value={this.state.numPlayers}
            onChange={this.handleNumPlayerChange}
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

export default CreateGameForm;