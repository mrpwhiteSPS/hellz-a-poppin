const {ObjectID} = require('mongodb');
const {DB} = require('../mongo')

async function handleGetGame(ws, {gameId}, clientId, SendGameMessage){
  const db = new DB()
  const client = db.client
  await client.connect()
  const dbHAP = client.db('hap')

  let r = await dbHAP
    .collection('games')
    .findOne({_id: ObjectID(gameId)});
  client.close()

  
  const message = {
    clientId,
    gameId,
    action: "GetGame",
    data: r
  }
  SendGameMessage(gameId, message, ws)
}

exports.handleGetGame = handleGetGame;