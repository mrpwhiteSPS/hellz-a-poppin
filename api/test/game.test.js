const {
  CreateGame,
  GetWSClient,
  CreatePlayer
} = require('./setup.js')

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
  let ws;
  let state = {};
  async function UpdatedGameHandler(message){
    const msgJSON = JSON.parse(message)
    const {data: game, clientId} = msgJSON
    state = {...state, game, clientId}
  }
  
  beforeAll(async (done)=> {
    ws = GetWSClient(UpdatedGameHandler);
    const players = await Promise.all(
      gameConfig.players.map(async (p) => {
        const {id} = await CreatePlayer(p)
        const player = {...p, id}
        return player;
      })
    )
    state = {...state, players}
    done()
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

  test('Claim seats', async () => {
    const {players} = state;
    expect(players.length).toBe(3)
    await state.players.forEach(async ({id}, i) => {
      const message = {
        clientId: state.clientId,
        action: "ClaimSeat",
        data: {
          gameId: state.game._id,
          position: i,
          playerId: id
        }
      }
      await ws.send(JSON.stringify(message))
    })

    // Wait a moment for the web event to happen
    await new Promise((r) => setTimeout(r, 2000));
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
    const message = {
      clientId: state.clientId,
      action: "StartGame",
      data: {
        gameId: state.game._id
      }
    }
    await ws.send(JSON.stringify(message))
    await new Promise((r) => setTimeout(r, 2000));
    const {game: {rounds}} = state
    
    expect(rounds.length).toBe(34)
  })

  test('Players bid', async () => {

  })
})