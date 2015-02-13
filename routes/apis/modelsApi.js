'use strict';

/**
 * MODULES.
 */
var express = require('express');
var router = express.Router();
var Model = require('schemes').Model;
var authentication = require('middleware').authentication;
var validation = require('middleware').validation;
var patchModelsValidation = require('validations').patchModelsValidation;
var postModelsValidation = require('validations').postModelsValidation;
var putModelsValidation = require('validations').putModelsValidation;


/**
 * ROUTES.
 */

// GET
router.get('/:modelId',
  authentication(),
  getModel);

// GET
router.get('/',
  //authentication(),
  getModels);

// POST
router.post('/',
  //authentication('admin'),
  validation(postModelsValidation),
  postModels);

// PUT
router.put('/:modelId',
  //authentication('admin'),
  validation(putModelsValidation),
  putModels);

// PATCH
router.patch('/:modelId',
  //authentication('admin'),
  validation(patchModelsValidation),
  patchModels)

// DELETE
router.delete('/:modelId',
  //authentication('admin'),
  deleteModels);

/**
 * FUNCTIONS.
 */
function getModel(req, res, next) {

  var modelId = req.params.modelId;

  var selector = {
    _id: modelId
  };

  Model.findOne(selector, gotModels);

  function gotModel(err, model) {

    if (err) {
      return next(err);
    }

    res.json({
      model: model
    });

  }

}
function getModels(req, res, next) {

  Model.find({}, gotModels);

  function gotModels(err, models) {

    if (err) {
      return next(err);
    }

    res.json({
      models: models
    });

  }

}

function postModels(req, res, next) {

  var params = req.body;

  var model = new Model(params);

  model.save(savedModel);

  function savedModel(err, model) {

    if (err) {
      return next(err);
    }

    res.status(201).json({
      model: model
    });

  }

}

function putModels(req, res, next) {
  res.json(1);
}

function patchModels(req, res, next) {

  var modelId = req.params.modelId;

  var updates = req.body;

  var selector = {
    _id: modelId
  };

  var data = {
    $set: updates,
    $inc: {
      __v: 1
    }
  };

  Model.update(selector, data, updatedModel);

  function updatedModel(err, updated) {

    if (err) {
      return next(err);
    }

    res.json({
      updated: updated
    });

  }

}

function deleteModels(req, res, next) {

  var modelId = req.params.modelId;

  var selector = {
    _id: modelId
  };

  Model.remove(selector, removedModel);

  function removedModel(err, deleted) {

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