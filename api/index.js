let express = require('express');
let cors = require('cors');
let app = express();
const assert = require('assert');
let { dbClient } = require('./mongo')

app.use(express.json());
app.use(cors());

app.listen(3001, function() {
  console.log('Hells a popping API listening on port 3001!');
});

app.get('/', async function(req, res) {
  console.log("hi")
  res.send('Hello Message!');
  try {
    await dbClient.connect();
    console.log("Connected correctly to server");

    const db = dbClient.db("cards");

    // Insert a single document
    let r = await db.collection('card').insertOne({a:1});
    assert.equal(1, r.insertedCount);
    console.log({r})
    // Insert multiple documents
    // r = await db.collection('inserts').insertMany([{a:2}, {a:3}]);
    // assert.equal(2, r.insertedCount);
  } catch (err) {
    console.log(err.stack);
  }

  // Close connection
  console.log("closing")
  dbClient.close();
});
