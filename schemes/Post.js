/**
 * Schema for post.
 *
 * User: Alexander Behrens <alexander.behrens.84@gmail.com>
 */

'use strict';


/**
 * MODULES.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


/**
 * VARIABLES.
 */
var schema = new Schema({

  _createdOn: {
    type: Date,
    default: Date.now
  },

  _modifiedOn: {
    type: Date
  },

  member: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },

  league: {
    type: Schema.ObjectId,
    ref: 'League',
    required: true
  },

  comments: {
    type: Number,
    required: true,
    default: 0
  },

  title: {
    type: String,
    required: true
  },

  post: {
    type: String,
    required: true
  },

  icon: {
    type: String,
    required: true
  }

}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});


/**
 * EXPORTS.
 */
mongoose.model('Post', schema);
module.exports = mongoose.model('Post');