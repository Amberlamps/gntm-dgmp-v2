'use strict';

/**
 * MODULES.
 */
var express = require('express');
var router = express.Router();
var Comment = require('schemes').Comment;
var Event = require('schemes').Event;
var League = require('schemes').League;
var Membership = require('schemes').Membership;
var Model = require('schemes').Model;
var Post = require('schemes').Post;
var Playday = require('schemes').Playday;


/**
 * VARIABLES.
 */
var ALLOWED_PAGES = {
  index: 1,
  members: 1,
  roaster: 1,
  posts: 1,
  rulebooks: 1,
  playdays: 1,
  tables: 1
};


/**
 * ROUTES.
 */
router.route('/add')
  .get(getLeaguesAddPage);

router.route('/:leagueId/index/:postId')
  .get(getIndexPage);

router.route('/:leagueId/posts/:postId?')
  .get(getPostsPage);

router.route('/:leagueId/playdays/:playdaysId?')
  .get(getPlaydaysPage);

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

    if (!req.session.user) {
      return writeResponse(null, true);
    }

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
        canCreateLeague: !membership
      });

    }

  }

}

function getIndexPage(req, res, next) {

  var leagueId = req.params.leagueId;

  var response = {
    page: 'index'
  };

  var selector = {
    _id: leagueId
  };

  League.findOne(selector, prepareLeague);

  function prepareLeague(err, league) {

    if (err) {
      return next(err);
    }

    if (!league) {
      var error = new Error('Cannot find league with given id.');
      error.status = 404;
      return next(error);
    }

    response.league = league;

    getPosts();

  }

  function getPosts() {

    var selector = {
      league: leagueId
    };

    Post.find(selector).sort({ _id: -1 }).exec(getCurrentPost);

  }

  function getCurrentPost(err, posts) {

    if (err) {
      return next(err);
    }

    if (!posts || posts.length === 0) {
      return getEvents();
    }

    var postId = req.params.postId || posts[0].id;

    response.postPosition = posts.map(function(post) {
      return post.id;
    }).indexOf(postId);
    response.postCount = posts.length;

    if (response.postPosition !== 0) {
      response.postPrevious = posts[response.postPosition-1].id;
    }

    if (response.postPosition !== posts.length-1) {
      response.postNext = posts[response.postPosition+1].id;      
    }

    Post.findOne({ _id: postId }).populate('member').exec(preparePost);

  }

  function preparePost(err, post) {

    if (err) {
      return next(err);
    }

    if (!post) {
      var error = new Error("Cannot find post with given id.");
      error.status = 500;
      return next(error);
    }

    response.post = post;

    getComments();

  }

  function getComments(err, membership) {

    if (err) {
      return next(err);
    }

    var selector = {
      post: response.post.id
    };

    Comment.find(selector).populate('league member').sort({ _createdOn: -1 }).exec(renderComments);

  }

  function renderComments(err, comments) {

    if (err) {
      return next(err);
    }

    response.comments = comments;

    getEvents();

  }

  function getEvents() {

    Event.find({ scope: leagueId }).sort({ _id: -1 }).limit(20).exec(renderEvents);

  }

  function renderEvents(err, events) {

    if (err) {
      return next(err);
    }

    response.events = events;

    if (!req.session.user) {
      return writeResponse(null, false);
    }

    var selector = {
      member: req.session.user.id
    };

    Membership.findOne(selector, writeResponse);

  }

  function writeResponse(err, membership) {

    if (err) {
      return next(err);
    }

    if (!membership) {
      response.isWithoutLeague = true;
      response.isAdmin = false;
    } else {
      response.isWithoutLeague = !membership;
      response.isAdmin = membership.league.toString() === leagueId && membership.role === 'admin';
    }

    res.render('pages/league/index', response);

  }

}

