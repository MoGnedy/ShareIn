'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  // comment = mongoose.model('comment'),
  _Comment = mongoose.model('HousesComment'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a comment
 */
exports.create = function(req, res) {
  console.log("server");
  console.log(req.body);
  var comment = new _Comment(req.body);
  // comment.comment = req.body[0];
  // comment.HouseId = parseDouble(req.body.HouseId);

  comment.user = req.user;
  // console.log(req.user);
  // console.log(comment);
  comment.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // console.log(comment);
      res.jsonp(comment);
    }
  });
};

/**
 * Show the current comment
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var comment = req.comment ? req.comment.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  comment.isCurrentUserOwner = req.user && comment.user && comment.user._id.toString() === req.user._id.toString();

  res.jsonp(comment);
};

/**
 * Update a comment
 */
exports.update = function(req, res) {
  var comment = req.comment;

  comment = _.extend(comment, req.body);

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

/**
 * Delete an comment
 */
 exports.delete = function(req, res) {
   var comment = new _Comment();
   comment._id = req.body.comment;
 console.log('[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]');
 console.log(req.body.comment);
   comment.remove(function(err) {
     if (err) {
       return res.status(400).send({
         message: errorHandler.getErrorMessage(err)
       });
     } else {
       res.jsonp(comment);
     }
   });
 };

/**
 * List of comments
 */
exports.list = function(req, res) {
  console.log('----------------------------------------------');
  console.log(req.body);
  // console.log(req.shareHouse);

  // console.log(HouseId);
  _Comment.find({'houseId': req.body}).sort('-created').populate('user').exec(function(err, comments) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // console.log(comments);
      var commentsArray = comments;
      var sharehouse = req.body;
      var resData = { Data: [sharehouse , commentsArray] };
      console.log(resData);
      res.jsonp(resData);
    }
  });
};

/**
 * comment middleware
 */
exports.commentByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'comment is invalid'
    });
  }

  _Comment.findById(id).populate('user', 'displayName').exec(function (err, comment) {
    if (err) {
      return next(err);
    } else if (!comment) {
      return res.status(404).send({
        message: 'No comment with that identifier has been found'
      });
    }
    req.comment = comment;
    next();
  });






};
