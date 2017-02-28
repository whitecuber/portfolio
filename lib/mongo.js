/**
 * http://mongodb.github.io/node-mongodb-native/2.2/
 */
var db;
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var config = require('./config');

// Connection URL
var url = config.mongo;

// Use connect method to connect to the Server
MongoClient.connect(url, function(err, mongodb) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    db = mongodb;
});

var collection = function(name) {
    return db.collection(name);
}

module.exports = collection;