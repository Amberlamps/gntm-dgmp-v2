'use strict';

/**
 * MODULES.
 */
var express = require('express');
var router = express.Router();
var Membership = require('schemes').Membership;
var User = require('schemes').User;
var authentication = require('middleware').authentication;
var validation = require('middleware').validation;


/**
 * ROUTES.
 */

// PATCH
router.patch('/:from/:to',
  authentication(),
  patchRoasters)


/**
 * FUNCTIONS.
 */
function patchRoasters(req, res, next) {

  var from = req.params.from;
  var to = req.params.to;
  var modelId = req.body.model;
  var leagueId = req.body.league;

  var selector = {
    member: req.session.user.id,
    league: leagueId
  };

  Membership.findOne(selector, checkPermission);

  function checkPermission(err, membership) {

    if (err) {
      return next(err);
    }

    if (!membership) {
      var error = new Error('Cannot find membership');
      error.status = 400;
      return next(error);
    }

    if (membership.role !== 'admin') {
      var error = new Error('You are not allowed to update roaster');
      error.status = 400;
      return next(error);      
    }

    removeModel();

  }

  function removeModel() {

    if (from === 'market') {
      return addModel();
    }

    var selector = {
      _id: from
    };

    var data = {
      $pull: {
        roaster: modelId
      }
    };

    User.update(selector, data, addModel);

  }

  function addModel(err) {

    if (err) {
      return next(err);
    }

    if (to === 'market') {
      return writeResponse();
    }

    var selector = {
      _id: to
    };

    var data = {
      $push: {
        roaster: modelId
      }
    };

    User.update(selector, data, writeResponse);

  }

  function writeResponse(err) {

    if (err) {
      return next(err);
    }

    res.json({
      updated: 1
    });

  }

}


/**
 * EXPORTS.
 */
module.exports = router;