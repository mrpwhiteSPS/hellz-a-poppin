let express = require('express');
let bodyParser = require('body-parser')
let cors = require('cors');
let { DB } = require('./mongo')
let {handleGetGame} = require('./wshandlers/GetGame.js')
let {handleClaimSeat} = require('./wshandlers/ClaimSeat.js')
let {handleStartGame} = require('./wshandlers/StartGame.js')
let {handleMakeBid} = require('./wshandlers/MakeBid.js')
let { Game } = require('./models/Game.js')
let { Player } = require('./models/Player.js')
let app = express();
let { uuid } = require('uuidv4');

app.use(express.json());
app.use(cors());
let jsonBodyParser = bodyParser.json();

app.listen(3001, function() {
  console.log('Hells a popping API listening on port 3001!');
});

app.post('/games', jsonBodyParser, async ({body}, res)=> {
  await Game.handlePostGame(body, res)
})

app.post('/players', jsonBodyParser, async ({body}, res)=> {
  await Player.handlePostPlayer(body, res)
})

app.get('/players', async (req, res)=> {
  await Player.handleGetPlayers(body, res)
})

const WebSocket = require('ws');
const wss = new WebSocket.Server({
  port: 8000
});

const WSMessageHandlers = {
  "GetGame": handleGetGame,
  "ClaimSeat": handleClaimSeat,
  "StartGame": handleStartGame,
  "MakeBid": handleMakeBid
}

let wsGames = {};

function SendGameMessage(gameId, message, ws){
  Object.entries(wsGames[gameId]).forEach(([clientId, ws]) => {
    ws.send(JSON.stringify(message))
  })
}

wss.on('connection', function connection(ws) {
  // TODO the client ID should be the {gameID}.{playerID}
  ws.on('message', function incoming(message) {
    let {clientId, action, data} = JSON.parse(message)
    const {gameId} = data;
    if (clientId == undefined ){
      clientId = uuid()
      wsGames = {
        ...wsGames, 
        [gameId]: {
          ...wsGames[gameId],
          [clientId]: ws
        }
      }
    }
    WSMessageHandlers[action](ws, data, clientId, SendGameMessage)
  });
});

exports.SendGameMessage = SendGameMessage;