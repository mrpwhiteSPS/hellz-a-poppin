let express = require('express');
let bodyParser = require('body-parser')
let cors = require('cors');
let { dbClient } = require('./mongo')

let app = express();

app.use(express.json());
app.use(cors());
let jsonBodyParser = bodyParser.json();

app.listen(3001, function() {
  console.log('Hells a popping API listening on port 3001!');
});

app.post('/games', jsonBodyParser, async ({body}, res)=> {
  try {
    await dbClient.connect();

    const db = dbClient.db("hap");
    let r = await db.collection('games').insertOne(body);

    res.send(r.insertedId);
  } catch (err) {
    console.log(err.stack);
    res.send("Failed to create game");
  }
})
