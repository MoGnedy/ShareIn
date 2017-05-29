'use strict';

/**
 * Module dependencies
 */
var sharehousesPolicy = require('../policies/sharehouses.server.policy'),
  sharehouses = require('../controllers/sharehouses.server.controller');

module.exports = function(app) {
  // Sharehouses Routes
  app.route('/api/sharehouses').all(sharehousesPolicy.isAllowed)
    .get(sharehouses.list)
    .post(sharehouses.create);

  app.route('/api/sharehouses/:sharehouseId').all(sharehousesPolicy.isAllowed)
    .get(sharehouses.read)
    .put(sharehouses.update)
    .delete(sharehouses.delete);

  // Finish by binding the Sharehouse middleware
  app.param('sharehouseId', sharehouses.sharehouseByID);
};
