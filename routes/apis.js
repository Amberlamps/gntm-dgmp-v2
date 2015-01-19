(function() {

  'use strict';

  /**
  * MODULES.
   */
  var express = require('express');
  var router = express.Router();
  var leaguesApi = require('routes/apis/').leaguesApi;
  var membershipsApi = require('routes/apis/').membershipsApi;
  var modelsApi = require('routes/apis/').modelsApi;
  var rulebooksApi = require('routes/apis/').rulebooksApi;
  var usersApi = require('routes/apis/').usersApi;

  /**
   * MIDDLEWARE.
   */
  router.use('/:version', function(req, res, next) {
    next();
  });

  /**
   * ROUTES.
   */
  router.use('/:version/leagues', leaguesApi);
  router.use('/:version/memberships', membershipsApi);
  router.use('/:version/models', modelsApi);
  router.use('/:version/rulebooks', rulebooksApi);
  router.use('/:version/users', usersApi);

  /**
   * EXPORTS.
   */
  module.exports = router;


}) ();