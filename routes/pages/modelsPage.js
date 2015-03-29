'use strict';

/**
 * MODULES.
 */
var express = require('express');
var router = express.Router();
var Model = require('schemes').Model;
var moment = require('moment');


/**
 * ROUTES.
 */
router.route('/')
  .get(getModelsPage);

/**
 * FUNCTIONS.
 */
function getModelsPage(req, res, next) {

  Model.find({}).sort({ eliminated: 1, displayname: 1}).exec(renderModels);

  function renderModels(err, models) {

    if (err) {
      return next(err);
    }

    models.forEach(function alterModel(model) {
      model.jobs = 0;
      model.drinks = 0;
    });

    res.render('pages/models', {
      models: models
    });

  }

}

/**
 * EXPORTS.
 */
module.exports = router;