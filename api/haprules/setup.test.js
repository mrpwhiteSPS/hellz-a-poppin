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