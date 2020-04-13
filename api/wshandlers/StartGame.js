const {ObjectId} = require('mongodb');
const {DB} = require('../mongo')
const {InitGameRounds} = require('../haprules/setup.js')

async function handleStartGame(
  ws, 
  {gameId},
  clientId,
  SendGameMessage
){
  const db = new DB()
  const client = db.client
  await client.connect()
  const dbHAP = client.db('hap')
  console.log("Starting Game")
  // TODO: Confirm all of the seats have been claimed. Possibly
  // that at least 3 seats have been claimed; the minimum number
  // required for a game.
  const findQuery = {
    "_id": ObjectId(gameId)
  }
  
  let currGame = await dbHAP
    .collection('games')
    .findOne(findQuery)  
  // TODO Assertions

  // Create all of the rounds with only the position set.
  const updateQuery = {
    "_id": ObjectId(gameId),
  }
  
  const rounds = InitGameRounds(currGame);

  const update = {
    $set: {
      rounds
    }
  }
  
  const config = {
    upsert: true
  }
  let r = await dbHAP
    .collection('games')
    .updateOne(updateQuery, update, config);
  // TODO Assertions

  let newGame = await dbHAP
    .collection('games')
    .findOne(findQuery)
  
  client.close()

  const message = {
    clientId,
    action: "UpdatedGame",
    data: newGame
  }
  SendGameMessage(gameId, message, ws)
}



exports.handleStartGame = handleStartGame;

