(function(angular, $) {
  'use strict';

  angular.module('itcast-tms.controllers')
    .controller('MainController', [
      '$location',
      '$timeout',
      'Setting',
      MainController
    ]);

  function MainController($location, $timeout, Setting) {

    this.options = $.options;

    // ===== theme =====
    this.theme = Setting.get('theme', 'default');
    this.changeTheme = () => {
      Setting.set('theme', this.theme);
    };

    // ===== title =====
    this.title = $.options.app_name;

    // ===== window button =====
    this.window = (action) => {
      const mainWindow = $.electron.remote.BrowserWindow.getFocusedWindow();
      // console.log(mainWindow);
      mainWindow && mainWindow[action] && mainWindow[action]();
    };

    // ===== sidebar =====
    this.sidebarOpened = false;
    $timeout(() => {
      this.sidebarOpened = Setting.get('sidebar_opened');
    }, 500);
    this.toggleSidebar = () => {
      this.sidebarOpened = !this.sidebarOpened;
      Setting.set('sidebar_opened', this.sidebarOpened);
    };
    this.sidebarWidth = Setting.get('sidebar_width') || '222px';


    // ===== settings =====
    this.settingsOpened = false;

    // ===== about =====
    this.aboutOpened = false;

    // ===== current file =====
    // this

    // ===== redirect to =====
    this.go = (url) => {
      $location.url(url);
    };

    this.openExternal = (link) => {
      $.electron.shell.openExternal(link);
    };

  }

}(angular, $));