function getLeaguePage(req, res, next) {

  var leagueId = req.params.leagueId;
  var page = req.params.page;

  if (!page || !ALLOWED_PAGES.hasOwnProperty(page)) {
    page = 'index';
  }

  if (page === 'index') {
    return getIndexPage(req, res, next);
  }

  var selector = {
    _id: leagueId
  };

  League.findOne(selector, getPage);

  function getPage(err, league) {

    if (err) {
      return next(err);
    }

    if (!league) {
      var error = new Error('Cannot find league with given id.');
      error.status = 404;
      return next(error);
    }

    if (page === 'members') {
      return getMembersPage(league);
    }

    if (page === 'rulebooks') {
      return getRulebookPage(league);
    }

    if (page === 'roaster') {
      return getRoasterPage(league);
    }

    if (page === 'posts') {
      return getPostPage(league);
    }

    if (page === 'playdays') {
      return getPlaydaysPage(league);
    }

    if (page === 'tables') {
      return getTablesPage(league);
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
        return req.session.user && member.member.id === req.session.user.id && member.role === 'admin';
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

    Model.find({}).sort({ eliminated: 1, displayname: 1}).exec(renderModels);

    function renderModels(err, models) {

      var selector = {
        league: league._id.toString(),
        status: 'granted'
      };

      Membership.find(selector).populate('member').exec(writeResponse);

      function writeResponse(err, members) {

        var isAdmin = members.filter(function(member) {
          return req.session.user && member.member.id === req.session.user.id && member.role === 'admin';
        });

        res.render('pages/league/roaster', {
          league: league,
          page: page,
          models: models,
          members: members,
          isAdmin: isAdmin.length === 1
        });

      }

    }

  }

  function getRulebookPage(league) {

    res.render('pages/league/rulebooks', {
      league: league,
      page: page
    });

  }

  function getPlaydaysPage(league) {

    var selector = {
      league: league.id
    };

    var sort = {
      startDate: 1
    };

    Playday.find(selector).sort(sort).exec(getMembership);

    function getMembership(err, playdays) {

      if (err) {
        return next(err);
      }

      playdays = playdays || [];

      var selector = {
        member: req.session.user.id,
        league: league.id
      };

      Membership.findOne(selector, writeResponse);

      function writeResponse(err, membership) {

        if (err) {
          return next(err);
        }

        var isAdmin = (membership && membership.role === 'admin');

        res.render('pages/league/playdays', {
          league: league,
          page: page,
          playdays: playdays,
          isAdmin: isAdmin
        });

      }

    }

  }

  function getTablesPage(league) {

    res.render('pages/league/tables', {
      league: league,
      page: page
    });

  }

  function getPostPage(league) {

    var selector = {
      league: league.id
    };

    var sort = {
      _created: -1
    };

    Post.find(selector).populate('member').sort(sort).exec(getMembership);

    function getMembership(err, posts) {

      if (err) {
        return next(err);
      }

      posts = posts || [];

      var selector = {
        member: req.session.user.id,
        league: league.id
      };

      Membership.findOne(selector, writeResponse);

      function writeResponse(err, membership) {

        if (err) {
          return next(err);
        }

        var isAdmin = (membership && membership.role === 'admin');

        res.render('pages/league/posts', {
          league: league,
          page: page,
          posts: posts,
          isAdmin: isAdmin
        });

      }

    }

  }

}

function getLeaguesAddPage(req, res, next) {
  res.render('pages/leagues-add');
}

function getPostsPage(req, res, next) {

  var postId = req.params.postId;
  var leagueId = req.params.leagueId;
  var response = {};

  if (!postId) {
    req.params.page = 'posts';
    return getLeaguePage(req, res, next);
  }

  if (postId === 'new') {
    return getLeague(null, {});
  }

  Post.findOne({ _id: postId }, getLeague);

  function getLeague(err, post) {

    if (err) {
      return next(err);
    }

    if (!post) {
      var error = new Error('Post not found');
      error.status = 404;
      return next(error);
    }

    response.post = post;

    var selector = {
      _id: leagueId
    };

    League.findOne(selector, getMembership);

  }

  function getMembership(err, league) {

    if (err) {
      return next(err);
    }

    if (!league) {
      var error = new Error('Could not find league.');
      error.status = 404;
      return next(error);
    }

    response.league = league;

    var selector = {
      member: req.session.user.id
    };

    Membership.findOne(selector, writeResponse);

  }

  function writeResponse(err, membership) {

    if (err) {
      return next(err);
    }

    if (!membership) {
      response.isWithoutLeague = true;
      response.isAdmin = false;
    } else {
      response.isWithoutLeague = !membership;
      response.isAdmin = membership.league.toString() === leagueId && membership.role === 'admin';
    }

    response.page = 'posts-add';

    res.render('pages/league/posts-add.jade', response);

  }

}

function getPlaydaysPage(req, res, next) {

  var playdaysId = req.params.playdaysId;
  var leagueId = req.params.leagueId;
  var response = {};

  if (!playdaysId) {
    req.params.page = 'playdays';
    return getLeaguePage(req, res, next);
  }

  if (playdaysId === 'new') {
    return getLeague(null, {});
  }

  Playday.findOne({ _id: playdaysId }, getLeague);

  function getLeague(err, playday) {

    if (err) {
      return next(err);
    }

    if (!playday) {
      var error = new Error('Playday not found');
      error.status = 404;
      return next(error);
    }

    response.playday = playday;

    var selector = {
      _id: leagueId
    };

    League.findOne(selector, getMembership);

  }

  function getMembership(err, league) {

    if (err) {
      return next(err);
    }

    if (!league) {
      var error = new Error('Could not find league.');
      error.status = 404;
      return next(error);
    }

    response.league = league;

    var selector = {
      member: req.session.user.id
    };

    Membership.findOne(selector, writeResponse);

  }

  function writeResponse(err, membership) {

    if (err) {
      return next(err);
    }

    if (!membership) {
      response.isWithoutLeague = true;
      response.isAdmin = false;
    } else {
      response.isWithoutLeague = !membership;
      response.isAdmin = membership.league.toString() === leagueId && membership.role === 'admin';
    }

    response.page = 'playdays-add';

    res.render('pages/league/playdays-add.jade', response);

  }

}


/**
 * EXPORTS.
 */
module.exports = router;