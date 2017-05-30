'use strict';

/**
 * Module dependencies.
 */

 var multiparty = require('connect-multiparty'),
 multipartyMiddleware = multiparty();
var articlesPolicy = require('../policies/articles.server.policy'),
  articles = require('../controllers/articles.server.controller');

  // var multer  = require('multer');
  // var storage = multer.diskStorage({
  //     destination: function (req, file, cb) {
  //         cb(null, 'public/uploads');
  //     },
  //     // filename: function (req, file, cb) {
  //     //     cb(null, file.originalname);
  //     filename: function (req, file, cb) {
  //      var filename = file.originalname;
  //      var fileExtension = filename.split(".")[1];
  //     //  cb(null, file.originalname+Date.now() + "." + fileExtension);
  //      cb(null, file.originalname);
  //
  //     }
  // });
  // var upload = multer({ storage: storage });




module.exports = function (app) {
  // app.post('/multer', upload.single('file'));
  // Articles collection routes
  app.route('/api/articles').all(articlesPolicy.isAllowed)
    .get(articles.list)
    .post(articles.create);

  // Single article routes
  app.route('/api/articles/:articleId').all(articlesPolicy.isAllowed)
    .get(articles.read)
    .put(articles.update)
    .delete(articles.delete);

    // app.use(multipart({
    //     uploadDir: config.tmp
    // }));
    // app.post('/api/uploads', multipartyMiddleware, articles.uploadFile);

  // Finish by binding the article middleware
  app.param('articleId', articles.articleByID);
};
