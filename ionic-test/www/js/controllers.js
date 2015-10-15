angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $cordovaLocalNotification, $ionicPlatform) {

    $scope.lastSyncArduino = "Never";
    $scope.lastSyncServer = "Never";
    $scope.getDatetime = function () {
      return (new Date).getTime();
    };

    navigator.geolocation.getCurrentPosition(function (position) {
      $scope.lat = position.coords.latitude;
      $scope.lng = position.coords.longitude;
    });

    $scope.scheduleSingleNotification = function () {
      $cordovaLocalNotification.schedule({
        id: 1,
        title: 'Warning',
        text: 'Youre so sexy!',
        data: {
          customProperty: 'custom value'
        }
      }).then(function (result) {
        console.log('Notification 1 triggered');
      })
    }

    })
.controller('DatasCtrl', function($scope, Datas) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.datas = Datas.all();
  $scope.remove = function(data) {
    Datas.remove(data);
  };
})

.controller('DataDetailCtrl', function($scope, $stateParams, Datas) {
  $scope.data = Datas.get($stateParams.dataId);
})

.controller('SettingsCtrl', function($scope) {
  $scope.settings = {
    enableDebugMode: true
  };
});
