/**
 * Middleware to manage and handle sessions.
 *
 * @author Amberlamps <alexander.behrens.84@gmail.com>
 */


/**
 * MODULES.
 */
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var redis = require('redis');
var url = require('url');


/**
 * MAIN.
 */
var connection = url.parse(process.env.REDISCLOUD_URL);
connection.username = connection.auth.split(":")[0];
connection.password = connection.auth.split(":")[1];

var redisClient = redis.createClient(connection.port, connection.hostname, {
  no_ready_check: true
});
redisClient.auth(connection.password);

var sessionHandler = session({
  store: new RedisStore({
    client: redisClient
  }),
  resave: false,
  saveUninitialized: true,
  secret: 'gntm-dgmp ftw',
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false,
    maxAge: 5184000000
  }
});


/**
 * EXPORTS.
 */
module.exports = sessionHandler;