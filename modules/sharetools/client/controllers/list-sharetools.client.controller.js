(function () {
  'use strict';

  angular
    .module('sharetools')
    .controller('SharetoolsListController', SharetoolsListController);

  SharetoolsListController.$inject = ['SharetoolsService'];

  function SharetoolsListController(SharetoolsService) {
    var vm = this;

    vm.sharetools = SharetoolsService.query();
  }
}());
