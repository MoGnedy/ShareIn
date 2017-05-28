'use strict';

angular.module('chat').factory("privateMessages", function($http, $q, $rootScope) {

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


  };

});
