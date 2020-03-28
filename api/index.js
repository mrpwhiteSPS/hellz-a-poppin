let express = require('express');
let cors = require('cors');
let app = express();
let { dbClient } = require('./mongo')

app.use(express.json());
app.use(cors());

app.listen(3001, function() {
  console.log('Hells a popping API listening on port 3001!');
});

app.get('/', async function(req, res) {
  try {
    await dbClient.connect();

    const db = dbClient.db("hap");
    let r = await db.collection('games').insertOne({a:1});

    res.send(r.insertedId);
  } catch (err) {
    console.log(err.stack);
    res.send("Failed to create game");
  }
});
