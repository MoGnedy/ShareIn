'use strict';

/**
 * Module dependencies
 */
var sharetoolsPolicy = require('../policies/sharetools.server.policy'),
  sharetools = require('../controllers/sharetools.server.controller'),
  commentsPolicy = require('../policies/comments.server.policy'),
  comment = require('../controllers/comments.server.controller');

  var multer  = require('multer');
  var storage = multer.diskStorage({
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
  var upload = multer({ storage: storage });

module.exports = function(app) {
  app.post('/multer', upload.single('file'));

  // Sharetools Routes
  app.route('/api/sharetools').all(sharetoolsPolicy.isAllowed)
    .get(sharetools.list)
    .post(sharetools.create);

  app.route('/api/sharetools/:sharetoolId').all(sharetoolsPolicy.isAllowed)
    .get(sharetools.read)
    .put(sharetools.update)
    .delete(sharetools.delete)
    .post(comment.create);

  app.route('/api/saveToolComment')
    .post(comment.create);
  app.route('/api/getToolComments')
    .post(comment.list);


  // Finish by binding the Sharetool middleware
  app.param('sharetoolId', sharetools.sharetoolByID);
};
