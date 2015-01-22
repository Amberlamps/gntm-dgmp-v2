(function () {

  'use strict';

  /**
   * MODULES.
   */
  var express = require('express');
  var router = express.Router();


  /**
   * ROUTES.
   */
  router.route('/')
    .get(getLeaguesPage);

  /**
   * FUNCTIONS.
   */
  function getLeaguesPage(req, res, next) {
    res.render('pages/leagues');
  }

  /**
   * EXPORTS.
   */
  module.exports = router;


}) ();