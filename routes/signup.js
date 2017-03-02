var express = require('express');
var router = express.Router();
var isAuthenticated = require('../lib/login')
var passwordChecker = require('../lib/password-checker.js');
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
    var username = req.body.username;
    var password = req.body.password;

    if (username == '' || password == '') {
        res.redirect('/signup');
    }

    User.where({
        username: username
    }).find(function(err, data) {
        if (err) {
            return handleError(err);
        }
        if (data.length === 0) {
            // 登録可能な場合
            var hash = passwordChecker.createHash(password);
            var newUser = new User();
            newUser.username = username;
            newUser.hash = hash;
            newUser.save(function(err) {
                if (err) {
                    res.redirect('/signup');
                } else {
                    req.login(req.body.username, function(err) {
                        if (err) { return next(err); }
                        // TODO: セッションのとこは共通化したい
                        req.session.username = req.user
                        res.redirect('/')
                    });
                }
            })
        } else {
            // 既に登録されている場合
            res.redirect('/login');
        }
    })
})

module.exports = router;