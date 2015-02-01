'use strict';

/**
 * MODULES.
 */
var express = require('express');
var router = express.Router();
var authentication = require('routes/middleware').authentication;
var validation = require('middleware').validation;
var patchMembershipsValidation = require('validations').patchMembershipsValidation;
var postMembershipsValidation = require('validations').postMembershipsValidation;
var putMembershipsValidation = require('validations').putMembershipsValidation;
var Membership = require('schemes').Membership;


/**
 * ROUTES.
 */

// GET
router.get('/:leagueId',
  authentication(),
  getMemberships);

// POST
router.post('/',
  authentication(),
  validation(postMembershipsValidation)
  postMemberships);

// PUT
router.put('/:membershipId',
  authentication(),
  validation(putMembershipsValidation),
  putMemberships);

// PATCH
router.patch('/:membershipId',
  authentication(),
  validation(patchMembershipsValidation),
  patchMemberships)

// DELETE
router.delete('/:membershipId',
  authentication(),
  deleteMemberships);


/**
 * FUNCTIONS.
 */
function getMemberships(req, res, next) {

  var leagueId = req.params.leagueId;

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
  params.member = req.session.user._id;

  var selector = {
    member: params.member,
    league: params.leagueId
  };

  Membership.findOne(selector, foundMembership);

  /**
   * Check whether user already has a membership
   * with given leagueId.
   */
  function foundMembership(err, membership) {

    if (err) {
      return next(err);
    }

    if (membership) {
      var error {};
      if (membership.status === 'granted') {
        error = new Error('You are already member of that league.');
      } else if (membership.status === 'requested') {
        error = new Error('There is already a request pending.');
      }
      error.status = 400;
      return next(error);
    }

    var newMembership = new Membership(params);
    newMembership.save(savedMembership);

  }

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

  var updates = req.body;

  var selector = {
    member: req.session.user.id,
    league: updates.leagueId
  };

  Membership.findOne(selector, foundMembership);

  function foundMembership(err, membership) {

    if (err) {
      return next(err);
    }

    if (membership.status !== 'admin') {
      var error = new Error('You are not allowed to update membership.');
      error.status = 403;
      return next(error);
    }

    var membershipId = req.params.membershipId;

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

  }

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

  Membership.findOne(selector, foundMembership);

  function foundMembership(err, membership) {

    if (err) {
      return next(err);
    }

    if (!membership) {
      var error = new Error('Membership Id not found.');
      error.status = 400;
      return next(error);
    }

    if (membership.member !== req.session.user.id) {
      var error = new Error('You are not allowed to delete membership.');
      error.status = 400;
      return next(error);
    }

    Membership.remove(selector, removedMembership);

  }


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