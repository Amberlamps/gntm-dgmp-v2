'use strict';


/**
* MODULES.
 */
var express = require('express');
var router = express.Router();
var commentsApi = require('routes/apis/').commentsApi;
var eventsApi = require('routes/apis/').eventsApi;
var leaguesApi = require('routes/apis/').leaguesApi;
var membershipsApi = require('routes/apis/').membershipsApi;
var modelsApi = require('routes/apis/').modelsApi;
var playdaysApi = require('routes/apis/').playdaysApi;
var postsApi = require('routes/apis/').postsApi;
var roastersApi = require('routes/apis/').roastersApi;
var rulebooksApi = require('routes/apis/').rulebooksApi;
var usersApi = require('routes/apis/').usersApi;


/**
 * MIDDLEWARE.
 */
router.use('/:version', function validateVersionNumber(req, res, next) {
  next();
});


/**
 * ROUTES.
 */
router.use('/:version/comments', commentsApi);
router.use('/:version/events', eventsApi);
router.use('/:version/leagues', leaguesApi);
router.use('/:version/memberships', membershipsApi);
router.use('/:version/models', modelsApi);
router.use('/:version/playdays', playdaysApi);
router.use('/:version/posts', postsApi);
router.use('/:version/roasters', roastersApi);
router.use('/:version/rulebooks', rulebooksApi);
router.use('/:version/users', usersApi);


/**
 * EXPORTS.
 */
module.exports = router;