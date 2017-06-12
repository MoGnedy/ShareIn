
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
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  created: {
    type: Date,
    default: Date.now
  },

  allMessages:[{
                  user: {
                    type: Schema.ObjectId,
                    ref: 'User'
                  },
                  updated: {
                    type: Date,
                    default: Date.now
                  },
                  messages:
                              [
                                {user: {
                                  type: Schema.ObjectId,
                                  ref: 'User'
                                },
                                message: {
                                  type: String,
                                  trim: true
                                },
                                created: {
                                  type: Date,
                                  default: Date.now
                                }
                              }
                            ],
            }]


});

mongoose.model('PrivatMsg', PrivatMsgSchema);
