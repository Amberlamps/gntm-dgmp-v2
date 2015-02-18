'use strict';

/**
 * MODULES.
 */
var express = require('express');
var router = express.Router();
var Membership = require('schemes').Membership;
var Model = require('schemes').Model;
var Playday = require('schemes').Playday;
var Rulebook = require('schemes').Rulebook;
var authentication = require('middleware').authentication;


/**
 * VARIABLES.
 */


/**
 * ROUTES.
 */
router.route('/')
  .all(authentication())
  .get(getLivePage);


/**
 * FUNCTIONS.
 */
function getLivePage(req, res, next) {

  var selector = {
    member: req.session.user.id,
    role: 'admin' 
  };

  Membership.findOne(selector, getMembership);

  function getMembership(err, membership) {

    if (err) {
      return next(err);
    }

    if (!membership) {
      var error = new Error('You are not admin of a league.');
      error.status = 400;
      return next(error);
    }

    getPlayday(membership.league);

  }

  function getPlayday(league) {

    var selector = {
      league: league,
      startDate: {
        $exists: true
      },
      endDate: {
        $exists: false
      }
    };

    req.league = league;

    Playday.findOne(selector).populate('models.model rulebook').exec(checkPlayday);

  }

  function checkPlayday(err, playday) {

    if (err) {
      return next(err);
    }

    if (!playday) {
      return createPlayday();
    }

    renderPlayday(playday);

  }

  function createPlayday() {

    var playday = {
      league: req.league
    };

    var selector = {
      eliminated: {
        $exists: false
      }
    };
  
    Model.find(selector, getModels);

    function getModels(err, models) {

      if (err) {
        return next(err);
      }

      playday.models = models.map(function getModelIds(model) {
        return {
          model: model.id
        };
      });

      var selector = {
        league: req.league,
        active: true
      };

      Rulebook.findOne(selector, getRulebook);

    }

    function getRulebook(err, rulebook) {

      if (err) {
        return next(err);
      }

      playday.rulebook = rulebook.id;

      playday = new Playday(playday);

      playday.save(savedPlayday);

    }

    function savedPlayday(err, playday) {

      if (err) {
        return next(err);
      }

      getPlayday(playday.league);

    }

  }

  function renderPlayday(playday) {

    playday.models.sort(function sortModels(a, b) {
      a = a.model.displayname;
      b = b.model.displayname;
      if (a > b) {
        return 1;
      } else if (a < b) {
        return -1;
      } else {
        return 0;
      }
    });

    console.log(playday);

    res.render('pages/live/live', {
      playday: playday
    });

  }

  var selector = {
    eliminated: {
      $exists: false
    }
  };

}


/**
 * EXPORTS.
 */
module.exports = router;