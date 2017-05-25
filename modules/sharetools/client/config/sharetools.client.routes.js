(function () {
  'use strict';

  angular
    .module('sharetools')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('sharetools', {
        abstract: true,
        url: '/sharetools',
        template: '<ui-view/>'
      })
      .state('sharetools.list', {
        url: '',
        templateUrl: 'modules/sharetools/client/views/list-sharetools.client.view.html',
        controller: 'SharetoolsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Sharetools List'
        }
      })
      .state('sharetools.create', {
        url: '/create',
        templateUrl: 'modules/sharetools/client/views/form-sharetool.client.view.html',
        controller: 'SharetoolsController',
        controllerAs: 'vm',
        resolve: {
          sharetoolResolve: newSharetool
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Sharetools Create'
        }
      })
      .state('sharetools.edit', {
        url: '/:sharetoolId/edit',
        templateUrl: 'modules/sharetools/client/views/form-sharetool.client.view.html',
        controller: 'SharetoolsController',
        controllerAs: 'vm',
        resolve: {
          sharetoolResolve: getSharetool
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Sharetool {{ sharetoolResolve.name }}'
        }
      })
      .state('sharetools.view', {
        url: '/:sharetoolId',
        templateUrl: 'modules/sharetools/client/views/view-sharetool.client.view.html',
        controller: 'SharetoolsController',
        controllerAs: 'vm',
        resolve: {
          sharetoolResolve: getSharetool
        },
        data: {
          pageTitle: 'Sharetool {{ sharetoolResolve.name }}'
        }
      });
  }

  getSharetool.$inject = ['$stateParams', 'SharetoolsService'];

  function getSharetool($stateParams, SharetoolsService) {
    return SharetoolsService.get({
      sharetoolId: $stateParams.sharetoolId
    }).$promise;
  }

  newSharetool.$inject = ['SharetoolsService'];

  function newSharetool(SharetoolsService) {
    return new SharetoolsService();
  }
}());
