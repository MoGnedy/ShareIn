'use strict';

angular.module('sharetools').factory("commentToolServices", function($http, $q) {
  return {
    removeComment: function(comment) {
      var def = $q.defer();
      console.log(comment);
      $http({
        "url": "/api/removeToolComment",
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
