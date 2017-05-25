(function() {
  'use strict';

  // Sharetools controller
  angular
    .module('sharetools')
    .controller('SharetoolsController', SharetoolsController);

  SharetoolsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'sharetoolResolve', '$http', '$compile', 'Socket'];

  function SharetoolsController($scope, $state, $window, Authentication, sharetool, $http, $compile, Socket) {
    var vm = this;

    vm.authentication = Authentication;
    vm.sharetool = sharetool;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.saveComment = saveComment;
    if (!Socket.socket) {
      Socket.connect();
      console.log("connected");
    }
    // Remove existing Sharetool
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.sharetool.$remove($state.go('sharetools.list'));
      }
    }

    // Save Sharetool
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.sharetoolForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.sharetool._id) {
        vm.sharetool.$update(successCallback, errorCallback);
      } else {
        vm.sharetool.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('sharetools.view', {
          sharetoolId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    // Tool imageURL
    $scope.imageURL = 'modules/sharetools/client/img/tool/default.jpg';


    // Comments
    // Save Sharetool
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
        console.log(vm.sharetool.Data[0]._id);
        $http.post('api/comments', {
          'comment': vm.comment.comment,
          'toolId': vm.sharetool.Data[0]
        });
        Socket.emit('sendComment', vm.sharetool.Data[0]);
        vm.comment = '';
      }

      function successCallback(res) {
        console.log(res._id);
        $state.go('sharetools.view', {
          sharetoolId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }


    Socket.on('UpdateComments', function(message) {
      console.log(vm.sharetool.Data[0]._id);
      console.log(message);
      if (message === vm.sharetool.Data[0]._id) {
        $http.post('/api/getComments', vm.sharetool.Data[0])
          .success(function(data) {
            vm.sharetool.Data = data.Data;
          })
          .error(function(data, status) {
            console.error('Repos error', status, data);
          });

      }
    });


  }
}());
