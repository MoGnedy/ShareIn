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
    vm.sharetoolObj = sharetool;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.saveComment = saveComment;
    if (!Socket.socket) {
      Socket.connect();
      console.log("ShareTools connected");
    }
    //maps
    // angular.element(document.querySelector('.mapContainer')).append('<div id="map" style="height:200px;"></div>');
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(function (pos) {
    //     console.log(pos);
    //     var uluru = {lat: pos.coords.latitude, lng: pos.coords.longitude};
    //     var map = new google.maps.Map(document.getElementById('map'), {
    //         zoom: 18,
    //         center: uluru
    //       });
    //       var marker = new google.maps.Marker({
    //         position: uluru,
    //         map: map
    //       });
    //       map.addListener('click',function (e) {
    //         console.log(e);
    //         marker.setPosition(e.latLng);
    //         map.panTo(marker.getPosition());
    //       });
    //   });
    // }


    // Remove existing Sharetool
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.sharetoolObj._id = vm.sharetool.Data[0]._id;
        vm.sharetoolObj.$remove($state.go('sharetools.list'));
      }
    }

    // Save Sharetool
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.sharetoolForm');
        return false;
      }
      console.log(vm.sharetool.Data[0]);
      console.log(vm.myFile);
      // TODO: move create/update logic to service
      if (vm.sharetool.Data[0]._id) {
        vm.sharetoolObj._id = vm.sharetool.Data[0]._id;
        vm.sharetoolObj.title = vm.sharetool.Data[0].title;
        vm.sharetoolObj.content = vm.sharetool.Data[0].content;
        vm.sharetoolObj.toolImageURL = vm.sharetool.Data[0].toolImageURL;
        vm.sharetoolObj.$update(successCallback, errorCallback);
      } else {
        var imageUrl = './modules/sharetools/client/img/tool/' + vm.myFile.name;
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

        vm.sharetoolObj.title = vm.sharetool.Data[0].title;
        vm.sharetoolObj.content = vm.sharetool.Data[0].content;
        vm.sharetoolObj.toolImageURL = imageUrl;
        // vm.sharetoolObj.toolImageURL = vm.sharetool.Data[0].toolImageURL;
        vm.sharetoolObj.$save(successCallback, errorCallback);
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
        $http.post('api/saveToolComment', {
          'comment': vm.comment.comment,
          'toolId': vm.sharetool.Data[0]
        });
        Socket.emit('sendToolComment', vm.sharetool.Data[0]);
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


    Socket.on('UpdateToolComments', function(tool_id) {
      console.log(vm.sharetool.Data[0]._id);
      console.log(tool_id);
      if (tool_id === vm.sharetool.Data[0]._id) {
        $http.post('/api/getToolComments', vm.sharetool.Data[0])
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
