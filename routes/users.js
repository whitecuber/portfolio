var express = require('express');
var router = express.Router();

var ObjectID = require('mongodb').ObjectID;
var collection = require('../lib/mongo');
var COL = 'portfolio';

/* GET users listing. */
router.get('/', function(req, res, next) {
    collection(COL).find().toArray(function(err, docs) {
        res.send(docs);
    })
});

// POST insert data
router.post('/', function(req, res) {
    collection(COL).insertOne(req.body).then(function(r) {
        res.send(r);
    });
});

module.exports = router;