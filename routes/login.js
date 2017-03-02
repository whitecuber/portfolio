var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var model = require('../lib/model.js');
var User = model.User;

passport.use(new LocalStrategy(function(username, password, done) {
    var query = {
        "username": username,
        "password": password
    };
    User.find(query, function(err, data) {
        if (err) {
            console.log(err);
        }
        if (data.length == 0) {
            return done(null, false);
        } else {
            return done(null, username);
        }
    });
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
    }),
    function(req, res) {
        // TODO: セッションのとこは共通化したい
        req.session.username = req.body.username
        res.redirect('/')
    }
)

module.exports = router;