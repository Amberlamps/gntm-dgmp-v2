/**
 * Schema for rulebook.
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
    type: Date,
    default: Date.now
  },

  active: {
    type: Boolean,
    required: true,
    default: false
  },

  league: {
    type: Schema.ObjectId,
    ref: 'League',
    required: true
  },

  name: {
    type: String,
    required: true,
    default: 'Rulebook Draft 1.0'
  },

  jobRules: {
    type: Array,
    required: true,
    default: [{
      name: 'Mädchen hat einen Job bekommen',
      description: 'Getrunken wird, wenn das Mädchen einen Job bekommen hat.',
      jobs: 1
    }]
  },

  drinkingRules: {
    type: Array,
    required: true,
    default: [{
      name: 'Name gesagt',
      description: 'Getrunken wird, wenn der Name eines Models genannt wird.',
      target: 'manager',
      gulps: 1
    }, {
      name: 'Name geschrieben',
      description: 'Getrunken wird, wenn der Name eines Models irgendwo geschrieben steht.',
      target: 'manager',
      gulps: 2
    }, {
      name: 'Model weint',
      description: 'Getrunken wird, wenn ein Model weint.',
      target: 'manager',
      gulps: 5
    }, {
      name: 'Mädchen/Chicas gesagt',
      description: 'Getrunken wird, wenn "Mädchen" in irgendeiner Sprache genannt wird.',
      target: 'alle',
      gulps: 1
    }]
  },

  drinkingDistribution: {
    type: Array,
    required: true,
    default: [5, 4, 3, 2, 1]
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
mongoose.model('Rulebook', schema);
module.exports = mongoose.model('Rulebook');