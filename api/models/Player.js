const {DB} = require('../mongo')

class Player {
  static async handlePostPlayer(player, res){
    try {
      //TODO validate player object
      const db = new DB();
      const dbClient = db.client
      await dbClient.connect();
      const dbHAP = dbClient.db("hap");
      let r = await dbHAP.collection('players').insertOne(player);
      res.send({id: r.insertedId});
      dbClient.close()
    } catch (err) {
      console.log(err.stack);
      res.send("Failed to create player");
    }
  }

  static async handleGetPlayers(res){
    try {
      //TODO validate player object
      const db = new DB();
      const dbClient = db.client
      await dbClient.connect();
      const dbHAP = dbClient.db("hap");
      //TODO put limit on query
      let players = await dbHAP.collection('players').find();
      res.send({players});
      dbClient.close()
    } catch (err) {
      console.log(err.stack);
      res.send("Failed to retrieve players");
    }
  }
}


exports.Player = Player