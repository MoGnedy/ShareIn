(function () {
  'use strict';

  angular
    .module('sharehouses')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Sharehouses',
      state: 'sharehouses',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'sharehouses', {
      title: 'List Sharehouses',
      state: 'sharehouses.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'sharehouses', {
      title: 'Create Sharehouse',
      state: 'sharehouses.create',
      roles: ['user']
    });
  }
}());
