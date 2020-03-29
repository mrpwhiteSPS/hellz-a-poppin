const {DB} = require('../mongo')

class Game{
  static async handlePostGame(body, res){
    try {
      let {numPlayers, gameName: name} = body
      const db = new DB();
      const dbClient = db.client
      await dbClient.connect();
      const dbHAP = dbClient.db("hap");
      console.log({numPlayers})
      const seats = [...Array(parseInt(numPlayers))].map((e, position) => {return {position}})
      const game = {
        seats,
        name
      }
      let r = await dbHAP.collection('games').insertOne(game);
      res.send(r.insertedId);
      dbClient.close()
    } catch (err) {
      console.log(err.stack);
      res.send("Failed to create game");
    }
  }
}

exports.Game = Game