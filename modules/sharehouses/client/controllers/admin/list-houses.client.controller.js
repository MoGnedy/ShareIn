  'use strict';

  angular
    .module('sharehouses')
    .controller('HousesListController', ['$scope', '$filter', 'Admin', 'SharehousesService',
      function($scope, $filter, Admin, SharehousesService) {

        SharehousesService.query(function (data) {
          $scope.sharehouses = data;
          console.log($scope.sharehouses);
          $scope.buildPager();
        });

        // $scope.sharehouses = SharehousesService.query();
        // $scope.buildPager();
        $scope.buildPager = function() {
          $scope.pagedItems = [];
          $scope.itemsPerPage = 10;
          $scope.currentPage = 1;
          $scope.figureOutItemsToDisplay();
        };

        $scope.figureOutItemsToDisplay = function() {
          $scope.filteredItems = $filter('filter')($scope.sharehouses, {
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
