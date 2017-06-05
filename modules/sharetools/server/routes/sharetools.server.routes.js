'use strict';

/**
 * Module dependencies
 */
var sharetoolsPolicy = require('../policies/sharetools.server.policy'),
  sharetools = require('../controllers/sharetools.server.controller'),
  commentsPolicy = require('../policies/comments.server.policy'),
  comment = require('../controllers/comments.server.controller');

  var multer  = require('multer');
  var toolStorage = multer.diskStorage({
      destination: function (req, file, cb) {
          cb(null, './modules/sharetools/client/img/tool/');
      },
      filename: function (req, file, cb) {
          cb(null, file.originalname);
          // filename: function (req, file, cb) {
          //  var filename = file.originalname;
          //  var fileExtension = filename.split(".")[1];
          //  cb(null, file.originalname+Date.now() + "." + fileExtension);
          //  cb(null, file.originalname);
      }
  });
  var uploadToolImage = multer({ storage: toolStorage });


module.exports = function(app) {
  app.post('/multerTool', uploadToolImage.single('file'));

  // Sharetools Routes
  app.route('/api/sharetools').all(sharetoolsPolicy.isAllowed)
    .get(sharetools.list)
    .post(sharetools.create);

  app.route('/api/sharetools/latest').all(sharetoolsPolicy.isAllowed)
      .get(sharetools.listLatest);


  app.route('/api/sharetools/:sharetoolId').all(sharetoolsPolicy.isAllowed)
    .get(sharetools.read)
    .put(sharetools.update)
    .delete(sharetools.delete)
    .post(comment.create);

  app.route('/api/saveToolComment')
    .post(comment.create);
  app.route('/api/getToolComments')
    .post(comment.list);

  // app.route('/api/sharetools/create');

  // Finish by binding the Sharetool middleware
  app.param('sharetoolId', sharetools.sharetoolByID);
};
