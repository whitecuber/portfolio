var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// routes
var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var logout = require('./routes/logout');
var signup = require('./routes/signup');
var page = require('./routes/page');
var item = require('./routes/item');
var folder = require('./routes/folder');

var app = express();
var passport = require('passport');
var session = require('express-session');
var multer = require('multer')
var csrf = require('csurf');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({ dest: '.' }).single('photo'))

// セッション設定
// req.sessionで呼び出せる
app.use(session({
  secret: 'hoge',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 60 * 1000 // 60分
  }
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
app.use(bodyParser.urlencoded({ extended: true }));
const csrfFuc = csrf();
app.use(function(req, res, next) {
  //無視するURI
  const ignoreUris = ['^\/page\/api\/upload\/?$']
  ignoreUris.forEach((ignoreUri) => {
    if (req.url.match(ignoreUri)) {
      //パターンマッチしたらそのまま処理を次へまわす。
      next();
      return;
    }
  })

  //パターンマッチしなかったら、CSRFの処理を通す。
  csrfFuc(req, res, next)
});

// routes
app.use('/', index);
app.use('/users', users);
app.use('/login', login);
app.use('/logout', logout);
app.use('/signup', signup);
app.use('/page', page);
app.use('/item', item);
app.use('/folder', folder);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;