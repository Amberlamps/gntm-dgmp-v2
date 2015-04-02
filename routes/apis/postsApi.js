'use strict';

/**
 * MODULES.
 */
var express = require('express');
var router = express.Router();
var Membership = require('schemes').Membership;
var Post = require('schemes').Post;
var Comment = require('schemes').Comment;
var authentication = require('middleware').authentication;
var validation = require('middleware').validation;
var events = require('routes/modules').events;


/**
 * ROUTES.
 */

// POST
router.post('/',
  authentication(),
  postPosts);

router.patch('/:postId',
  authentication(),
  patchPosts);

router.delete('/:postId',
  authentication(),
  deletePosts);


/**
 * FUNCTIONS.
 */
function patchPosts(req, res, next) {

  var postId = req.params.postId;
  var data = req.body;
  var response = {}; 
 
  var selector = {
    _id: postId
  };

  Post.findOne(selector, processPost);

  function processPost(err, post) {

    if (err) {
      return next(err);
    }

    if (!post) {
      var error = new Error('Cannot find post with given id.');
      error.status = 400;
      return next(error);
    }

    response.post = post;

    data._modifiedOn = new Date();

    Post.update(selector, { $set: data }, writeResponse);

  }

  function writeResponse(err, updated) {

    if (err) {
      return next(err);
    }

    response.updated = updated;

    res.json(response);

  }

}

function postPosts(req, res, next) {

  var data = req.body;

  var selector = {
    member: req.session.user.id,
    league: data.league
  };

  Membership.findOne(selector, checkPermission);

  function checkPermission(err, membership) {

    if (err) {
      return next(err);
    }

    if (!membership) {
      var error = new Error('Not member of league');
      error.status = 400;
      return next(error);
    }

    if (membership.role !== 'admin') {
      var error = new Error('You have no permission to create post');
      error.status = 400;
      return next(error);
    }

    data.member = req.session.user.id;

    var post = new Post(data);

    post.save(savedPost);

  }

  function savedPost(err, post) {

    if (err) {
      return next(err);
    }

    events.create('post.new', {
      postId: post.id
    }, writeResponse);

    function writeResponse(err) {

      if (err) {
        return next(err);
      }

      res.json({
        post: post
      });

    }

  }

}

function deletePosts(req, res, next) {

  var postId = req.params.postId;

  var selector = {
    _id: postId,
    member: req.session.user.id
  };

  Post.remove(selector, removedPost);

  function removedPost(err, removed) {

    if (err) {
      return next(err);
    }

    if (!removed) {
      var error = new Error("Cannot find post with given id.");
      error.status = 400;
      return next(error);
    }

    var selector = {
      post: postId
    };

    Comment.remove(selector, writeResponse);

  }

  function writeResponse(err, removed) {

    if (err) {
      return next(err);
    }

    res.json({
      removed: 1
    });
    
  }

}


/**
 * EXPORTS.
 */
module.exports = router;