'use strict';

/**
 * Module dependencies
 */
var sharehousesPolicy = require('../policies/sharehouses.server.policy'),
  sharehouses = require('../controllers/sharehouses.server.controller'),
  commentsPolicy = require('../policies/comments.server.policy'),
  comment = require('../controllers/comments.server.controller');


  var multer  = require('multer');
  var houseStorage = multer.diskStorage({
      destination: function (req, file, cb) {
          cb(null, './modules/sharehouses/client/img/house/');
      },
      filename: function (req, file, cb) {
          cb(null, file.originalname);
      }
  });
  var uploadHouseImage = multer({ storage: houseStorage });
module.exports = function(app) {
  app.post('/multerHouse', uploadHouseImage.single('file'));
  // Sharehouses Routes
  app.route('/api/sharehouses').all(sharehousesPolicy.isAllowed)
    .get(sharehouses.list)
    .post(sharehouses.create);

  app.route('/api/sharesharehouses/latest').all(sharehousesPolicy.isAllowed)
      .get(sharehouses.listLatest);


  app.route('/api/sharehouses/:sharehouseId').all(sharehousesPolicy.isAllowed)
    .get(sharehouses.read)
    .put(sharehouses.update)
    .delete(sharehouses.delete)
    .post(comment.create);

  app.route('/api/saveHouseComment')
    .post(comment.create);
  app.route('/api/getHouseComments')
    .post(comment.list);

  // Finish by binding the Sharehouse middleware
  app.param('sharehouseId', sharehouses.sharehouseByID);
};
