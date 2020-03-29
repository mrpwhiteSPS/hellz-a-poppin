const {ObjectID} = require('mongodb');
const {DB} = require('../mongo')

async function handleClaimSeat(
  ws, 
  {
    gameId,
    position,
    playerId
  }
){
  const db = new DB()
  const client = db.client
  await client.connect()
  const dbHAP = client.db('hap')
  console.log({
    gameId,
    position,
    playerId
  })
  // let r = await dbHAP
  //   .collection('games')
  //   .findOne({_id: ObjectID(gameId)});

  // const message = {
  //   action: "GetGame",
  //   data: r
  // }
  client.close()
  // console.log(`${client}`)
  // ws.send(JSON.stringify(message))
}

exports.handleClaimSeat = handleClaimSeat;

