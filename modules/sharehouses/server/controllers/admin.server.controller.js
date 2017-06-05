'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  House = mongoose.model('Sharehouse'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Show the current house
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * Update a House
 */
exports.update = function (req, res) {
  var house = req.model;

  //For security purposes only merge these parameters
  house.title = req.body.title;
  house.content = req.body.content;

  house.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(house);
  });
};

/**
 * Delete a house
 */
exports.delete = function (req, res) {
  var house = req.model;

  house.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(house);
  });
};

/**
 * List of Houses
 */
exports.list = function (req, res) {
  House.find({}).sort('-created').populate('user', 'displayName').exec(function (err, houses) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(houses);
  });
};

/**
 * House middleware
 */
exports.houseByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'House is invalid'
    });
  }

  House.findById(id).exec(function (err, house) {
    if (err) {
      return next(err);
    } else if (!house) {
      return next(new Error('Failed to load house ' + id));
    }

    req.model = house;
    next();
  });
};
