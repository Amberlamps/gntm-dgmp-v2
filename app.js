/**
 * Germany's Next Topmodel - Drinking Game Manager Professional.
 *
 * @author: Amberlamps <alexander.behrens.84@gmail.com>
 */


/**
 * MODULES.
 */
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var routes = require('routes/index.js');
var errorHandler = require('middleware').errorHandler;
var sessionHandler = require('middleware').sessionHandler;
var exposeLocals = require('middleware').exposeLocals;


/**
 * VARIABLES.
 */
var app = express();


/**
 * SETTINGS.
 */
app.use(sessionHandler);

mongoose.connect(process.env.MONGOLAB_URI);

process.on('exit', function(err) {
  mongoose.connection.close();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(exposeLocals(app));

app.use('/', routes);

app.use(errorHandler.pageNotFound);

if (app.get('env') === 'development') {
  app.use(errorHandler.development);
} else {
  app.use(errorHandler.production);
}


/**
 * EXPORTS.
 */
module.exports = app;