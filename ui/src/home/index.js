import React from 'react';
import { 
  Button, 
  Input,
  Form
} from 'antd';
import { AppstoreAddOutlined }from '@ant-design/icons';
import Axios from 'axios';

class CreateGameForm extends React.Component {
  numPlayerData = [3, 4, 5, 6, 7, 8, 9, 10]
  layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };
  handleCreateGame = async () => {
    try {
      const {data: message} =  Axios
        .get("http://localhost:3001/")
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

  onFinish = async(values) => {
    console.log(values);
    console.log("values");
    await this.handleCreateGame()
  };

  handleNumPlayerChange = (numPlayers) => {
    this.setState({numPlayers})
  }
  render(){
    return (
      <Form {...this.layout} 
        name="nest-messages" 
        onFinish={this.onFinish} 
      >
        <Form.Item
          label="Gamename"
          name="gamename"
        >
          <Input/>
        </Form.Item>
        <Form.Item
          label="NumPlayers"
          name="numplayers"
        >
          <Select
            defaultValue="3"
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