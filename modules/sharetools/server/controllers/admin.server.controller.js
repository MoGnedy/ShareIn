'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Tool = mongoose.model('Sharetool'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Show the current tool
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * Update a Tool
 */
exports.update = function (req, res) {
  var tool = req.model;

  //For security purposes only merge these parameters
  tool.title = req.body.title;
  tool.content = req.body.content;

  tool.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(tool);
  });
};

/**
 * Delete a tool
 */
exports.delete = function (req, res) {
  var tool = req.model;

  tool.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(tool);
  });
};

/**
 * List of Tools
 */
exports.list = function (req, res) {
  Tool.find({}).sort('-created').populate('user', 'displayName').exec(function (err, tools) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(tools);
  });
};

/**
 * Tool middleware
 */
exports.toolByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Tool is invalid'
    });
  }

  Tool.findById(id).exec(function (err, tool) {
    if (err) {
      return next(err);
    } else if (!tool) {
      return next(new Error('Failed to load tool ' + id));
    }

    req.model = tool;
    next();
  });
};
