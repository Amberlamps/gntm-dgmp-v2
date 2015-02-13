/**
 * Schema for model.
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

  displayname: {
    type: String,
    required: true
  },

  firstname: {
    type: String
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

  age: {
    type: Number
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