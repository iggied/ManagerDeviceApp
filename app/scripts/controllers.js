'use strict';
angular.module('ManagerDeviceApp.controllers', [])
.controller('AppCtrl', function($scope) {   })

.controller('LoginCtrl',
            ['$scope', '$state', '$rootScope', 'StaffAPIclient',
    function($scope, $state, $rootScope, StaffAPIclient) {
  $scope.staffInput = {
    Id: "",
    Pin: ""
  };

  $scope.staffLogin = function() {
    $rootScope.staffId = "";

    var staffId = $scope.staffInput.Id, staffPin = $scope.staffInput.Pin;

    StaffAPIclient.validateCreds({staffId: staffId, staffPin: staffPin},
      function(data) {
        if (data.success === "1") {
          $rootScope.staffId = staffId;
          $rootScope.staffName = data.value.name;
          $state.go('app.mainmenu');
        }
      });
  };
}])

.controller('OrdersCtrl',
            ['$scope', '$ionicScrollDelegate', 'Db', 'OrderRes',
    function($scope, $ionicScrollDelegate, Db, OrderRes) {
  $scope.orders = [];

  $scope.listCanSwipe = true;

  OrderRes.getPendingOrders()
  .$promise.then( function(data) {

    angular.forEach(data, function(item){
      $scope.orders.push(item);
    });

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

        //$scope.$apply();
        $ionicScrollDelegate.scrollBottom();
      })

    });

  });

  $scope.orderConfirmed = function(order) {
    console.log("order to confirm " + order._id);
    OrderRes.confirmOrderPart({id: order._id})
      .$promise.then( function(data) {
        console.log("order confirmed " + order._id)
      })
  }

  $scope.orderPartDelivered = function(order) {
    console.log("order to deliver " + order._id);
    OrderRes.orderPartDelivered({id: order._id})
      .$promise.then( function(data) {
        console.log("order delivered " + order._id)
      })
  }

}])
;
