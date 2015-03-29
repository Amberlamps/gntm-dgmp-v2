'use strict';


/**
* MODULES.
 */
var express = require('express');
var router = express.Router();
var indexPage = require('routes/pages/').indexPage;
var leaguesPage = require('routes/pages/').leaguesPage;
var livePage = require('routes/pages/').livePage;
var loginPage = require('routes/pages/').loginPage;
var logoutPage = require('routes/pages/').logoutPage;
var modelsPage = require('routes/pages/').modelsPage;
var playdaysPage = require('routes/pages/').playdaysPage;
var rulebooksPage = require('routes/pages/').rulebooksPage;

var Membership = require('schemes').Membership;


/**
 * ROUTES.
 */
router.use(checkForLeague);
router.use('/', indexPage);
router.use('/leagues', leaguesPage);
router.use('/live', livePage);
router.use('/login', loginPage);
router.use('/logout', logoutPage);
router.use('/models', modelsPage);
router.use('/rulebooks', rulebooksPage);


/**
 * FUNCTIONS.
 */
function checkForLeague(req, res, next) {

  if (!req.session.user) {
    return next();
  }

  var selector = {
    member: req.session.user.id,
    role: 'admin'
  };

  Membership.findOne(selector, writeResponse);

  function writeResponse(err, membership) {

    if (err) {
      return next(err);
    }

    req.session.user.league = (membership) ? membership.league : null;

    next();

  }

}


/**
 * EXPORTS.
 */
module.exports = router;