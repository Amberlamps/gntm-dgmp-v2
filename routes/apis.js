(function() {

  'use strict';

  /**
  * MODULES.
   */
  var express = require('express');
  var router = express.Router();
  var usersApi = require('./apis/').usersApi;
  var rulesApi = require('./apis/').rulesApi;

  /**
   * MIDDLEWARE.
   */
  router.use('/:version', function(req, res, next) {
    next();
  });

  /**
   * ROUTES.
   */
  router.use('/:version/users', usersApi);
  router.use('/:version/rules', rulesApi);

  /**
   * EXPORTS.
   */
  module.exports = router;


}) ();