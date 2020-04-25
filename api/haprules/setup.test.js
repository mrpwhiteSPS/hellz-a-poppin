const {calcNumberOfCards} = require('./setup.js')


test.each(
    [
      [12, 1, 1],
      [12, 12, 1],
      [12, 6, 6],
      [12, 6, 6],
      [18, 10, 9],
      [16, 9, 8],
      [28, 16, 13]
    ]
  )(
  '%i rounds; round number %i; %i expected', 
  (numRounds, roundNum, expected) =>{
    const numCards = calcNumberOfCards(numRounds, roundNum)
    expect(numCards).toEqual(expected)
})

//   1, 2, 0

//   Bid {
//     Player_id
//     SeatPosition
//     Bid
//     Accepted  
//   }

//   []
//   Then the seat after the dealer

//   [2]
//   nextSeat()

//   [2, 0]

// 2 => 0
// 1 => 2
// 0 => 1

// nextSeat(numSeats, prevSeat){
//   prevSeat + 1 % numSeats => 0
// }