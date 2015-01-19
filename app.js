var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var redis = require('redis');
var url = require('url');

var routes = require('routes/index.js');
var pkg = require('package.json');

var app = express();

var connection = url.parse(process.env.REDISCLOUD_URL);
connection.username = connection.auth.split(":")[0];
connection.password = connection.auth.split(":")[1];

var redisClient = redis.createClient(connection.port, connection.hostname, {
  no_ready_check: true
});
redisClient.auth(connection.password);

app.use(session({
  store: new RedisStore({
    client: redisClient
  }),
  resave: true,
  saveUninitialized: true,
  secret: 'gntm-dgmp ftw',
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false,
    maxAge: 5184000000
  }
}));

mongoose.connect(process.env.MONGOLAB_URI);

process.on('exit', function(err) {
  mongoose.connection.close();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function exposeLocals(req, res, next) {
  app.locals.pkg = pkg;
  next();

});

app.use(function(req, res, next) {

  if (app.get('env') === 'development') {
    app.locals.pretty = true;
  }

  app.locals.user = req.session.user || {};
  
  next();

});

app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    var errMessage = {
      message: err.message,
      error: err
    };
    if (req.xhr) {
      res.json(errMessage);
    } else {
      res.render('error', errMessage);
    }
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  var errMessage = {
    message: err.message,
    error: err
  };
  if (req.xhr) {
    res.json(errMessage);
  } else {
    res.render('error', errMessage);
  }
});


module.exports = app;
