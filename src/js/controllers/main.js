(function(angular) {
  'use strict';

  const remote = require('electron').remote;
  const BrowserWindow = remote.BrowserWindow;

  angular.module('itcast-tms.controllers')
    .controller('MainController', [
      '$scope',
      '$rootScope',
      '$location',
      '$timeout',
      function($scope, $rootScope, $location, $timeout) {
        window.root = $rootScope;
        window.scope = $scope;

        // ===== theme =====
        $scope.theme = 'default';

        // ===== title =====
        $scope.title = 'Hello world';

        // ===== window button =====
        $scope.window = (action) => {
          const mainWindow = remote && remote.BrowserWindow.getFocusedWindow();
          // console.log(mainWindow);
          mainWindow && mainWindow[action] && mainWindow[action]();
        };

        // ===== sidebar =====
        $scope.sidebarOpened = false;
        $timeout(function() {
          $scope.sidebarOpened = true;
        }, 100);
        $scope.toggleSidebar = () => {
          $scope.sidebarOpened = !$scope.sidebarOpened;
        };


        // ===== settings =====
        $scope.settingsOpened = false;

        // ===== about =====
        $scope.aboutOpened = false;
        // $scope.about = () => {
        //   // const params = { toolbar: false, resizable: false, alwaysOnTop: true, height: 150, width: 400, title: 'About' };
        //   // const aboutWindow = new BrowserWindow(params);
        //   // const root = $window.location.href;
        //   // console.log(root);
        //   // window.$location = $location;
        //   // aboutWindow.loadURL('about.html');
        // }
        //

        // ===== current file =====
        // $scope

        // ===== redirect to =====
        $scope.go = (url) => {
          $location.url(url);
        };

      }
    ]);

}(angular));
