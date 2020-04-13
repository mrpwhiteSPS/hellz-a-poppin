const Axios = require('axios');
const WS = require('ws');
// Create Game
// Create players
// Start game
// Deal cards
// Bid


// Play

const apiUrl = "http://localhost:3001";
async function CreateGame(numPlayers, gameName){
  const game = {
    numPlayers,
    gameName
  }
  const {data: message} =  await Axios
    .post(
      `${apiUrl}/games`,
      {...game }
    )
    .then((res) =>{
      return res
    })
    .catch(err => console.log(err));
  return message
}

async function CreatePlayer(player){
  const {data: message} =  await Axios.post(
      `${apiUrl}/players`,
      player
    ).then((res) =>{
      return res
    }).catch(err => console.log(err));
  return message
}



function GetWSClient(messageHandler){
  const ws = new WS('ws://localhost:8000')

  ws.on('message', messageHandler)

  return ws
}


function AddPlayer(wsclient){

}

function GetWebsocket(){

}

exports.CreateGame = CreateGame;
exports.GetWSClient = GetWSClient;
exports.CreatePlayer = CreatePlayer;