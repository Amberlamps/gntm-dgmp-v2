'use strict';

/**
 * MODULES.
 */
var express = require('express');
var router = express.Router();
var League = require('schemes').League;
var authentication = require('middleware').authentication;
var validation = require('middleware').validation;
var patchLeaguesValidation = require('validations').patchLeaguesValidation;
var postLeaguesValidation = require('validations').postLeaguesValidation;
var putLeaguesValidation = require('validations').putLeaguesValidation;
var Membership = require('schemes').Membership;
var Rulebook = require('schemes').Rulebook;


/**
 * ROUTES.
 */

// GET
router.get('/:leagueId',
  authentication(),
  getLeague);

router.get('/',
  authentication(),
  getLeagues);

// POST
router.post('/',
  authentication(),
  validation(postLeaguesValidation),
  postLeagues);

// PUT
router.put('/:leagueId',
  authentication(),
  validation(putLeaguesValidation),
  putLeagues);

// PATCH
router.patch('/:leagueId',
  authentication(),
  validation(patchLeaguesValidation),
  patchLeagues)

// DELETE
router.delete('/:leagueId',
  authentication(),
  deleteLeagues);

/**
 * FUNCTIONS.
 */
function getLeague(req, res, next) {

  var leagueId = req.params.leagueId;

  var selector = {
    _id: leagueId
  };

  League.findOne(selector, gotLeague);

  function gotLeague(err, league) {

    if (err) {
      return next(err);
    }

    res.json({
      league: league
    });

  }

}

function getLeagues(req, res, next) {

  var selector = {};

  League.find(selector, gotLeagues);

  function gotLeagues(err, league) {

    if (err) {
      return next(err);
    }

    res.json({
      leagues: leagues
    });

  }

}

function postLeagues(req, res, next) {

  var selector = {
    member: req.session.user.id,
    status: 'granted'
  };

  Membership.findOne(selector, foundMembership);

  function foundMembership(err, membership) {

    if (err) {
      return next(err);
    }

    if (membership) {
      var error = new Error('You are already member of a league.');
      error.status = 400;
      return next(error);
    }

    var params = req.body;

    params.founder = req.session.user.id;
    params.sortname = params.name.toLowerCase();

    var league = new League(params);

    league.save(savedLeague);

  }

  function savedLeague(err, league) {

    if (err) {
      return next(err);
    }

    var membership = new Membership({
      member: req.session.user.id,
      league: league.id,
      role: 'admin',
      status: 'granted'
    });

    membership.save(savedMembership);

    function savedMembership(err, membership) {

      if (err) {
        return next(err);
      }

      var rulebook = new Rulebook({
        league: league.id,
        active: true
      });

      rulebook.save(savedRulebook);

    }

    function savedRulebook(err, rulebook) {

      if (err) {
        return next(err);
      }

      res.status(201).json({
        league: league
      });

    }

  }

}

function putLeagues(req, res, next) {
  res.json(1);
}

function patchLeagues(req, res, next) {

  confirmAuthority(req, updateLeague);

  function updateLeague(err, membership) {

    if (err) {
      return next(err);
    }

    var updates = req.body;

    var selector = {
      _id: leagueId
    };

    var data = {
      $set: updates,
      $inc: {
        __v: 1
      }
    };

    League.update(selector, data, updatedLeague);

  }

  function updatedLeague(err, updated) {

    if (err) {
      return next(err);
    }

    res.json({
      updated: updated
    });

  }

}

function deleteLeagues(req, res, next) {

  confirmAuthority(req, removeLeague);

  function removeLeague(err, membership) {

    if (err) {
      return next(err);
    }

    var leagueId = req.params.leagueId;

    var selector = {
      _id: leagueId
    };

    League.remove(selector, removedLeague);

  }

  function removedLeague(err, deleted) {

    if (err) {
      return next(err);
    }

    res.json({
      deleted: deleted
    });

  }

}

function confirmAuthority(req, callback) {

  var selector = {
    member: req.session.user.id,
    league: req.params.leagueId
  };

  Membership.findOne(selector, foundMembership);

  function foundMembership(err, membership) {

    if (err) {
      return callback(err);
    }

    if (!membership) {
      var error = new Error('You are not member of this league.');
      error.status = 400;
      return callback(error);
    }

    if (membership.role !== 'admin') {
      var error = new Error('You are not authorized to update this league.');
      error.status = 403;
      return callback(error);
    }

    callback(null, membership);

  }

}

/**
 * EXPORTS.
 */
module.exports = router;