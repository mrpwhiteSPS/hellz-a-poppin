const {ObjectId} = require('mongodb');
const {DB} = require('../mongo')
const {Game} = require('../models/Game.js')

async function handleMakeBid(
  ws, 
  {
    gameId,
    playerId,
    bid
  },
  clientId,
  SendGameMessage
){
  const db = new DB()
  const client = db.client
  await client.connect()
  const dbHAP = client.db('hap')
  // TODO: Confirm all of the seats have been claimed. Possibly
  // that at least 3 seats have been claimed; the minimum number
  // required for a game.
  const findQuery = {
    "_id": ObjectId(gameId)
  }
  
  let dbGame = await dbHAP
    .collection('games')
    .findOne(findQuery)

  const currGame = new Game(dbGame)
  // Make sure it is that players turn to bid
  const bidderSeat = currGame.getSeatFromPlayerId(playerId)
  const bidderId = bidderSeat.player_id
  
  const currRound = currGame.getCurrRound()
  const expNextBidderId = currGame.getNextBidderId()
  
  if (expNextBidderId !== bidderId){
    console.log("Incorrect Bidder")
  }else {
    console.log("Correct Bidder")
  }

  // Make sure it is a legal bid
  const isLegalBid = checkLegalBid(currRound, bid)

  if (!isLegalBid){
    console.error("Illegal bid!!!!")
    return
  }
  console.log("Legal bid")
  
  const {bids: currBids, number: currRoundNumber} = currRound;
  const bids = [...currBids, {
    player_id: playerId,
    position: bidderSeat.position,
    bid
  }]

  const updateQuery = {
    "_id": ObjectId(gameId),
    "rounds": { $elemMatch: { number: currRoundNumber } }
  }
  const update = {
    $set: {
      "rounds.$.bids": bids
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

function checkLegalBid(currRound, currBid){
  const maxNumBids = currRound.startingHands[0].cards.length;
  const legalBidSize = maxNumBids >= currBid

  const {bids} = currRound;
  const isFirstBid = bids.length == 0 
  const isLastBid = isFirstBid ? false : maxNumBids - 1 == bids.length;

  const totalBids = bids.reduce((accum, {bid}) => accum + bid, 0)
  
  const bidsAddup = isLastBid ? ((totalBids + currBid) !== maxNumBids) : true

  return legalBidSize && bidsAddup
}

exports.handleMakeBid = handleMakeBid;
