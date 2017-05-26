'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$rootScope', '$state', 'Authentication', 'Menus', 'Socket',
  function ($scope, $rootScope, $state, Authentication, Menus, Socket) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });


    Socket.on('onlineUsers', function (onlineUsers) {
      $rootScope.onlineUsers = onlineUsers;
    });

  }
]);
