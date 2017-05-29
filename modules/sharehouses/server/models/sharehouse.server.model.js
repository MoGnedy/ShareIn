'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Sharehouse Schema
 */
var SharehouseSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Sharehouse name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Sharehouse', SharehouseSchema);
