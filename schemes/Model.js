/**
 * Schema for model.
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

    firstname: {
      type: String,
      required: true
    },

    lastname: {
      type: String
    },

    pictureFull: {
      type: String
    },

    pictureFace: {
      type: String
    },

    birthday: {
      type: Date
    },

    height: {
      type: Number
    },

    eliminated: {
      type: Date
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
  mongoose.model('Model', schema);
  module.exports = mongoose.model('Model');

}) ();