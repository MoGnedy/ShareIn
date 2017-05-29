(function () {
  'use strict';

  // Sharehouses controller
  angular
    .module('sharehouses')
    .controller('SharehousesController', SharehousesController);

  SharehousesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'sharehouseResolve'];

  function SharehousesController ($scope, $state, $window, Authentication, sharehouse) {
    var vm = this;

    vm.authentication = Authentication;
    vm.sharehouse = sharehouse;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Sharehouse
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.sharehouse.$remove($state.go('sharehouses.list'));
      }
    }

    // Save Sharehouse
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.sharehouseForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.sharehouse._id) {
        vm.sharehouse.$update(successCallback, errorCallback);
      } else {
        vm.sharehouse.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('sharehouses.view', {
          sharehouseId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
