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


/**
 * ROUTES.
 */
router.use('/', indexPage);
router.use('/leagues', leaguesPage);
router.use('/live', livePage);
router.use('/login', loginPage);
router.use('/logout', logoutPage);
router.use('/models', modelsPage);


/**
 * EXPORTS.
 */
module.exports = router;