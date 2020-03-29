const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const {Config} = require('../Config.js')

class DB {
  constructor(){
    const {mongoUrl} = Config
    this.client = new MongoClient(mongoUrl);
  }
}


exports.DB = DB;