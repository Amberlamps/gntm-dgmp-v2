'use strict';


/**
 * MODULES.
 */
var Comment = require('schemes').Comment;
var Event = require('schemes').Event;
var League = require('schemes').League;
var Membership = require('schemes').Membership;
var Post = require('schemes').Post;
var Playday = require('schemes').Playday;
var User = require('schemes').User;


/**
 * VARIABLES.
 */

var handlerLookup = {
  'league.new': leagueData,
  'member.new': membershipData,
  'member.delete': membershipData,
  'post.new': postData,
  'playday.new': playdayData,
  'comment.new': commentData,
  'user.new': userData
};


/**
 * FUNCTIONS.
 */
function membershipData(key, data, callback) {

  var selector = {
    _id: data.membershipId
  };

  Membership.findOne(selector).populate('league member').exec(prepareEvent);

  function prepareEvent(err, membership) {

    if (err) {
      return callback(err);
    }

    var variables = {
      leagueId: membership.league.id,
      leagueName: membership.league.name,
      memberName: membership.member.name
    };

    var eventData = {
      key: key,
      scope: ['all', membership.league.id],
      variables: variables
    };

    saveEvent(eventData, callback);

  }

}

function postData(key, data, callback) {

  var selector = {
    _id: data.postId
  };

  Post.findOne(selector).populate('league member').exec(prepareEvent);

  function prepareEvent(err, post) {

    if (err) {
      return callback(err);
    }

    var variables = {
      postId: post.id,
      leagueId: post.league.id,
      leagueName: post.league.name,
      memberName: post.member.name
    };

    var eventData = {
      key: key,
      scope: ['all', post.league.id],
      variables: variables
    };

    saveEvent(eventData, callback);

  }

}

function playdayData(key, data, callback) {

  var selector = {
    _id: data.playdaysId
  };

  Playday.findOne(selector).populate('league member').exec(prepareEvent);

  function prepareEvent(err, playday) {

    if (err) {
      return callback(err);
    }

    var variables = {
      playdaysId: playday.id,
      leagueId: playday.league.id,
      leagueName: playday.league.name,
      memberName: playday.member.name
    };

    var eventData = {
      key: key,
      scope: ['all', playday.league.id],
      variables: variables
    };

    saveEvent(eventData, callback);

  }

}

function commentData(key, data, callback) {

  var selector = {
    _id: data.commentId
  };

  Comment.findOne(selector).populate('league member post').exec(prepareEvent);

  function prepareEvent(err, comment) {

    if (err) {
      return callback(err);
    }

    var variables = {
      postId: comment.post.id,
      postTitle: comment.post.title,
      leagueId: comment.league.id,
      memberName: comment.member.name
    };

    var eventData = {
      key: key,
      scope: ['all', comment.league.id],
      variables: variables
    };

    saveEvent(eventData, callback);

  }

}

function userData(key, data, callback) {

  var selector = {
    _id: data.userId
  };

  User.findOne(selector).exec(prepareEvent);

  function prepareEvent(err, user) {

    if (err) {
      return callback(err);
    }

    var variables = {
      userName: user.name
    };

    var eventData = {
      key: key,
      scope: ['all'],
      variables: variables
    };

    saveEvent(eventData, callback);

  }

}

function leagueData(key, data, callback) {

  var selector = {
    _id: data.leagueId
  };

  League.findOne(selector).populate('founder').exec(prepareEvent);

  function prepareEvent(err, league) {

    if (err) {
      return callback(err);
    }

    var variables = {
      leagueId: league.id,
      leagueName: league.name,
      memberName: league.founder.name
    };

    var eventData = {
      key: key,
      scope: ['all', league.id],
      variables: variables
    };

    saveEvent(eventData, callback);

  }

}

function saveEvent(eventData, callback) {

  var eventDoc = new Event(eventData);

  eventDoc.save(callback);

}


function create(key, data, callback) {

  if (!handlerLookup.hasOwnProperty(key)) {
    throw new Error('No handler for key: ' + key);
  }

  handlerLookup[key](key, data, callback);

}


/**
 * EXPORTS.
 */
module.exports = {
  create: create
};