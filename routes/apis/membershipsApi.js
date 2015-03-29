'use strict';

/**
 * MODULES.
 */
var express = require('express');
var router = express.Router();
var authentication = require('middleware').authentication;
var validation = require('middleware').validation;
var patchMembershipsValidation = require('validations').patchMembershipsValidation;
var postMembershipsValidation = require('validations').postMembershipsValidation;
var putMembershipsValidation = require('validations').putMembershipsValidation;
var events = require('routes/modules').events;
var League = require('schemes').League;
var Membership = require('schemes').Membership;
var User = require('schemes').User;


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
  validation(postMembershipsValidation),
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
  params.member = req.session.user.id;

  var selector = {
    member: params.member,
    league: params.league
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
      var error = {};
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

    if (membership.role !== 'admin') {
      var error = new Error('You are not allowed to update membership.');
      error.status = 403;
      return next(error);
    }

    var membershipId = req.params.membershipId;

    var selector = {
      _id: membershipId
    };

    updates._modifiedOn = Date.now();

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

    countMembers(updates.leagueId, createEvent);

  }

  function createEvent(err, updated) {

    if (err) {
      return next(err);
    }

    if (updates.status !== 'granted') {
      return writeResponse(err, updated);
    }

    events.create('member.new', {
      membershipId: req.params.membershipId
    }, writeResponse);

  }

  function writeResponse(err, updated) {

    if (err) {
      return next(err);
    }

    res.json({
      updated: updated
    });

  }

}

function countMembers(leagueId, callback) {

  var selector = {
    league: leagueId,
    status: 'granted'
  };

  Membership.find(selector, updateLeague);

  function updateLeague(err, memberships) {

    if (err) {
      return callback(err);
    }

    var selector = {
      _id: leagueId
    };

    var data = {
      $set: {
        members: memberships.length
      }
    };

    League.update(selector, data, callback);

  }

}

function deleteMemberships(req, res, next) {

  var membershipId = req.params.membershipId;
  var leagueId = req.body.leagueId;
  var memberId = req.body.memberId;

  var selector = {
    $or: [{
      member: req.session.user.id,
      league: leagueId,
      role: 'admin'
    }, {
      _id: membershipId,
      member: req.session.user.id,
      league: leagueId      
    }]
  };

  Membership.findOne(selector, checkPermission);

  function checkPermission(err, membership) {

    if (err) {
      return next(err);
    }

    if (!membership) {
      var error = new Error('You are not allowed to delete membership.');
      error.status = 400;
      return next(error);      
    }

    if (!memberId) {
      return removeMembership();
    }

    var selector = {
      _id: memberId
    };

    var data = {
      $set: {
        roaster: []
      }
    };

    User.update(selector, data, createEvent);

    function createEvent(err, updated) {

      if (err) {
        return next(err);
      }

      if (membership.status !== 'granted') {
        return removeMembership(err, updated);
      }

      events.create('member.delete', {
        membershipId: membershipId
      }, removeMembership);

    }

    function removeMembership(err, updated) {

      if (err) {
        return next(err);
      }

      var selector = {
        _id: membershipId,
        league: leagueId
      };

      Membership.remove(selector, removedMembership);

      function removedMembership(err, deleted) {

        if (err) {
          return next(err);
        }

        countMembers(leagueId, writeResponse);

      }

    }

  }

  function writeResponse(err, updated) {

    if (err) {
      return next(err);
    }

    res.json({
      deleted: 1
    });

  }

}

/**
 * EXPORTS.
 */
module.exports = router;