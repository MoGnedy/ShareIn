(function () {
  'use strict';

  describe('Sharetools Controller Tests', function () {
    // Initialize global variables
    var SharetoolsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      SharetoolsService,
      mockSharetool;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _SharetoolsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      SharetoolsService = _SharetoolsService_;

      // create mock Sharetool
      mockSharetool = new SharetoolsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Sharetool Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Sharetools controller.
      SharetoolsController = $controller('SharetoolsController as vm', {
        $scope: $scope,
        sharetoolResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleSharetoolPostData;

      beforeEach(function () {
        // Create a sample Sharetool object
        sampleSharetoolPostData = new SharetoolsService({
          name: 'Sharetool Name'
        });

        $scope.vm.sharetool = sampleSharetoolPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (SharetoolsService) {
        // Set POST response
        $httpBackend.expectPOST('api/sharetools', sampleSharetoolPostData).respond(mockSharetool);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Sharetool was created
        expect($state.go).toHaveBeenCalledWith('sharetools.view', {
          sharetoolId: mockSharetool._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/sharetools', sampleSharetoolPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Sharetool in $scope
        $scope.vm.sharetool = mockSharetool;
      });

      it('should update a valid Sharetool', inject(function (SharetoolsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/sharetools\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('sharetools.view', {
          sharetoolId: mockSharetool._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (SharetoolsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/sharetools\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Sharetools
        $scope.vm.sharetool = mockSharetool;
      });

      it('should delete the Sharetool and redirect to Sharetools', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/sharetools\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('sharetools.list');
      });

      it('should should not delete the Sharetool and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
