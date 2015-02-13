'use strict';

/**
 * MODULES.
 */
var express = require('express');
var router = express.Router();
var Model = require('schemes').Model;


/**
 * VARIABLES.
 */


/**
 * ROUTES.
 */
router.route('/')
  .get(getLivePage);


/**
 * FUNCTIONS.
 */
function getLivePage(req, res, next) {

  var selector = {
    eliminated: {
      $exists: false
    }
  };
  
  Model.find(selector).sort({ displayname: 1 }).exec(getModels);

  function getModels(err, models) {

    if (err) {
      return next(err);
    }

    res.render('pages/live/live', {
      models: models
    });

  }


}


/**
 * EXPORTS.
 */
module.exports = router;