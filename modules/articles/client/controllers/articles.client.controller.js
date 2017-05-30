'use strict';

// Articles controller
angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles', 'Upload', '$http',
  function ($scope, $stateParams, $location, Authentication, Articles, Upload, $http) {
    $scope.authentication = Authentication;

    // Create new Article
    $scope.create = function (isValid) {
      $scope.error = null;
      // $scope.upload($scope.file);
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }
      console.log(this.myFile);
      var imageUrl = 'public/uploads/'+this.myFile.name;
      // Create new Article object
      var article = new Articles({
        title: this.title,
        content: this.content,
        imageURL: imageUrl
      });
      console.log(imageUrl);
      var file = $scope.myFile;
       var uploadUrl = "/multer";
       var fd = new FormData();
       fd.append('file', file);
       console.log('before Post');
       $http.post(uploadUrl,fd, {
           transformRequest: angular.identity,
           headers: {'Content-Type': undefined}
       })
       .success(function(){
         console.log("success!!");
       })
       .error(function(){
         console.log("error!!");
       });

      // Redirect after save
      article.$save(function (response) {
        $location.path('articles/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Article
    $scope.remove = function (article) {
      if (article) {
        article.$remove();

        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }
      } else {
        $scope.article.$remove(function () {
          $location.path('articles');
        });
      }
    };

    // Update existing Article
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      var article = $scope.article;

      article.$update(function () {
        $location.path('articles/' + article._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Articles
    $scope.find = function () {
      $scope.articles = Articles.query();
    };

    // Find existing Article
    $scope.findOne = function () {
      $scope.article = Articles.get({
        articleId: $stateParams.articleId
      });
    };

    $scope.upload = function (file) {
       Upload.upload({
           url: '/api/uploads',
           method: 'POST',
           data: {file: file}
       }).then(function (resp) {
           console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
       }, function (resp) {
           console.log('Error status: ' + resp.status);
       }, function (evt) {
           var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
           console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
       });
   };
  //  // for multiple files:
  //  $scope.uploadFiles = function (files) {
  //    if (files && files.length) {
  //      for (var i = 0; i < files.length; i++) {
  //        Upload.upload({..., data: {file: files[i]}, ...})...;
  //      }
  //      // or send them all together for HTML5 browsers:
  //      Upload.upload({..., data: {file: files}, ...})...;
  //    }
  //  };

  }
]);
