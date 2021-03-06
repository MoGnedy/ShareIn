(function() {
  'use strict';

  // Sharetools controller
  angular
    .module('sharetools')
    .controller('SharetoolsController', SharetoolsController);

  SharetoolsController.$inject = ['$scope', '$rootScope', '$state', '$window', 'Authentication', 'sharetoolResolve', '$http', '$compile', 'Socket', 'commentToolServices'];

  function SharetoolsController($scope, $rootScope, $state, $window, Authentication, sharetool, $http, $compile, Socket, commentToolServices, sharetoolResolve) {
    var vm = this;
    vm.stateName = $state.current.name;
    console.log($state.current.name);
    vm.authentication = Authentication;
    vm.sharetool = sharetool;
    vm.sharetoolObj = sharetool;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.saveComment = saveComment;
    vm.commentRemove = commentRemove;
    console.log(commentToolServices);
    if (!Socket.socket) {
      Socket.connect();
      console.log("ShareTools connected");
    }
    //maps
    // $scope.$on('$viewContentLoaded', function() {
    //   angular.element(document.querySelector('.mapContainer')).append('<div id="map" style="height:200px;"></div>');
    //   if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(function (pos) {
    //       console.log(pos);
    //       var uluru = {lat: pos.coords.latitude, lng: pos.coords.longitude};
    //       var map = new google.maps.Map(document.getElementById('map'), {
    //           zoom: 18,
    //           center: uluru
    //         });
    //         var marker = new google.maps.Marker({
    //           position: uluru,
    //           map: map
    //         });
    //         map.addListener('click',function (e) {
    //           console.log(e);
    //           marker.setPosition(e.latLng);
    //           map.panTo(marker.getPosition());
    //         });
    //     });
    //   }
    //
    // })


    // Remove existing Sharetool
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.sharetoolObj._id = vm.sharetool.Data[0]._id;
        vm.sharetoolObj.$remove();
        if (vm.stateName === 'admin.tool'){
          $state.go('admin.tools');
        }else{
          $state.go('sharetools.list');
        }
      }
    }

    // Save Sharetool
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.sharetoolForm');
        return false;
      }

      var imageUrl;
      var file = vm.myFile;
      var uploadUrl = "/multerTool";
      var fd = new FormData();

      console.log(vm.sharetool.Data[0]);
      console.log(vm.myFile);
      // TODO: move create/update logic to service
      if (vm.sharetool.Data[0]._id) {
        if (vm.myFile){
          imageUrl = './modules/sharetools/client/img/tool/' + vm.myFile.name;
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

        }
        if (vm.myFile){
          console.log('tmam');
          vm.sharetoolObj.toolImageURL = imageUrl;
        }
        vm.sharetoolObj._id = vm.sharetool.Data[0]._id;
        vm.sharetoolObj.title = vm.sharetool.Data[0].title;
        vm.sharetoolObj.content = vm.sharetool.Data[0].content;
        vm.sharetoolObj.location = vm.sharetool.Data[0].location;
        // vm.sharetoolObj.toolImageURL = vm.sharetool.Data[0].toolImageURL;
        vm.sharetoolObj.$update(successCallback, errorCallback);
      } else {

        console.log(vm.myFile);
        if (vm.myFile){
          imageUrl = './modules/sharetools/client/img/tool/' + vm.myFile.name;
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

        }
        if (vm.myFile){
          console.log('tmam');
          vm.sharetoolObj.toolImageURL = imageUrl;
        }
        vm.sharetoolObj.title = vm.sharetool.Data[0].title;
        vm.sharetoolObj.content = vm.sharetool.Data[0].content;
        vm.sharetoolObj.location = vm.sharetool.Data[0].location;
        vm.sharetoolObj.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        if (vm.stateName === 'admin.tool-create'){
          $state.go('admin.tool', {
            sharetoolId: res._id
          });
        }else{
          $state.go('sharetools.view', {
            sharetoolId: res._id
          });
        }

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

    function commentRemove(comment_id, i) {
      console.log(comment_id);
      // console.log(tool_id);
      // console.log(angular.element(document.querySelector('#'+user._id)));
      // angular.element(document.querySelector('#\\'+user._id)).remove();
      if ($window.confirm('Are you sure you want to delete?')) {
        // var commentData = {'tool_id':tool_id, 'comment_id':comment_id,}
        var comment = {'comment': comment_id};
        console.log(comment_id);
        console.log(comment);
        commentToolServices.removeComment(comment).then(function(res) {
          console.log(res);

          if (res && !res.status) {

            vm.sharetool.Data[1].splice(i, 1);
            // $rootScope.$apply();
          } else {
            console.log("send error");
          }


        });

      }

    }


    Socket.on('UpdateToolComments', function(tool_id) {
      console.log(vm.sharetool);
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
