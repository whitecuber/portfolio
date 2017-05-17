var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passwordChecker = require('../lib/password-checker.js');
var model = require('../lib/model.js');
var User = model.User;

passport.use(new LocalStrategy(function(username, password, done) {
  var query = {
    "username": username,
  };
  User.find(query, function(err, data) {
    if (err) {
      console.log(err);
      res.end('error')
    } else {
      if (data.length == 0) {
        return done(null, false);
      } else {
        if (passwordChecker.check(password, data[0].hash)) {
          return done(null, username);
        } else {
          return done(null, false);
        }
      }
    }
  });
}));

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/')
  } else {
    res.render('login', {
      title: 'Login',
      nextUrl: req.query.next,
      csrf: req.csrfToken()
    });
  }
});

router.post('/', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return res.redirect(req.get('referer'))
    }
    if (!user) {
      return res.redirect(req.get('referer'))
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.redirect(req.get('referer'))
      }

      req.session.username = req.body.username
      if (req.body.next) {
        res.redirect(req.body.next)
      } else {
        res.redirect('/')
      }
    })
  })(req, res, next)
})

module.exports = router;