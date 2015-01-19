(function() {

  'use strict';

  /**
   * MODULES.
   */
  var express = require('express');
  var router = express.Router();
  var apis = require('routes/apis.js');
  var pages = require('routes/pages.js');


  /**
   * ROUTES.
   */
  router.use('/api', apis)
  router.use('/', pages);

  module.exports = router;

}) ();