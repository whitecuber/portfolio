var express = require('express');
var router = express.Router();
var isAuthenticated = require('../lib/login')
var model = require('../lib/model.js');
var User = model.User;

router.get('/', function(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/')
    } else {
        res.render('signup', { title: 'Signup' });
    }
});

router.post('/', function(req, res, next) {
    var newUser = new User(req.body);
    newUser.save(function(err) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            req.login(req.body.username, function(err) {
                if (err) { return next(err); }
                // TODO: セッションのとこは共通化したい
                req.session.username = req.user
                res.redirect('/')
            });
        }
    });
})

module.exports = router;