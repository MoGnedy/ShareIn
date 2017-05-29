// Sharehouses service used to communicate Sharehouses REST endpoints
(function () {
  'use strict';

  angular
    .module('sharehouses')
    .factory('SharehousesService', SharehousesService);

  SharehousesService.$inject = ['$resource'];

  function SharehousesService($resource) {
    return $resource('api/sharehouses/:sharehouseId', {
      sharehouseId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
