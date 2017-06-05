'use strict';

angular.module('core').factory("homeServices", function($http, $q) {

  return {
    getLatestTools: function() {
      console.log('getLatestTools');
      var def = $q.defer();
      $http({
        "url": "/api/sharetools/latest",
        "method": "get",
      }).then(function(res) {
        console.log(res.data);
        def.resolve(res.data);
      }, function(err) {
        def.reject(err.data);
      });
      return def.promise;
    }
    // ,
    // getLatestHouses: function() {
    //   var def = $q.defer();
    //   $http({
    //     "url": "/api/sharehouses/latest",
    //     "method": "get",
    //   }).then(function(res) {
    //     def.resolve(res.data);
    //   }, function(err) {
    //     def.reject(err.data);
    //   });
    //   return def.promise;
    // }
  };

});
