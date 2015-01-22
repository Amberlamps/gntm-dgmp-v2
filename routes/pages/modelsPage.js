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
    .get(getModelsPage);

  /**
   * FUNCTIONS.
   */
  function getModelsPage(req, res, next) {
    res.render('pages/models');
  }

  /**
   * EXPORTS.
   */
  module.exports = router;


}) ();