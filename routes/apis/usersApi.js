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
    .get(getUsers)
    .post(postUsers)
    .put(putUsers)
    .patch(patchUsers)
    .delete(deleteUsers);

  /**
   * FUNCTIONS.
   */
  function getUsers(req, res, next) {
    res.json(1);
  }

  function postUsers(req, res, next) {
    res.json(1);
  }

  function putUsers(req, res, next) {
    res.json(1);
  }

  function patchUsers(req, res, next) {
    res.json(1);
  }

  function deleteUsers(req, res, next) {
    res.json(1);
  }

  /**
   * EXPORTS.
   */
  module.exports = router;


}) ();