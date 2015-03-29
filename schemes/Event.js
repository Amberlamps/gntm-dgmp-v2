/**
 * Schema for event.
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

  key: {
    type: String,
    required: true,
    enum: ['post.new', 'comment.new', 'member.new', 'member.delete', 'playday.new', 'league.new', 'user.new']
  },

  scope: {
    type: Array,
    required: true
  },

  variables: {
    type: Object,
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
mongoose.model('Event', schema);
module.exports = mongoose.model('Event');