const shuffle = require('shuffle');

function InitGameRounds(game){
  const {seats} = game;
  const numPlayers = seats.length;
  const numRounds  = Math.floor(52 / seats.length) * 2;

  const rounds = [...Array(numRounds)].map((e, i) => {
    const roundNum = i + 1
    
    const numCards = calcNumberOfCards(numRounds, roundNum)
    const deck = shuffle.shuffle()
    const startingHands = seats.map(({player_id}) => {
      const cards = numCards === 1 ? [deck.draw(numCards)] : deck.draw(numCards)
      return {
        player_id,
        cards
      }
    })
    
    const dealerSeatPosition = calcDealerSeatPosition(roundNum, numPlayers)
    const dealer = seats.find(({position}) => position == dealerSeatPosition)
    return {
      number: roundNum,
      startingHands,
      dealer,
      bids:[],
      tricks: [],
      currHand: startingHands
    }
  })

  return rounds
}

function calcDealerSeatPosition(currRound, numPlayers){
  return currRound % numPlayers;
}

function calcNumberOfCards(numRounds, roundNum){
  const halfPoint = (numRounds / 2)
  const isFirstHalf = halfPoint >= roundNum;
  return isFirstHalf ? roundNum : (halfPoint - (roundNum - halfPoint) + 1)
}

exports.InitGameRounds = InitGameRounds;
exports.calcNumberOfCards = calcNumberOfCards;
