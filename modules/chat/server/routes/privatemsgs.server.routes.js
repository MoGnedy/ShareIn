'use strict';

/**
 * Module dependencies
 */
// var commentsPolicy = require('../policies/comments.server.policy'),
   var privateMsg = require('../controllers/privatemsgs.server.controller');


module.exports = function(app) {

  app.route('/api/savePrivateMsg')
    .post(privateMsg.create);
  app.route('/api/getPrivatemsgs')
    .post(privateMsg.list);
  app.route('/api/getPrivateUser')
    .post(privateMsg.getPrivateUser);
  app.route('/api/getConvsMsgs')
    .get(privateMsg.getConvsMsgs);
  app.route('/api/removeConv')
    .post(privateMsg.removeConv);
  app.route('/api/removeMsg')
    .post(privateMsg.removeMsg);









  // Finish by binding the Sharetool middleware
  // app.param('sharetoolId', sharetools.sharetoolByID);
};
