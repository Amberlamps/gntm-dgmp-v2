(function () {

  'use strict';

  /**
   * MODULES.
   */
  var express = require('express');
  var router = express.Router();
  var Model = require('schemes').Model;


  /**
   * ROUTES.
   */
  router.route('/:modelId?')
    .get(getModels)
    .post(postModels)
    .put(putModels)
    .patch(patchModels)
    .delete(deleteModels);

  /**
   * FUNCTIONS.
   */
  function getModels(req, res, next) {

    var modelId = req.params.modelId;

    if (modelId) {
      var selector = {
        _id: modelId
      };
      Model.findOne(selector, gotModels);
    } else {
      Model.find({}, gotModels);
    }

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


}) ();