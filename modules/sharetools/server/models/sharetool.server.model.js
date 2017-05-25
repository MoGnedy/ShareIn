'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Sharetool Schema
 */
var SharetoolSchema = new Schema({
  title: {
    type: String,
    default: '',
    required: 'Please fill tool title',
    trim: true
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  toolImageURL: {
    type: String,
    default: 'modules/sharetools/client/img/tool/default.jpg'
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

mongoose.model('Sharetool', SharetoolSchema);
