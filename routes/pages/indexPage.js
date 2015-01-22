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
    .get(getIndexPage);

  /**
   * FUNCTIONS.
   */
  function getIndexPage(req, res, next) {
    res.send('GNTM DGMP wird rechtzeitig zum Start der neuen Saison zurück sein!');
    //res.render('pages/index');
  }

  /**
   * EXPORTS.
   */
  module.exports = router;


}) ();