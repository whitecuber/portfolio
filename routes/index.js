var express = require('express');
var router = express.Router();
var isAuthenticated = require('../lib/login')

/* GET home page. */
router.get('/', isAuthenticated, function(req, res, next) {
    res.render('index', { title: 'whitecuber-portfolio' });
});

module.exports = router;