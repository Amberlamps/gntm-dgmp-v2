(function () {

  'use strict';

  /**
   * MODULES.
   */
  var express = require('express');
  var router = express.Router();
  var Membership = require('schemes').Membership;


  /**
   * ROUTES.
   */
  router.route('/:membershipId?')
    .get(getMemberships)
    .post(postMemberships)
    .put(putMemberships)
    .patch(patchMemberships)
    .delete(deleteMemberships);

  var userId = '54bbce527de5dfcc20141eb7';

  /**
   * FUNCTIONS.
   */
  function getMemberships(req, res, next) {

    var leagueId = req.query.leagueId;

    var selector = {
      league: leagueId
    };

    Membership.find(selector).populate('member').exec(gotMemberships);

    function gotMemberships(err, memberships) {

      if (err) {
        return next(err);
      }

      res.json({
        memberships: memberships
      });

    }

  }

  function postMemberships(req, res, next) {

    var params = req.body;
 
    params.member = userId;

    var membership = new Membership(params);

    membership.save(savedMembership);

    function savedMembership(err, membership) {

      if (err) {
        return next(err);
      }

      res.status(201).json({
        membership: membership
      });

    }

  }

  function putMemberships(req, res, next) {
    res.json(1);
  }

  function patchMemberships(req, res, next) {

    var membershipId = req.params.membershipId;

    var updates = req.body;

    var selector = {
      _id: membershipId
    };

    var data = {
      $set: updates,
      $inc: {
        __v: 1
      }
    };

    Membership.update(selector, data, updatedMembership);

    function updatedMembership(err, updated) {

      if (err) {
        return next(err);
      }

      res.json({
        updated: updated
      });

    }

  }

  function deleteMemberships(req, res, next) {

    var membershipId = req.params.membershipId;

    var selector = {
      _id: membershipId
    };

    Membership.remove(selector, removedMembership);

    function removedMembership(err, deleted) {

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