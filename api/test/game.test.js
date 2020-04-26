const {mapSeries} = require('async');
const {Game} = require('../models/Game.js')
const {
  CreateGame,
  GetWSClient,
  CreatePlayer
} = require('./setup.js')

const {
  getNextBidderId,
  getNextSeatPosition,
  getCurrRound 
} = require('../wshandlers/MakeBid.js')


const gameConfig = {
  gameName: "TEST - Best Game",
  numPlayers: 3,
  players: [
    {
      "name": "Matthew"
    },
    {
      "name": "Zach"
    },
    {
      "name": "Bradley"
    }
  ]
}


describe('Run game',() => {
  let state = {
    game: undefined,
    players: {
      id: undefined,
      name: undefined,
      ws: undefined
    }
  };

  async function UpdatedGameHandler(message){
    const msgJSON = JSON.parse(message)
    // console.log({msgJSON})
    const {data: game} = msgJSON
    state = {...state, game}
  }

  afterAll(async (done) => {
    // Iterate through the players and close their sockets
    await Promise.all(state.players.map(({ws}) => ws.close()))
    done()
  })

  test('Create players', async () => {
    const players = await Promise.all(
      gameConfig.players.map(async (p) => {
        const {id} = await CreatePlayer(p)
        const player = {...p, id}
        return player;
      })
    )
    players.forEach(player => {
      expect(Object.keys(player)).toEqual(['name','id'])
    })
    state = {...state, players}
  })

  test('Players exist', () => {
    const {players} = state
    expect(players.length).toBe(3)
    players.forEach( player => {
      expect(player).toHaveProperty('id')
      expect(player).toHaveProperty('name')
    });
  });

  test('Create game', async () => {
    const game = await CreateGame(gameConfig.numPlayers, gameConfig.gameName)
    expect(game).toHaveProperty('_id')
    expect(game._id).toBeTruthy()
    state = {...state, game}
  });

  test('Each player claims a seat and gets a WS', async () => {
    const {players: statePlayers} = state;
    expect(statePlayers.length).toBe(3)
    
    // Create a web socket client for each player
    const players = await Promise.all(
      statePlayers.map(async ({id, ...rest}, i) => {
        const message = {
          // clientId: state.clientId,
          action: "ClaimSeat",
          clientId: id,
          data: {
            gameId: state.game._id,
            position: i,
            playerId: id
          }
        }
        
        const ws = GetWSClient(UpdatedGameHandler)
        // wait for the ws to open
        await new Promise((r) => setTimeout(r, 50));
        
        ws.send(JSON.stringify(message))

        return {
          id,
          ws,
          ...rest
        }
      })
    )
    
    // update state with websocketed players
    state = {...state, players}

    // Wait a moment for the web event to happen
    await new Promise((r) => setTimeout(r, 1000));
    /* {
      "clientId":"1c99176e-c89b-40d4-8b1f-5fbc5696efe4",
      "gameId":"5e939a5bf3e9ad059f6f163a",
      "action":"UpdatedGame",
      "data":{
        "_id":"5e939a5bf3e9ad059f6f163a",
        "seats":[
          {
            "position":0,
            "player_id": "123abc"
          },
          {
            "position":1,
            "player_id": "123abc"
          },
          {
            "position":2,
            "player_id": "123ABC"
          }
        ],
        "name":"TEST - Best Game"}
      }
      */
    const {game} = state
    expect(game).toHaveProperty('_id')
    expect(game).toHaveProperty('seats')
    expect(game).toHaveProperty('name')
    
    const {_id, seats, name} = game
    expect(name).toBe(gameConfig.gameName)
    expect(seats.length).toBe(gameConfig.players.length)

    const statePlayerIds = state.players.map(({id}) => id)
    const seatPlayerIds = seats.map(({player_id}) => player_id)
    expect(statePlayerIds).toEqual(seatPlayerIds)
  })

  test('Start game', async () => {
    // One of the players needs to start the game
    // TODO: that is a gross line of code....
    const {ws, id:clientId} = state.players[0]
    const message = {
      clientId: clientId,
      action: "StartGame",
      data: {
        gameId: state.game._id
      }
    }
    await ws.send(JSON.stringify(message))
    await new Promise((r) => setTimeout(r, 200));
    const {game: {rounds}} = state
    expect(rounds.length).toEqual(34)
  })

  test('Players continue to bid in the correct order', async () => {
    const {game} = state
    const cGame = new Game(game)
    const orderedSeats = cGame.currRoundBidOrder()

    await mapSeries(orderedSeats, async ({position, player_id: clientId}) => {
      const {ws} = state.players.find(({id}) => clientId == id)

      const message = {
        clientId,
        action: "MakeBid",
        data: {
          gameId: state.game._id,
          playerId: clientId,
          bid: 1
        }
      }
      await ws.send(JSON.stringify(message))
      await new Promise((r) => setTimeout(r, 100));
    })

    const {number: currRoundNumber} = cGame.getCurrRound();
    const bidRound = state.game.rounds.find(({number}) => number == currRoundNumber)

    expect(bidRound.bids.length).toEqual(3)
    bidRound.bids.forEach((bid) => {
      expect(Object.keys(bid)).toEqual(["player_id", "position", "bid"])
      expect(bid.bid).toEqual(1)
    })
  })

  test('play first trick', async () => {
    const {game} = state
    const cGame = new Game(game)
    // Determine Current Round
    const currRound = cGame.getCurrRound() 
    console.log({currRound})
  })
})