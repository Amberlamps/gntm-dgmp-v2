/**
 * Schema for league.
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

    founder: {
      type: Schema.ObjectId,
      ref: 'User',
      required: true
    },

    name: {
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
  mongoose.model('League', schema);
  module.exports = mongoose.model('League');

}) ();