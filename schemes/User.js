/**
 * Schema for user.
 *
 * User: Alexander Behrens <alexander.behrens.84@gmail.com>
 */

'use strict';


/**
 * MODULES.
 */
var mongoose = require('mongoose');
var crypto = require('crypto');
var uuid = require('node-uuid');
var Schema = mongoose.Schema;


/**
 * VARIABLES.
 */
var schema = new Schema({

  _createdOn: {
    type: Date,
    default: Date.now
  },

  email: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },

  name: {
    type: String,
    required: true
  },

  roaster: {
    type: Array,
    required: true,
    default: []
  },

  roles: {
    type: Array,
    default: ['user']
  },

  salt: {
    type: String,
    required: true,
    default: uuid.v1
  },

  passwdHash: {
    type: String
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
 * FUNCTIONS.
 */
var hash = function(password, salt) {
  return crypto.createHmac('sha256', salt).update(password).digest('hex')
};

schema.methods.setPassword = function(password) {
  this.passwdHash = hash(password, this.salt);
};

schema.methods.isValidPassword = function(password) {
  return this.passwdHash === hash(password, this.salt);
};


/**
 * EXPORTS.
 */
mongoose.model('User', schema);
module.exports = mongoose.model('User');