'use strict';

// Users service used for communicating with the tools REST endpoint
angular.module('sharetools').factory('Tools', ['$resource',
  function ($resource) {
    return $resource('api/sharetools', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

//TODO this should be Users service
angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/tool/:toolId', {
      toolId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

angular.module('sharetools').factory('Tool', ['$resource',
  function ($resource) {
    return $resource('api/tools/:toolId', {
      toolId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
