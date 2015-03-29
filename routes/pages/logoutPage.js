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
  .get(getLogoutPage);

/**
 * FUNCTIONS.
 */
function getLogoutPage(req, res, next) {

  req.session.destroy();

  if (req.xhr) {
    res.json({ message: 'Logout successful' });
  } else {
    res.redirect('/');
  }
}

/**
 * EXPORTS.
 */
module.exports = router;