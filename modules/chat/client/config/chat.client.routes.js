'use strict';

// Configure the 'chat' module routes
angular.module('chat').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
    .state('chat', {
      url: '/chat',
      templateUrl: '<ui-view/>',
      abstract: true
    })
    .state('chat.all', {
      url: '',
      templateUrl: 'modules/chat/client/views/chat.client.view.html',
      data: {
        roles: ['user', 'admin']
      }
    })
    .state('chat.private', {
      url: '/:userId',
      templateUrl: 'modules/chat/client/views/chat.client.private.view.html',
      data: {
        roles: ['user', 'admin']
      }
    });


  }
]);
