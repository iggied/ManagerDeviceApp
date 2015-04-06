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

      $scope.listCanSwipe = true

    OrderRes.getPendingOrders()
      .$promise.then( function(data) {

        angular.forEach(data, function(item){
          $scope.orders.push(item);
        })

        Db( function(err, info) {

          Db.changes({since : info.update_seq, include_docs: true}, function(err, changes){
            //lastSeq = change.seq
            console.log("change", err, changes);


            var oindex =  _.findIndex($scope.orders, {_id: changes.id});
            if (oindex < 0)  {
              $scope.orders.push(changes.doc);
              console.log("order added to list");
            }
            else {
              $scope.orders[oindex] = changes.doc;
              console.log("order updated in list at index " + oindex);
            }

            //OrderRes.getOrderById({id: change.id})
            //  .$promise.then( function (order) {
            //angular.forEach(changes.results, function(change) {

            //})
                //$scope.$apply();
            $ionicScrollDelegate.scrollBottom();
            //  });
          })

        });

      })


      $scope.orderConfirmed = function(order) {
        console.log("order to confirm " + order._id)
        OrderRes.confirmOrderPart({id: order._id})
          .$promise.then( function(data) {
            console.log("order confirmed " + order._id)
          })
      }


}])

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
