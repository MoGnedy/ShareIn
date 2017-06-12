  'use strict';

  angular
    .module('sharetools')
    .controller('ToolsListController', ['$scope', '$filter', 'Admin', 'SharetoolsService',
      function($scope, $filter, Admin, SharetoolsService) {

        SharetoolsService.query(function (data) {
          $scope.sharetools = data;

          console.log($scope.sharetools);
          $scope.buildPager();
        });

        // $scope.sharetools = SharetoolsService.query();
        // $scope.buildPager();
        $scope.buildPager = function() {
          $scope.pagedItems = [];
          $scope.itemsPerPage = 10;
          $scope.currentPage = 1;
          $scope.figureOutItemsToDisplay();
        };

        $scope.figureOutItemsToDisplay = function() {
          $scope.filteredItems = $filter('filter')($scope.sharetools, {
            $: $scope.search
          });
          $scope.filterLength = $scope.filteredItems.length;
          var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
          var end = begin + $scope.itemsPerPage;
          $scope.pagedItems = $scope.filteredItems.slice(begin, end);
        };

        $scope.pageChanged = function() {
          $scope.figureOutItemsToDisplay();
        };

      }
    ]);
