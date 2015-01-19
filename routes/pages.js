(function() {

  'use strict';

  /**
  * MODULES.
   */
  var express = require('express');
  var router = express.Router();
  var indexPage = require('routes/pages/').indexPage;
  var loginPage = require('routes/pages/').loginPage;
  var logoutPage = require('routes/pages/').logoutPage;

  /**
   * ROUTES.
   */
  router.use('/', indexPage);
  router.use('/login', loginPage);
  router.use('/logout', logoutPage);

  /**
   * EXPORTS.
   */
  module.exports = router;


}) ();