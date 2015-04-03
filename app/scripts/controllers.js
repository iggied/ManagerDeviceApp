'use strict';
angular.module('ManagerDeviceApp.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/old_login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  }
})

.controller('LoginCtrl', ['$scope', '$state', '$rootScope', 'StaffAPIclient', function($scope, $state, $rootScope, StaffAPIclient) {
  $scope.staffInput = {
    Id: "",
    Pin: ""
  };

  $scope.staffLogin = function() {
    $rootScope.staffId = "";

    var staffId = $scope.staffInput.Id, staffPin = $scope.staffInput.Pin;

    StaffAPIclient.validateCreds({staffId: staffId, staffPin: staffPin},
      function(data) {
        if (data.valid === "1") {
          $rootScope.staffId = staffId;
          $state.go('app.mainmenu');
        }
      });
  };
}])

.controller('OrdersCtrl', ['$scope', '$ionicScrollDelegate', 'Db', 'OrderRes',
    function($scope, $ionicScrollDelegate, Db, OrderRes) {
  $scope.orders = [];

    OrderRes.getPendingOrders()
      .$promise.then( function(data) {

        angular.forEach(data, function(item){
          $scope.orders.push(item);
        })

        Db( function(err, info) {

          Db.changes({since : info.update_seq}, function(err, change){
            //lastSeq = change.seq
            console.log("change", err, change);

            OrderRes.getOrderById({id: change.id})
              .$promise.then( function (order) {
                $scope.orders.push(order);
                //$scope.$apply();
                $ionicScrollDelegate.scrollBottom();
              });
          })

        });

      })

}])

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
