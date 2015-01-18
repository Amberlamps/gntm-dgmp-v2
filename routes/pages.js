(function() {

  'use strict';

  /**
  * MODULES.
   */
  var express = require('express');
  var router = express.Router();
  var indexPage = require('./pages/').indexPage;

  /**
   * ROUTES.
   */
  router.use('/', indexPage);

  /**
   * EXPORTS.
   */
  module.exports = router;


}) ();