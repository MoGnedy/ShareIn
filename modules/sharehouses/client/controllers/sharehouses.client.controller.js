(function() {
  'use strict';

  // Sharehouses controller
  angular
    .module('sharehouses')
    .controller('SharehousesController', SharehousesController);

  SharehousesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'sharehouseResolve', '$http', '$compile', 'Socket', 'commentHouseServices'];

  function SharehousesController($scope, $state, $window, Authentication, sharehouse, $http, $compile, Socket, commentHouseServices) {
    var vm = this;
    vm.stateName = $state.current.name;
    console.log($state.current.name);
    vm.authentication = Authentication;
    vm.sharehouse = sharehouse;
    vm.sharehouseObj = sharehouse;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.saveComment = saveComment;
    vm.commentRemove = commentRemove;
    if (!Socket.socket) {
      Socket.connect();
      console.log("ShareHouses connected");
    }

    // Remove existing Sharehouse
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.sharehouseObj._id = vm.sharehouse.Data[0]._id;
        vm.sharehouseObj.$remove();
        if (vm.stateName === 'admin.house'){
          $state.go('admin.houses');
        }else{
          $state.go('sharehouses.list');
        }
      }
    }

    // Save Sharehouse
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.sharehouseForm');
        return false;
      }
      var imageUrl;
      var file = vm.myFile;
      var uploadUrl = "/multerHouse";
      var fd = new FormData();

      // TODO: move create/update logic to service
      if (vm.sharehouse.Data[0]._id) {
        if (vm.myFile){
        imageUrl = './modules/sharehouses/client/img/house/' + vm.myFile.name;
      }
        console.log(imageUrl);
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
          if (vm.myFile){
            console.log('tmam');
            vm.sharehouseObj.houseImageURL = imageUrl;
          }

        vm.sharehouseObj._id = vm.sharehouse.Data[0]._id;
        vm.sharehouseObj.title = vm.sharehouse.Data[0].title;
        vm.sharehouseObj.content = vm.sharehouse.Data[0].content;
        vm.sharehouseObj.location = vm.sharehouse.Data[0].location;
        // vm.sharehouseObj.houseImageURL = vm.sharehouse.Data[0].houseImageURL;
        vm.sharehouseObj.$update(successCallback, errorCallback);
      } else {
        if (vm.myFile){
        imageUrl = './modules/sharehouses/client/img/house/' + vm.myFile.name;
      }
        console.log(imageUrl);
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
        vm.sharehouseObj.location = vm.sharehouse.Data[0].location;
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


    function commentRemove(comment_id, i) {
      console.log(comment_id);
      // console.log(tool_id);
      // console.log(angular.element(document.querySelector('#'+user._id)));
      // angular.element(document.querySelector('#\\'+user._id)).remove();
      if ($window.confirm('Are you sure you want to delete?')) {
        // var commentData = {'tool_id':tool_id, 'comment_id':comment_id,}
        var comment = {'comment': comment_id};
        console.log(comment_id);
        console.log(commentHouseServices);
        commentHouseServices.removeComment(comment).then(function(res) {
          console.log(res);

          if (res && !res.status) {

            vm.sharehouse.Data[1].splice(i, 1);
            comment = {'house':vm.sharehouse.Data[0],'i':i};
            Socket.emit('deleteHouseComment', comment);
            // $rootScope.$apply();
          } else {
            console.log("send error");
          }


        });

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

    Socket.on('updateAfterDeleteHouseComments', function(comment) {
      console.log(comment);
      // console.log(house_id);
      if (comment.house._id === vm.sharehouse.Data[0]._id) {
        vm.sharehouse.Data[1].splice(comment.i, 1);

      }
    });

  }
}());
