'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  // privatMsg = mongoose.model('privatMsg'),
  _PrivatMsg = mongoose.model('PrivatMsg'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a privatMsg
 */
exports.create = function(req, res) {
  console.log("Chat server.create");
  console.log(req.body);
  if (req.body.private_code) {
    var privatMsg = new _PrivatMsg(req.body);
    privatMsg.user = req.user;
    privatMsg.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        console.log(privatMsg);
        res.jsonp(privatMsg);
      }
    });
  }
};

/**
 * Show the current privatMsg
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var privatMsg = req.privatMsg ? req.privatMsg.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  privatMsg.isCurrentUserOwner = req.user && privatMsg.user && privatMsg.user._id.toString() === req.user._id.toString();

  res.jsonp(privatMsg);
};

/**
 * Update a privatMsg
 */
exports.update = function(req, res) {
  var privatMsg = req.privatMsg;

  privatMsg = _.extend(privatMsg, req.body);

  privatMsg.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(privatMsg);
    }
  });
};

/**
 * Delete an privatMsg
 */
exports.delete = function(req, res) {
  var privatMsg = req.privatMsg;

  privatMsg.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(privatMsg);
    }
  });
};

/**
 * List of privatMsgs
 */
exports.list = function(req, res) {
  console.log('----------------------------------------------');
  console.log(req.body);
  if (req.body.private_code) {
    _PrivatMsg.find({
      'private_code': req.body.private_code
    }).sort('-created').populate('user').exec(function(err, privatMsgs) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        console.log("------------ Private messages -----------------");
        console.log(privatMsgs);
        var privatMsgsArray = privatMsgs;
        // var sharetool = req.body;
        // var resData = {
          // Data: [sharetool, privatMsgsArray]
        // };
        console.log(privatMsgs);
        res.jsonp(privatMsgs);
      }
    });
  }
};



/**
 * privatMsg middleware
 */
exports.privatMsgByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'privatMsg is invalid'
    });
  }

  _PrivatMsg.findById(id).populate('user', 'displayName').exec(function(err, privatMsg) {
    if (err) {
      return next(err);
    } else if (!privatMsg) {
      return res.status(404).send({
        message: 'No privatMsg with that identifier has been found'
      });
    }
    req.privatMsg = privatMsg;
    next();
  });






};
