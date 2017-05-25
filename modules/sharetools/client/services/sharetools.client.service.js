// Sharetools service used to communicate Sharetools REST endpoints
(function () {
  'use strict';

  angular
    .module('sharetools')
    .factory('SharetoolsService', SharetoolsService);

  SharetoolsService.$inject = ['$resource'];

  function SharetoolsService($resource) {
    return $resource('api/sharetools/:sharetoolId', {
      sharetoolId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
