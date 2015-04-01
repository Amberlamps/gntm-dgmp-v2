'use strict';

/**
 * MODULES.
 */
var express = require('express');
var router = express.Router();
var Playday = require('schemes').Playday;
var Membership = require('schemes').Membership;
var League = require('schemes').League;
var authentication = require('middleware').authentication;
var validation = require('middleware').validation;
var patchPlaydaysValidation = require('validations').patchPlaydaysValidation;
var postPlaydaysValidation = require('validations').postPlaydaysValidation;
var putPlaydaysValidation = require('validations').putPlaydaysValidation;
var moment = require("moment");
var events = require('routes/modules').events;


/**
 * VARIABLES.
 */


/**
 * ROUTES.
 */

// GET
router.get('/:playdaysId',
  authentication(),
  getPlayday);

// GET
router.get('/',
  authentication(),
  getPlaydays);

// POST
router.post('/',
  authentication(),
  validation(postPlaydaysValidation),
  postPlaydays);

// PUT
router.put('/:playdaysId',
  authentication(),
  validation(putPlaydaysValidation),
  putPlaydays);

// PATCH
router.patch('/:playdaysId',
  authentication(),
  validation(patchPlaydaysValidation),
  patchPlaydays)

// DELETE
router.delete('/:playdaysId',
  authentication(),
  deletePlaydays);


/**
 * FUNCTIONS.
 */
function getPlayday(req, res, next) {

}

function getPlaydays(req, res, next) {

}

function postPlaydays(req, res, next) {

  var data = req.body;

  var selector = {
    member: req.session.user.id,
    league: data.league
  };

  Membership.findOne(selector, checkPermission);

  function checkPermission(err, membership) {

    if (err) {
      return next(err);
    }

    if (!membership) {
      var error = new Error('Not member of league');
      error.status = 400;
      return next(error);
    }

    if (membership.role !== 'admin') {
      var error = new Error('You have no permission to create post');
      error.status = 400;
      return next(error);
    }

    data.member = req.session.user.id;

    var datum = data.startDate.split(".");
    if (datum.length !== 3) {
      var error = new Error("Invalid date.");
      error.status = 400;
      return next(error);
    }

    data.startDate = moment(datum[1] + '.' + datum[0] + '.' + datum[2])._d;

    var playday = new Playday(data);

    playday.save(savedPlayday);

  }

  function savedPlayday(err, playday) {

    if (err) {
      return next(err);
    }

    events.create('playday.new', {
      playdaysId: playday.id
    }, updateLeague);

    function updateLeague(err) {

      if (err) {
        return next(err);
      }

      League.update({ _id: data.league }, { $inc: { playdays: 1 } }, writeResponse);

    }

    function writeResponse(err) {

      if (err) {
        return next(err);
      }

      res.json({
        playday: playday
      });

    }

  }

}

function putPlaydays(req, res, next) {
  res.json(1);
}

function patchPlaydays(req, res, next) {

  var playdaysId = req.params.playdaysId;
  var data = req.body;
  var response = {};

  var datum = data.startDate.split(".");
  if (datum.length !== 3) {
    var error = new Error("Invalid date.");
    error.status = 400;
    return next(error);
  }

  data.startDate = moment(datum[1] + '.' + datum[0] + '.' + datum[2])._d;

  var selector = {
    _id: playdaysId
  };

  Playday.findOne(selector, processPlayday);

  function processPlayday(err, playday) {

    if (err) {
      return next(err);
    }

    if (!playday) {
      var error = new Error('Cannot find playday with given id.');
      error.status = 400;
      return next(error);
    }

    response.playday = playday;

    data._modifiedOn = new Date();

    Playday.update(selector, { $set: data }, writeResponse);

  }

  function writeResponse(err, updated) {

    if (err) {
      return next(err);
    }

    response.updated = updated;

    res.json(response);

  }

}

function deletePlaydays(req, res, next) {

  var playdaysId = req.params.playdaysId;

  var selector = {
    _id: playdaysId
  };

  Playday.findOneAndRemove(selector, removedPlayday);

  function removedPlayday(err, playday) {

    if (err) {
      return next(err);
    }

    if (!playday) {
      var error = new Error("Cannot find playday with given id.");
      error.status = 400;
      return next(error);
    }

    var selector = {
      _id: playday.league
    };

    League.update(selector, { $inc: { playdays: -1 } }, writeResponse);

  }

  function writeResponse(err, updated) {

    if (err) {
      return next(err);
    }

    res.json({
      removed: 1
    });
    
  }

}

/**
 * EXPORTS.
 */
module.exports = router;