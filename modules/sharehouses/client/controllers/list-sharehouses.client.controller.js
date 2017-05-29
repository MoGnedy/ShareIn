(function () {
  'use strict';

  angular
    .module('sharehouses')
    .controller('SharehousesListController', SharehousesListController);

  SharehousesListController.$inject = ['SharehousesService'];

  function SharehousesListController(SharehousesService) {
    var vm = this;

    vm.sharehouses = SharehousesService.query();
  }
}());
