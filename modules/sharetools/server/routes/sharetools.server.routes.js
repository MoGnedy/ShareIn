'use strict';

/**
 * Module dependencies
 */
var sharetoolsPolicy = require('../policies/sharetools.server.policy'),
  sharetools = require('../controllers/sharetools.server.controller'),
  commentsPolicy = require('../policies/comments.server.policy'),
  comment = require('../controllers/comments.server.controller');


module.exports = function(app) {
  // Sharetools Routes
  app.route('/api/sharetools').all(sharetoolsPolicy.isAllowed)
    .get(sharetools.list)
    .post(sharetools.create);

  app.route('/api/sharetools/:sharetoolId').all(sharetoolsPolicy.isAllowed)
    .get(sharetools.read)
    .put(sharetools.update)
    .delete(sharetools.delete)
    .post(comment.create);

  app.route('/api/comments').all(commentsPolicy.isAllowed)
    .post(comment.create);
  app.route('/api/getComments')
    .post(comment.list);


  // Finish by binding the Sharetool middleware
  app.param('sharetoolId', sharetools.sharetoolByID);
};
