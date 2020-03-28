const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://db:27017';

// Create a new MongoClient
const dbClient = new MongoClient(url);

exports.dbClient = dbClient;