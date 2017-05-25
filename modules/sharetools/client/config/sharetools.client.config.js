(function () {
  'use strict';

  angular
    .module('sharetools')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Sharetools',
      state: 'sharetools',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'sharetools', {
      title: 'List Sharetools',
      state: 'sharetools.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'sharetools', {
      title: 'Create Sharetool',
      state: 'sharetools.create',
      roles: ['user']
    });
  }
}());
