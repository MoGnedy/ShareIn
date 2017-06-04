'use strict';

// Setting up route
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.tools', {
        url: '/tools',
        templateUrl: 'modules/sharetools/client/views/admin/list-tools.client.view.html',
        controller: 'ToolsListController'
      })
      .state('admin.tool', {
        url: '/tools/:sharetoolId',
        templateUrl: 'modules/sharetools/client/views/view-sharetool.client.view.html',
        controller: 'SharetoolsController',
        controllerAs: 'vm',
        resolve: {
          sharetoolResolve: getSharetool
        },
        data: {
          pageTitle: 'Sharetool {{ sharetoolResolve.title }}'
        }
        // resolve: {
        //   sharetoolResolve: ['$stateParams', 'Tool', function ($stateParams, User) {
        //     return Tool.get({
        //       toolId: $stateParams.toolId
        //     });
        //   }]
        // }
      })
      .state('admin.tool-edit', {
        url: '/tools/:sharetoolId/edit',
        templateUrl: 'modules/sharetools/client/views/form-sharetool.client.view.html',
        controller: 'SharetoolsController',
        controllerAs: 'vm',
        resolve: {
          sharetoolResolve: getSharetool
        },
        data: {
          pageTitle: 'Sharetool {{ sharetoolResolve.title }}'
        }
        // resolve: {
        //   userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
        //     return Admin.get({
        //       userId: $stateParams.userId
        //     });
        //   }]
        // }
      });
  }
]);
getSharetool.$inject = ['$stateParams', 'SharetoolsService'];

function getSharetool($stateParams, SharetoolsService) {
  return SharetoolsService.get({
    sharetoolId: $stateParams.sharetoolId
  }).$promise;
}
