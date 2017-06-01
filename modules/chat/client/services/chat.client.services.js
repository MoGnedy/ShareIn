'use strict';

angular.module('chat').factory("privateMessages", function($http, $q, $scope, $rootScope) {

  return {
    getPrivateMsgs: function(msgsData) {
      var def = $q.defer();
      $http({
        "url": "/api/getprivatemsgs",
        "method": "post",
        "data": msgsData
      }).then(function(res) {
        def.resolve(res.data);
      }, function(err) {
        def.reject(err.data);
      });
      return def.promise;
    },
    savePrivateMsg: function(msgsData) {
      var def = $q.defer();
      $http({
        "url": "/api/savePrivateMsg",
        "method": "post",
        "data": msgsData
      }).then(function(res) {
        def.resolve(res.data);
      }, function(err) {
        def.reject(err.data);
      });
      return def.promise;
    },
    getPrivateUser: function(id) {
      var def = $q.defer();
      $http({
        "url": "/api/getPrivateUser",
        "method": "post",
        "data": id
      }).then(function(res) {
        def.resolve(res.data);
      }, function(err) {
        def.reject(err.data);
      });
      return def.promise;
    },
    test: function() {
      console.log('test func');
      $scope.startPrivateChat();
    },


  };

});



angular.module('chat').service('lazyLoadApi', function lazyLoadApi($window, $q) {
  function loadScript() {
    console.log('loadScript');
      // use global document since Angular's $document is weak
    var s = document.createElement('script');
    s.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyByYK8e9xjh8ZKNGEoxgeOYVgK_r2Pq1jM';
    document.body.appendChild(s);
  }
  var deferred = $q.defer();

  $window.initMap = function() {
    deferred.resolve();
  };

  if ($window.attachEvent) {
    $window.attachEvent('onload', loadScript);
  } else {
    $window.addEventListener('load', loadScript, false);
  }

  return deferred.promise;
});
