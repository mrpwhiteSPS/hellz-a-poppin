const {ObjectId} = require('mongodb');
const {DB} = require('../mongo')

async function handlePlayCard(
  ws, 
  {
    gameId,
    playerId,
    card    
  },
  clientId,
  SendGameMessage
){
  const db = new DB()
  const client = db.client
  await client.connect()
  const dbHAP = client.db('hap')
  
  const findQuery = {
    "_id": ObjectId(gameId)
  }
  let game = await dbHAP
    .collection('games')
    .findOne(findQuery)

  // Find Player hand
  // confirm card in hand
  // confirm player should play next
  // confirm card follows suit if possible
  // Is card last card in to play
    // if yes, 
      // add all currTrick cards to Tricks
      // Determine next currLeader
      // Clear currSuit
      // clear currTricks

    // if no
      // add to currTricks

  // currLeadSuit: Suit
  // currLeader: Seat
  // currHand: [Hand]
  // currTricks: [{
  //   Player_id,
  //   Card
  // }]





  // const updateQuery = {
  //   "_id": ObjectId(gameId),
  //   "seats": { $elemMatch: { position: position } }
  // }
  // const update = {
  //   $set: {
  //     "seats.$.player_id": playerId
  //   }
  // }
  // const config = {
  //   upsert: true
  // }
  // let r = await dbHAP
  //   .collection('games')
  //   .update(updateQuery, update, config);
  // // TODO Assertions

  
  // client.close()

  // const message = {
  //   clientId,
  //   gameId,
  //   action: "UpdatedGame",
  //   data: game
  // }
  // SendGameMessage(gameId, message, ws)
}

exports.handlePlayCard = handlePlayCard;

