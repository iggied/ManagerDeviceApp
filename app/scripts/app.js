'use strict';
// Ionic Starter App, v0.9.20

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('ManagerDeviceApp', ['ionic', 'config', 'ngResource', 'ManagerDeviceApp.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });
})

.constant('managerUrl', 'http://192.168.56.101:8080/outlet/serve')

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('login', {
      url: '/login',
      views: {
        '@': {
          templateUrl: 'login.html',
          controller: 'LoginCtrl'
        }
      }
    })

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })

    .state('app.orders', {
      url: '/orders',
      views: {
        'menuContent' :{
          templateUrl: 'templates/orders.html',
          controller: 'OrdersCtrl'
        }
      }
    })

    .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent' :{
          templateUrl: 'templates/browse.html'
        }
      }
    })

    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent' :{
          templateUrl: 'templates/orders.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

    .state('app.single', {
      url: '/playlists/:playlistId',
      views: {
        'menuContent' :{
          templateUrl: 'templates/playlist.html',
          controller: 'PlaylistCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/orders');
})

.factory('Db', function(){
  var Coax = require("coax");
  return Coax(['http://username:password@localhost:5984', 'orderdb']);
})

.factory('StaffAPIclient', ['$resource', 'managerUrl', function($resource, managerUrl) {

    return $resource( managerUrl, {},
      {validateCreds: {method: 'GET', params: {action: "VALIDATECREDS", staffId: "@StaffId", staffPin: "@StaffPin"}}});
}])


.factory('OrderRes', ['$resource', 'managerUrl', function($resource, managerUrl) {

    return $resource( managerUrl, {action: "@action"},
        {getOrderById: {method: 'GET', params: {action: "GETORDERBYID", id: "@id"} }}
    );
  }
])
;

