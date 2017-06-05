'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Sharehouse = mongoose.model('Sharehouse'),
  _Comment = mongoose.model('HousesComment'),
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
  var commentsArray;
  var sharehouse = req.sharehouse ? req.sharehouse.toJSON() : {};
  if (req.sharehouse){
    // console.log("comments");
    _Comment.find({'houseId': req.sharehouse}).sort('-created').populate('user').exec(function(err, comments) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        commentsArray = comments;
        console.log(sharehouse);
        sharehouse.isCurrentUserOwner = req.user && sharehouse.user && sharehouse.user._id.toString() === req.user._id.toString();
        var resData = { Data: [sharehouse , commentsArray] };
        res.jsonp(resData);
      }
    });
  }
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

exports.listLatest = function(req, res) {
  Sharehouse.find().sort('-created').limit(3).populate('user', 'displayName').exec(function(err, sharehouses) {
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


  /**
   * Create a Comment
   */
  exports.createComment = function(req, res) {
    var comment = new Comment(req.body);
    comment.user = req.user;

    comment.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(comment);
      }
    });
  };


  module.exports = function (io, socket) {
    console.log(socket);
    socket.on('sendHouseComment', function (house) {
      console.log("server Emit");
      console.log(house);
    });


  };



};
