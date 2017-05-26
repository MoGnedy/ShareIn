'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Sharetool = mongoose.model('Sharetool'),
  _Comment = mongoose.model('ToolsComment'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Sharetool
 */
exports.create = function(req, res) {
  console.log("server");
  var sharetool = new Sharetool(req.body);
  sharetool.user = req.user;

  sharetool.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sharetool);
    }
  });
};

/**
 * Show the current Sharetool
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var commentsArray;
  var sharetool = req.sharetool ? req.sharetool.toJSON() : {};
  if (req.sharetool){
    // console.log("comments");
    _Comment.find({'toolId': req.sharetool}).sort('-created').populate('user').exec(function(err, comments) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log(comments);
        commentsArray = comments;
        // res.jsonp(comments);
        // console.log(commentsArray);
        // commentsArray = {'comment': commentsArray[0]};
        // console.log(sharetool);
        // Add a custom field to the Article, for determining if the current User is the "owner".
        // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
        sharetool.isCurrentUserOwner = req.user && sharetool.user && sharetool.user._id.toString() === req.user._id.toString();
        var resData = { Data: [sharetool , commentsArray] };
        // console.log(commentsArray);
        res.jsonp(resData);
      }
    });
  }

};

/**
 * Update a Sharetool
 */
exports.update = function(req, res) {
  var sharetool = req.sharetool;

  sharetool = _.extend(sharetool, req.body);

  sharetool.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sharetool);
    }
  });
};

/**
 * Delete an Sharetool
 */
exports.delete = function(req, res) {
  var sharetool = req.sharetool;

  sharetool.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sharetool);
    }
  });
};

/**
 * List of Sharetools
 */
exports.list = function(req, res) {
  Sharetool.find().sort('-created').populate('user', 'displayName').exec(function(err, sharetools) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sharetools);
    }
  });
};

/**
 * Sharetool middleware
 */
exports.sharetoolByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Sharetool is invalid'
    });
  }

  Sharetool.findById(id).populate('user', 'displayName').exec(function (err, sharetool) {
    if (err) {
      return next(err);
    } else if (!sharetool) {
      return res.status(404).send({
        message: 'No Sharetool with that identifier has been found'
      });
    }
    req.sharetool = sharetool;
    next();
  });


  /**
   * Create a Sharetool
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
    socket.on('sendToolComment', function (tool) {
      console.log("server Emit");
      console.log(tool);

      // io.emit('chatMessage', message);
    });


  };


};
