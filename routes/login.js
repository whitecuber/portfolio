var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var ObjectID = require('mongodb').ObjectID;
var collection = require('../lib/mongo');
var COL = 'portfolio';

passport.use(new LocalStrategy(function(username, password, done) {
    if (false) {
        return done('エラー内容');
    } else if (true) {
        return done(null, username);
    } else {
        return done(null, false);
    }
}));

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/')
    } else {
        res.render('login', { title: 'Login' });
    }
});

router.post('/',
    passport.authenticate('local', {
        failureRedirect: '/login', // 失敗したときの遷移先
        successRedirect: '/', // 成功したときの遷移先
    })
)

module.exports = router;