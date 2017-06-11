'use strict';

angular.module('sharehouses').factory("commentHouseServices", function($http, $q) {

  return {
    removeComment: function(comment) {
      var def = $q.defer();
      $http({
        "url": "/api/removeHouseComment",
        "method": "post",
        "data": comment,
      }).then(function(res) {
        def.resolve(res.data);
      }, function(err) {
        def.reject(err.data);
      });
      return def.promise;
    },
  };

});
