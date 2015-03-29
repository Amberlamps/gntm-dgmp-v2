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
  .get(getPlaydaysPage);

/**
 * FUNCTIONS.
 */
function getPlaydaysPage(req, res, next) {

  res.render('pages/playdays');

}

/**
 * EXPORTS.
 */
module.exports = router;