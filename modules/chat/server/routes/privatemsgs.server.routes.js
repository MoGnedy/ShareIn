'use strict';

/**
 * Module dependencies
 */
// var commentsPolicy = require('../policies/comments.server.policy'),
   var privatMsg = require('../controllers/privatemsgs.server.controller');


module.exports = function(app) {

  app.route('/api/savePrivateMsg')
    .post(privatMsg.create);
  app.route('/api/getPrivatemsgs')
    .post(privatMsg.list);



  // Finish by binding the Sharetool middleware
  // app.param('sharetoolId', sharetools.sharetoolByID);
};
