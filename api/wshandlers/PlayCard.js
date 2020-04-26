const {ObjectId} = require('mongodb');
const {isEqual} = require('lodash');

const {DB} = require('../mongo')
const {Game} = require('../models/Game.js')

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
  let dbGame = await dbHAP
    .collection('games')
    .findOne(findQuery)

  const cGame = new Game(dbGame)

  // confirm player should play next
  const expNextPlayer = cGame.nextPlayerToPlay()

  if(expNextPlayer != playerId){
    console.log("NOT next player")
    console.log({expNextPlayer, playerId})
    return
  }
  console.log("Player is next player")

  // Find Player hand
  const playerCurHand = cGame.getPlayersHand(playerId)
  const playerHasCard = playerCurHand.some(hCard => isEqual(card, hCard))

  if(!playerHasCard){
    console.log("Player does not have card in hand")
    console.log({playerCurHand, card})
    return;
  }
  
  // confirm card follows suit if possible
  const {suit: playedSuit} = card
  const leadSuit = cGame.currPlayLeadSuit()
  const isLeadSuit = leadSuit != undefined
  if(isLeadSuit && playedSuit !== leadSuit){
    console.log("Player did not follow suit")
    console.log({playedSuit, leadSuit})
    return;
  }

  console.log("Player followed suit")
  console.log({playedSuit, leadSuit})


  
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

