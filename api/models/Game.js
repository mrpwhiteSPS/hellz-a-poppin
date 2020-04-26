const shuffle = require('shuffle');
const {isEqual} = require('lodash');

const {DB} = require('../mongo')

class Game{
  static async handlePostGame(body, res){
    try {
      let {numPlayers, gameName: name} = body
      const db = new DB();
      const dbClient = db.client
      await dbClient.connect();
      const dbHAP = dbClient.db("hap");
      const seats = [...Array(parseInt(numPlayers))].map((e, position) => {return {position}})
      const game = {
        seats,
        name
      }
      let r = await dbHAP.collection('games').insertOne(game);
      res.send({_id: r.insertedId});
      dbClient.close()
    } catch (err) {
      console.log(err.stack);
      res.send("Failed to create game");
    }
  }

  static GameFromSeats({seats}){
    const numPlayers = seats.length;
    const numRounds  = Math.floor(52 / seats.length) * 2;

    const rounds = [...Array(numRounds)].map((e, i) => {
      const roundNum = i + 1
      
      const numCards = Game.calcNumberOfCards(numRounds, roundNum)
      const deck = shuffle.shuffle()
      const startingHands = seats.map(({player_id}) => {
        const cards = numCards === 1 ? [deck.draw(numCards)] : deck.draw(numCards)
        return {
          player_id,
          cards
        }
      })
      
      const dealerSeatPosition = Game.calcDealerSeatPosition(roundNum, numPlayers)
      const dealer = seats.find(({position}) => position == dealerSeatPosition)

      const tricks = [...Array(numRounds)].map((e, number) => {
        return {
          number, 
          plays: []
        }
      }) 

      return {
        number: roundNum,
        startingHands,
        dealer,
        bids:[],
        tricks
      }
    })

    return new Game({seats, rounds})
  }
  
  static calcDealerSeatPosition(currRound, numPlayers){
    return currRound % numPlayers;
  }

  static calcNumberOfCards(numRounds, roundNum){
    const halfPoint = (numRounds / 2)
    const isFirstHalf = halfPoint >= roundNum;
    return isFirstHalf ? roundNum : (halfPoint - (roundNum - halfPoint) + 1)
  }

  static getNextSeatPosition(numSeats, prevSeat){
    return (prevSeat + 1) % numSeats
  }

  constructor({seats, rounds}){
    this.seats = seats;
    this.rounds = rounds;
  }

  getScore(){

  }

  getCurrRound(){
    // Find the first round in the game
    // That has a play that does NOT contain all of the expected cards
    return this.rounds.find(({tricks}) => {
      const numCardsInRound = tricks.length
      return tricks.some(({plays}) => {
        return plays.length != numCardsInRound
      })

    })
  }

  getCurrRoundAndTrick(){
    // Return current round and a play
    return this.rounds.reduce((acc, round) => {
      const {number: roundNum, tricks} = round

      //As soon as we have a roundNum and playNum
      if (acc != undefined){ return acc}

      const numCardsInRound = tricks.length
      const incompleteTrick = tricks.find(({plays}) => {
        return plays.length != numCardsInRound
      })

      if (incompleteTrick != undefined){
        // We found an incomplete play
        return {round, trick: incompleteTrick};
      }
    }, undefined)
  }

  getSeatFromPlayerId(playerId){
    return this.seats.find(({player_id}) => player_id == playerId)
  }

  getSeatFromSeatNumber(seatNumber){
    return this.seats.find(({number}) => number == seatNumber)
  }

  getNextBidderId(){
    // return a player id for the next bidder
    const {dealer, bids} = this.getCurrRound();
    const lastBidder = bids[bids.length - 1]
    const {position} = !lastBidder ? dealer : lastBidder
    const nextPosition = Game.getNextSeatPosition(this.seats.length, position)
    const {player_id} = this.seats.find(({position}) => {
      return position == nextPosition
    })
    return player_id
  }

  // Bidding Properties
  currRoundStartingBidder(){
    // Returns the seat position of the starting bidder
    const startingBidderId = this.getNextBidderId()
    const {position: startingBidderSeat} = this.seats.find(({player_id}) => player_id == startingBidderId)
    return startingBidderSeat
  }

  currRoundBidOrder(){
    const [lastSeatPostion, orderedSeats] = this.seats.reduce(([prevSeatPosition, accum], seat) => {
      const nextSeat = this.seats.find(({position}) => position == prevSeatPosition)
      const nextSeatPostion = Game.getNextSeatPosition(this.seats.length, prevSeatPosition)
      return [nextSeatPostion, accum.concat(nextSeat)]
    }, [this.currRoundStartingBidder(), []])

    return orderedSeats
  }

  // Play Properties
    // Round Properties
    // Should go in rounds
    // const currLeaderPosition = Game.getNextSeatPosition(numPlayers, dealerSeatPosition)
    // const currLeader = seats.find(({position}) => position == currLeaderPosition)
  currPlayLeadSuit(){
    // Either return a suite or undefined if the current play contains no cards
    const roundPlayOrder = this.currRoundBidOrder()
    const {round, trick} = this.getCurrRoundAndTrick()
    const firstCardPlayed = trick.plays[0]

    if (firstCardPlayed == undefined) {return}
    
    const {suit} = firstCardPlayed
    return {suit}
  }

  currPlayLeader(){

  }

  nextPlayerToPlay(){
    // Determine which player is expected to play next
    const {round, trick} = this.getCurrRoundAndTrick()
    const isFirstPlay = trick.plays.length == 0

    // If play in ongoing
    if(!isFirstPlay){
      // Get the last player to play
      const {playerId: prevPlayerId} = plays[plays.length - 1]
      const {position: playerSeatPosition} = this.getSeatFromPlayerId(prevPlayerId)
      // Determine next player to play
      const numPlayers = this.seats.length;
      const nextSeatPosition = Game.getNextSeatPosition(numPlayers, playerSeatPosition)
      const {playerId} = this.getSeatFromSeatNumber(nextSeatPosition)
      return playerId
    }

    // If play has not begun
    // Get the winner from the last trick
    const {playerId} = this.getPreviousTrickSeat()
    return playerId
  }

  getPreviousTrickSeat(){
    const {round, trick} = this.getCurrRoundAndTrick()
    
    //If first trick of round
      //Get previous round
      //Get last trick
      //Get winner

    // Get previous trick of current round
    // Get winner
    const prevTrickNum = trick.number - 1;
    // const prevTrick = round.tricks.find(({number}) => number == )
  }

  getPlayersHand(playerId){
    const cRound = this.getCurrRound()
    const {startingHands, tricks} = cRound;
    const {cards: startCards} = startingHands.find(({player_id}) => player_id == playerId)
    const playedCards = tricks.reduce((accum, {plays}) => {
      const tCards = plays.map(({card}) => card)
      return accum.concat(tCards)
    }, [])
    const currHand = startCards.filter( startCard => {
      return !playedCards.some(playedCard => {
        return isEqual(playedCard, startCard)
      })
    })

    return currHand
  }
  
  static isPlayComplete({cards}){

  }
  // Hand properties

  // confirm card in hand
  // confirm player should play next
  // confirm card follows suit if possible
}


exports.Game = Game