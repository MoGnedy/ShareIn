'use strict';

// Setting up route
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.houses', {
        url: '/houses',
        templateUrl: 'modules/sharehouses/client/views/admin/list-houses.client.view.html',
        controller: 'HousesListController'
      })
      .state('admin.house', {
        url: '/houses/:sharehouseId',
        templateUrl: 'modules/sharehouses/client/views/view-sharehouse.client.view.html',
        controller: 'SharehousesController',
        controllerAs: 'vm',
        resolve: {
          sharehouseResolve: getSharehouse
        },
        data: {
          pageTitle: 'Sharehouse {{ sharehouseResolve.title }}'
        }
      })
      .state('admin.house-edit', {
        url: '/houses/:sharehouseId/edit',
        templateUrl: 'modules/sharehouses/client/views/form-sharehouse.client.view.html',
        controller: 'SharehousesController',
        controllerAs: 'vm',
        resolve: {
          sharehouseResolve: getSharehouse
        },
        data: {
          pageTitle: 'Sharehouse {{ sharehouseResolve.title }}'
        }
      })
      .state('admin.house-create', {
        url: '/houses/create',
        templateUrl: 'modules/sharehouses/client/views/form-sharehouse.client.view.html',
        controller: 'SharehousesController',
        controllerAs: 'vm',
        resolve: {
          sharehouseResolve: newSharehouse
        }
      });

  }
]);
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
