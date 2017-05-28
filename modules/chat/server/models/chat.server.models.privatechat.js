'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Comment Schema
 */
var PrivatMsgSchema = new Schema({
  private_code: {
    type: String,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  private_message: {
    type: String,
    trim: true
  }
});

mongoose.model('PrivatMsg', PrivatMsgSchema);
