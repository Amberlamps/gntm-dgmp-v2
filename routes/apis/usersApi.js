(function () {

  'use strict';

  /**
   * MODULES.
   */
  var express = require('express');
  var router = express.Router();
  var User = require('schemes').User;


  /**
   * ROUTES.
   */
  router.route('/:userId?')
    .get(getUsers)
    .post(postUsers)
    .put(putUsers)
    .patch(patchUsers)
    .delete(deleteUsers);

  /**
   * FUNCTIONS.
   */
  function getUsers(req, res, next) {

    var userId = req.params.userId;

    var selector = {
      _id: userId
    };

    User.findOne(selector, gotUser);

    function gotUser(err, user) {

      if (err) {
        return next(err);
      }

      res.json({
        user: user
      });

    }

  }

  function postUsers(req, res, next) {

    var params = req.body;

    if (params.password !== params.passwordwdh) {
      var err = new Error('Die Passwortwiederholung stimmt nicht überein');
      err.status = 400;
      return next(err);
    }

    var user = new User(params);
    user.setPassword(params.password);
    user.save(savedUser);

    function savedUser(err, user) {

      if (err) {
        return next(err);
      }

      req.session.user = user;

      res.status(201).json({
        user: user
      });

    }

  }

  function putUsers(req, res, next) {
    res.json(1);
  }

  function patchUsers(req, res, next) {

    var userId = req.params.userId;

    var updates = req.body;

    var selector = {
      _id: userId
    };

    var data = {
      $set: updates,
      $inc: {
        __v: 1
      }
    };

    User.update(selector, data, updatedUser);

    function updatedUser(err, updated) {

      if (err) {
        return next(err);
      }

      res.json({
        updated: updated
      });

    }

  }

  function deleteUsers(req, res, next) {

    var userId = req.params.userId;

    var selector = {
      _id: userId
    };

    User.remove(selector, removedUser);

    function removedUser(err, deleted) {

      if (err) {
        return next(err);
      }

      res.json({
        deleted: deleted
      });

    }

  }

  /**
   * EXPORTS.
   */
  module.exports = router;


}) ();