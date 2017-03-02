var express = require('express');
var router = express.Router();

var model = require('../lib/model.js');
var User = model.User;

/* GET users listing. */
router.get('/', function(req, res, next) {
    User.find('', function(err, docs) {
        res.send(docs);
    })
});

module.exports = router;