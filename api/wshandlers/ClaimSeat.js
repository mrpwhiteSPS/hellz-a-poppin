const {ObjectId} = require('mongodb');
const {DB} = require('../mongo')

async function handleClaimSeat(
  ws, 
  {
    gameId,
    position,
    playerId
  }
){
  const db = new DB()
  const client = db.client
  await client.connect()
  const dbHAP = client.db('hap')
  console.log({
    gameId,
    position,
    playerId
  })
  const updateQuery = {
    "_id": ObjectId(gameId),
    "seats": { $elemMatch: { position: position } }
  }
  const update = {
    $set: {
      "seats.$.player_id": playerId
    }
  }
  const config = {
    upsert: true
  }
  let r = await dbHAP
    .collection('games')
    .update(updateQuery, update, config);
  // TODO Assertions

  const findQuery = {
    "_id": ObjectId(gameId)
  }
  let game = await dbHAP
    .collection('games')
    .findOne(findQuery)
  
  client.close()

  const message = {
    action: "ClaimedPosition",
    data: game
  }
  ws.send(JSON.stringify(message))
}

exports.handleClaimSeat = handleClaimSeat;

