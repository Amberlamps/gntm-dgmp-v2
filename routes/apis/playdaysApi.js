'use strict';

/**
 * MODULES.
 */
var express = require('express');
var router = express.Router();
var Playday = require('schemes').Playday;
var authentication = require('middleware').authentication;
var validation = require('middleware').validation;
var patchPlaydaysValidation = require('validations').patchPlaydaysValidation;
var postPlaydaysValidation = require('validations').postPlaydaysValidation;
var putPlaydaysValidation = require('validations').putPlaydaysValidation;


/**
 * VARIABLES.
 */


/**
 * ROUTES.
 */

// GET
router.get('/:playdayId',
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
router.put('/:playdayId',
  authentication(),
  validation(putPlaydaysValidation),
  putPlaydays);

// PATCH
router.patch('/:playdayId',
  authentication(),
  validation(patchPlaydaysValidation),
  patchPlaydays)

// DELETE
router.delete('/:playdayId',
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

}

function putPlaydays(req, res, next) {
  res.json(1);
}

function patchPlaydays(req, res, next) {

  var playdayId = req.params.playdayId;

  var updates = req.body;

  var updateType = updates.updateType || 'set';
  var selector = updates.query || {};
  selector._id = playdayId;

  var data = {
    $inc: {
      __v: 1
    }
  };

  data['$' + updateType] = updates.data;

  Playday.update(selector, data, updatedPlayday);

  function updatedPlayday(err, updated) {

    if (err) {
      return next(err);
    }

    res.json({
      updated: updated
    });

  }

}

function deletePlaydays(req, res, next) {

}

/**
 * EXPORTS.
 */
module.exports = router;