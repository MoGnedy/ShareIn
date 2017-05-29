(function () {
  'use strict';

  angular
    .module('sharehouses')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('sharehouses', {
        abstract: true,
        url: '/sharehouses',
        template: '<ui-view/>'
      })
      .state('sharehouses.list', {
        url: '',
        templateUrl: 'modules/sharehouses/client/views/list-sharehouses.client.view.html',
        controller: 'SharehousesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Sharehouses List'
        }
      })
      .state('sharehouses.create', {
        url: '/create',
        templateUrl: 'modules/sharehouses/client/views/form-sharehouse.client.view.html',
        controller: 'SharehousesController',
        controllerAs: 'vm',
        resolve: {
          sharehouseResolve: newSharehouse
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Sharehouses Create'
        }
      })
      .state('sharehouses.edit', {
        url: '/:sharehouseId/edit',
        templateUrl: 'modules/sharehouses/client/views/form-sharehouse.client.view.html',
        controller: 'SharehousesController',
        controllerAs: 'vm',
        resolve: {
          sharehouseResolve: getSharehouse
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Sharehouse {{ sharehouseResolve.name }}'
        }
      })
      .state('sharehouses.view', {
        url: '/:sharehouseId',
        templateUrl: 'modules/sharehouses/client/views/view-sharehouse.client.view.html',
        controller: 'SharehousesController',
        controllerAs: 'vm',
        resolve: {
          sharehouseResolve: getSharehouse
        },
        data: {
          pageTitle: 'Sharehouse {{ sharehouseResolve.name }}'
        }
      });
  }

  getSharehouse.$inject = ['$stateParams', 'SharehousesService'];

  function getSharehouse($stateParams, SharehousesService) {
    return SharehousesService.get({
      sharehouseId: $stateParams.sharehouseId
    }).$promise;
  }

  newSharehouse.$inject = ['SharehousesService'];

  function newSharehouse(SharehousesService) {
    return new SharehousesService();
  }
}());
