/**
 * Schema for playday.
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

  league: {
    type: Schema.ObjectId,
    ref: 'League',
    required: true
  },

  member: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },

  models: [{
    model: {
      _id: false,
      type: Schema.ObjectId,
      ref: 'Model',
      required: true 
    },
    gulps: {
      type: Number,
      default: 0
    },
    jobs: {
      type: Number,
      default: 0
    }
  }],

  managers: [{
    user: {
      _id: false,
      type: Schema.ObjectId,
      ref: 'User',
      required: true 
    },
    gulps: {
      type: Number,
      default: 0
    },
    jobs: {
      type: Number,
      default: 0
    }
  }],

  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },

  endDate: {
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
mongoose.model('Playday', schema);
module.exports = mongoose.model('Playday');