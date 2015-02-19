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
  members: 1,
  roaster: 1
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

  League.find({}).sort({ sortname: 1 }).exec(checkIfMember);

  function checkIfMember(err, leagues) {

    var selector = {
      member: req.session.user.id
    };

    Membership.findOne(selector, writeResponse);

    function writeResponse(err, membership) {

      if (err) {
        return next(err);
      }

      res.render('pages/leagues', {
        leagues: leagues,
        canCreateLeague: !Boolean(membership)
      });

    }

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

    if (page === 'roaster') {
      return getRoasterPage(league);
    }

  }

  function getIndexPage(league) {

    var selector = {
      member: req.session.user.id
    };

    Membership.findOne(selector, foundMembership);

    function foundMembership(err, membership) {

      if (err) {
        return next(err);
      }

      var hasLeague = Boolean(membership);

      res.render('pages/league/index', {
        league: league,
        page: page,
        isWithoutLeague: !hasLeague
      });

    }

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

      var isAdmin = members.filter(function(member) {
        return member.member.id === req.session.user.id && member.role === 'admin';
      });

      res.render('pages/league/members', {
        league: league,
        members: members,
        page: page,
        isAdmin: isAdmin.length === 1
      });

    }

  }

  function getRoasterPage(league) {

    res.render('pages/league/roaster', {
      league: league,
      page: page
    });

  }

}

function getLeaguesAddPage(req, res, next) {
  res.render('pages/leagues-add');
}


/**
 * EXPORTS.
 */
module.exports = router;