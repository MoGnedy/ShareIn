'use strict';

// Configuring the Articles module
angular.module('sharetools').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Tools',
      state: 'admin.tools'
    });
  }
]);
