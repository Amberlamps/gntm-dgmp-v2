'use strict';

/**
 * MODULES.
 */
var express = require('express');
var router = express.Router();
var League = require('schemes').League;
var Membership = require('schemes').Membership;


/**
 * VARIABLES.
 */
var ALLOWED_PAGES = {
  index: 1,
  members: 1
};


/**
 * ROUTES.
 */
router.route('/add')
  .get(getLeaguesAddPage);

router.route('/:leagueId/:page?')
  .get(getLeaguePage);

router.route('/')
  .get(getLeaguesPage);


/**
 * FUNCTIONS.
 */
function getLeaguesPage(req, res, next) {

  League.find({}).sort({ sortname: 1 }).exec(writeResponse);

  function writeResponse(err, leagues) {

    if (err) {
      return next(err);
    }

    res.render('pages/leagues', {
      leagues: leagues
    });

  }

}

function getLeaguePage(req, res, next) {

  var leagueId = req.params.leagueId;
  var page = req.params.page;

  var selector = {
    _id: leagueId
  };

  League.findOne(selector, getPage);

  function getPage(err, league) {

    if (err) {
      return next(err);
    }

    if (!page || !ALLOWED_PAGES.hasOwnProperty(page)) {
      page = 'index';
    }

    if (page === 'index') {
      return getIndexPage(league);
    }

    if (page === 'members') {
      return getMembersPage(league);
    }

  }

  function getIndexPage(league) {
    res.render('pages/league/index', {
      league: league,
      page: page
    });
  }

  function getMembersPage(league) {

    var selector = {
      league: league._id.toString()
    };

    Membership.find(selector).populate('member').exec(writeResponse);

    function writeResponse(err, members) {

      if (err) {
        return next(err);
      }

      res.render('pages/league/members', {
        league: league,
        members: members,
        page: page
      });

    }

  }

}

function getLeaguesAddPage(req, res, next) {
  res.render('pages/leagues-add');
}


/**
 * EXPORTS.
 */
module.exports = router;