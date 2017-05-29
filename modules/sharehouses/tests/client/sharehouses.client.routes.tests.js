(function () {
  'use strict';

  describe('Sharehouses Route Tests', function () {
    // Initialize global variables
    var $scope,
      SharehousesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SharehousesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SharehousesService = _SharehousesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('sharehouses');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/sharehouses');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          SharehousesController,
          mockSharehouse;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('sharehouses.view');
          $templateCache.put('modules/sharehouses/client/views/view-sharehouse.client.view.html', '');

          // create mock Sharehouse
          mockSharehouse = new SharehousesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Sharehouse Name'
          });

          // Initialize Controller
          SharehousesController = $controller('SharehousesController as vm', {
            $scope: $scope,
            sharehouseResolve: mockSharehouse
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:sharehouseId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.sharehouseResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            sharehouseId: 1
          })).toEqual('/sharehouses/1');
        }));

        it('should attach an Sharehouse to the controller scope', function () {
          expect($scope.vm.sharehouse._id).toBe(mockSharehouse._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/sharehouses/client/views/view-sharehouse.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SharehousesController,
          mockSharehouse;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('sharehouses.create');
          $templateCache.put('modules/sharehouses/client/views/form-sharehouse.client.view.html', '');

          // create mock Sharehouse
          mockSharehouse = new SharehousesService();

          // Initialize Controller
          SharehousesController = $controller('SharehousesController as vm', {
            $scope: $scope,
            sharehouseResolve: mockSharehouse
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.sharehouseResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/sharehouses/create');
        }));

        it('should attach an Sharehouse to the controller scope', function () {
          expect($scope.vm.sharehouse._id).toBe(mockSharehouse._id);
          expect($scope.vm.sharehouse._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/sharehouses/client/views/form-sharehouse.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SharehousesController,
          mockSharehouse;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('sharehouses.edit');
          $templateCache.put('modules/sharehouses/client/views/form-sharehouse.client.view.html', '');

          // create mock Sharehouse
          mockSharehouse = new SharehousesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Sharehouse Name'
          });

          // Initialize Controller
          SharehousesController = $controller('SharehousesController as vm', {
            $scope: $scope,
            sharehouseResolve: mockSharehouse
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:sharehouseId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.sharehouseResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            sharehouseId: 1
          })).toEqual('/sharehouses/1/edit');
        }));

        it('should attach an Sharehouse to the controller scope', function () {
          expect($scope.vm.sharehouse._id).toBe(mockSharehouse._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/sharehouses/client/views/form-sharehouse.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
