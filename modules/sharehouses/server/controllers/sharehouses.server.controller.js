'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Sharehouse = mongoose.model('Sharehouse'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Sharehouse
 */
exports.create = function(req, res) {
  var sharehouse = new Sharehouse(req.body);
  sharehouse.user = req.user;

  sharehouse.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sharehouse);
    }
  });
};

/**
 * Show the current Sharehouse
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var sharehouse = req.sharehouse ? req.sharehouse.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  sharehouse.isCurrentUserOwner = req.user && sharehouse.user && sharehouse.user._id.toString() === req.user._id.toString();

  res.jsonp(sharehouse);
};

/**
 * Update a Sharehouse
 */
exports.update = function(req, res) {
  var sharehouse = req.sharehouse;

  sharehouse = _.extend(sharehouse, req.body);

  sharehouse.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sharehouse);
    }
  });
};

/**
 * Delete an Sharehouse
 */
exports.delete = function(req, res) {
  var sharehouse = req.sharehouse;

  sharehouse.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sharehouse);
    }
  });
};

/**
 * List of Sharehouses
 */
exports.list = function(req, res) {
  Sharehouse.find().sort('-created').populate('user', 'displayName').exec(function(err, sharehouses) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sharehouses);
    }
  });
};

/**
 * Sharehouse middleware
 */
exports.sharehouseByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Sharehouse is invalid'
    });
  }

  Sharehouse.findById(id).populate('user', 'displayName').exec(function (err, sharehouse) {
    if (err) {
      return next(err);
    } else if (!sharehouse) {
      return res.status(404).send({
        message: 'No Sharehouse with that identifier has been found'
      });
    }
    req.sharehouse = sharehouse;
    next();
  });
};
