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
  title: {
    type: String,
    default: '',
    required: 'Please fill House title',
    trim: true
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  houseImageURL: {
    type: String,
    default: 'modules/sharehouses/client/img/house/default.png'
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
