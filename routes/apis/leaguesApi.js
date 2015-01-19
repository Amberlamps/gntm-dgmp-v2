(function () {

  'use strict';

  /**
   * MODULES.
   */
  var express = require('express');
  var router = express.Router();
  var League = require('schemes').League;
  var Membership = require('schemes').Membership;


  /**
   * ROUTES.
   */
  router.route('/:leagueId?')
    .get(getLeagues)
    .post(postLeagues)
    .put(putLeagues)
    .patch(patchLeagues)
    .delete(deleteLeagues);

  /**
   * FUNCTIONS.
   */
  function getLeagues(req, res, next) {

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

  function postLeagues(req, res, next) {

    var userId = '54bbce527de5dfcc20141eb7';

    var params = req.body;

    params.founder = userId;

    var league = new League(params);

    league.save(savedLeague);

    function savedLeague(err, league) {

      if (err) {
        return next(err);
      }

      var membership = new Membership({
        member: userId,
        league: league.id,
        role: 'admin',
        status: 'granted'
      });

      membership.save(function(err, membership) {

        if (err) {
          return next(err);
        }

        res.status(201).json({
          league: league
        });

      });

    }

  }

  function putLeagues(req, res, next) {
    res.json(1);
  }

  function patchLeagues(req, res, next) {

    var leagueId = req.params.leagueId;

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

    var leagueId = req.params.leagueId;

    var selector = {
      _id: leagueId
    };

    League.remove(selector, removedLeague);

    function removedLeague(err, deleted) {

      if (err) {
        return next(err);
      }

      res.json({
        deleted: deleted
      });

    }

  }

  /**
   * EXPORTS.
   */
  module.exports = router;


}) ();