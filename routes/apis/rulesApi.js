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
    .get(getRules)
    .post(postRules)
    .put(putRules)
    .patch(patchRules)
    .delete(deleteRules);

  /**
   * FUNCTIONS.
   */
  function getRules(req, res, next) {
    res.json(1);
  }

  function postRules(req, res, next) {
    res.json(1);
  }

  function putRules(req, res, next) {
    res.json(1);
  }

  function patchRules(req, res, next) {
    res.json(1);
  }

  function deleteRules(req, res, next) {
    res.json(1);
  }

  /**
   * EXPORTS.
   */
  module.exports = router;


}) ();