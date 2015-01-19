/**
 * Schema for membership.
 *
 * User: Alexander Behrens <alexander.behrens.84@gmail.com>
 */

(function() {


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

    member: {
      type: Schema.ObjectId,
      ref: 'User',
      required: true
    },

    league: {
      type: Schema.ObjectId,
      ref: 'User',
      required: true
    },

    role: {
      type: String,
      default: 'member',
      required: true
    },

    status: {
      type: String,
      default: 'requested',
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
  mongoose.model('Membership', schema);
  module.exports = mongoose.model('Membership');

}) ();