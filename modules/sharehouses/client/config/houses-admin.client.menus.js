'use strict';

// Configuring the Articles module
angular.module('sharehouses').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Houses',
      state: 'admin.houses'
    });
  }
]);
