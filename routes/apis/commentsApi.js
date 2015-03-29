'use strict';

/**
 * MODULES.
 */
var express = require('express');
var router = express.Router();
var Membership = require('schemes').Membership;
var Comment = require('schemes').Comment;
var Post = require('schemes').Post;
var authentication = require('middleware').authentication;
var validation = require('middleware').validation;
var events = require('routes/modules').events;


/**
 * ROUTES.
 */

router.post('/',
  authentication(),
  postComments);

router.patch('/:commentId',
  authentication(),
  patchComments);

router.delete('/:commentId',
  authentication(),
  deleteComments);


/**
 * FUNCTIONS.
 */
function patchComments(req, res, next) {

  var commentId = req.params.commentId;
  var data = req.body;

  var selector = {
    _id: commentId
  };

  Comment.findOne(selector, processComment);

  function processComment(err, comment) {

    if (err) {
      return next(err);
    }

    if (!comment) {
      var error = new Error('Cannot find comment with given id.');
      error.status = 400;
      return next(error);
    }

    if (comment.member !== req.session.user.id) {
      var error = new Error('You are not allowed to delete this comment.');
      error.status = 403;
      return next(error);
    }

    data._modifiedOn = new Date();

    Comment.update(selector, { $set: data }, writeResponse);

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

function postComments(req, res, next) {

  var data = req.body;
  var response = {};

  data.member = req.session.user.id;

  var comment = new Comment(data);

  comment.save(savedComment);

  function savedComment(err, comment) {

    if (err) {
      return next(err);
    }

    response.comment = comment;

    Post.update({ _id: data.post }, { $inc: { comments: 1 } }, updatedPost);

  }

  function updatedPost(err, updated) {

    if (err) {
      return next(err);
    }

    events.create('comment.new', {
      commentId: comment.id
    }, writeResponse);

  }

  function writeResponse(err) {

    if (err) {
      return next(err);
    }

    res.json(response);

  }

}

function deleteComments(req, res, next) {

  var commentId = req.params.commentId;

  var selector = {
    _id: commentId,
    member: req.session.user.id
  };

  Comment.findOneAndRemove(selector, removedComment);

  function removedComment(err, comment) {

    if (err) {
      return next(err);
    }

    if (!comment) {
      var error = new Error("Cannot find comment with given id.");
      error.status = 400;
      return next(error);
    }

    Post.update({ _id: comment.post }, { $inc: { comments: -1 } }, writeResponse);

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


/**
 * EXPORTS.
 */
module.exports = router;