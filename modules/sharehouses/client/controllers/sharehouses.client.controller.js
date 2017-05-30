(function() {
  'use strict';

  // Sharehouses controller
  angular
    .module('sharehouses')
    .controller('SharehousesController', SharehousesController);

  SharehousesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'sharehouseResolve', '$http', '$compile', 'Socket'];

  function SharehousesController($scope, $state, $window, Authentication, sharehouse, $http, $compile, Socket) {
    var vm = this;

    vm.authentication = Authentication;
    vm.sharehouse = sharehouse;
    vm.sharehouseObj = sharehouse;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.saveComment = saveComment;
    if (!Socket.socket) {
      Socket.connect();
      console.log("ShareHouses connected");
    }

    // Remove existing Sharehouse
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.sharehouseObj._id = vm.sharehouse.Data[0]._id;
        vm.sharehouseObj.$remove($state.go('sharehouses.list'));
      }
    }

    // Save Sharehouse
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.sharehouseForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.sharehouse.Data[0]._id) {
        vm.sharehouseObj._id = vm.sharehouse.Data[0]._id;
        vm.sharehouseObj.title = vm.sharehouse.Data[0].title;
        vm.sharehouseObj.content = vm.sharehouse.Data[0].content;
        vm.sharehouseObj.houseImageURL = vm.sharehouse.Data[0].houseImageURL;
        vm.sharehouseObj.$update(successCallback, errorCallback);
      } else {
        var imageUrl = './modules/sharehouses/client/img/house/' + vm.myFile.name;
        console.log(imageUrl);
        var file = vm.myFile;
        var uploadUrl = "/multer";
        var fd = new FormData();
        fd.append('file', file);
        console.log('before Post');
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {
              'Content-Type': undefined
            }
          })
          .success(function() {
            console.log("success!!");
          })
          .error(function() {
            console.log("error!!");
          });

        vm.sharehouseObj.title = vm.sharehouse.Data[0].title;
        vm.sharehouseObj.content = vm.sharehouse.Data[0].content;
        vm.sharehouseObj.houseImageURL = imageUrl;
        vm.sharehouseObj.$save(successCallback, errorCallback);
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


    // house imageURL
    $scope.imageURL = 'modules/sharehouses/client/img/house/default.png';


    // Comments
    // Save sharehouse
    function saveComment(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.commentForm');
        return false;
      }
      console.log("true");
      // TODO: move create/update logic to service
      if (vm.comment._id) {
        vm.comment.$update(successCallback, errorCallback);
      } else {
        //  vm.comment.$save(successCallback, errorCallback);
        console.log(vm.sharehouse.Data[0]._id);
        $http.post('api/saveHouseComment', {
          'comment': vm.comment.comment,
          'houseId': vm.sharehouse.Data[0]
        });
        Socket.emit('sendHouseComment', vm.sharehouse.Data[0]);
        vm.comment = '';
      }

      function successCallback(res) {
        console.log(res._id);
        $state.go('sharehouses.view', {
          sharehouseId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }


    Socket.on('UpdateHouseComments', function(house_id) {
      console.log(vm.sharehouse.Data[0]._id);
      console.log(house_id);
      if (house_id === vm.sharehouse.Data[0]._id) {
        $http.post('/api/getHouseComments', vm.sharehouse.Data[0])
          .success(function(data) {
            vm.sharehouse.Data = data.Data;
          })
          .error(function(data, status) {
            console.error('Repos error', status, data);
          });

      }
    });

  }
}());
