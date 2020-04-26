const shuffle = require('shuffle');

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

      return {
        number: roundNum,
        startingHands,
        dealer,
        bids:[],
        tricks: []
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

  // TODO: bring in from MakeBid.js
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
    return this.rounds.find(({tricks}) => tricks.length === 0)
  }

  getPlayerSeat(playerId){
    return this.seats.find(({player_id}) => player_id == playerId)
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

    // Round Properties
    // Should go in rounds
    // const currLeaderPosition = Game.getNextSeatPosition(numPlayers, dealerSeatPosition)
    // const currLeader = seats.find(({position}) => position == currLeaderPosition)
  currPlayLeadSuit(){

  }

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

  currPlayLeader(){

  }
}


exports.Game = Game