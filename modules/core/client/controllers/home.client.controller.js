'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$http', 'homeServices',
  function ($scope, Authentication, $http, homeServices) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    console.log("home Controller");
    homeServices.getLatestTools().then(function(res) {
      console.log(res);
      if (res && !res.status) {
        console.log(res);
        $scope.latestTools = res;

      } else {
        console.log("no posts");
      }

    });

  }
]);
