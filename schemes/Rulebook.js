/**
 * Schema for rulebook.
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

    _modifiedOn: {
      type: Date,
      default: Date.now
    },

    league: {
      type: Schema.ObjectId,
      ref: 'League',
      required: true
    },

    name: {
      type: String,
      required: true
    },

    drinkingRules: [{
      _id: false,
      name: {
        type: String,
        required: true
      },
      description: {
        type: String
      },
      target: {
        type: String,
        required: true,
        default: 'all'
      },
      gulps: {
        type: Number,
        required: true,
        default: 1
      }
    }],

    drinkingDistribution: {
      type: Array,
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
  mongoose.model('Rulebook', schema);
  module.exports = mongoose.model('Rulebook');

}) ();