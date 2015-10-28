angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicPlatform, $cordovaLocalNotification, $cordovaGeolocation, $cordovaBluetoothSerial, $interval, $ionicLoading, $timeout) {

    $scope.lastSyncArduino = "Never";
    $scope.lastSyncServer = "Never";
    $scope.getDatetime = function () {
      return (new Date).getTime();
    };

    $scope.lat = 0;
    $scope.lng = 0;

    var watchOptions = {
      timeout : 5000,
      maximumAge: 3000,
      enableHighAccuracy: true // may cause errors if true
    };

    var pollCurrentLocation = function() {
      $cordovaGeolocation.getCurrentPosition(watchOptions)
        .then(function (position) {
          var lat  = position.coords.latitude
          var long = position.coords.longitude

          $scope.lat = lat;
          $scope.lng = long;
        }, function(err) {
          // error
          console.log("gps error", err);
        });
      setTimeout(pollCurrentLocation, 1000);
    };

      $scope.devices = null;
      $scope.listBluetoothDevices = function() {
        $scope.bluetooth_label = "Scanning...";
        // Setup the loader
        $ionicLoading.show({
          content: 'Scanning...',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
        bluetoothSerial.discoverUnpaired(
          function(unpaired_devices) {
            $timeout(function(){
              $scope.devices = unpaired_devices;
              angular.forEach(unpaired_devices, function(device){
                console.log(device);
              });
              $scope.bluetooth_label = "Done.";
              $ionicLoading.hide();
            });
          },
          function(){
            console.log("Bluetooth error.");
          });
      }

    /*$interval(
    $scope.scheduleSingleNotification = function () {
      $cordovaLocalNotification.schedule({
        id: 1,
        title: 'Infos',
        text: 'GPS: '+$scope.lat+ ' | ' + $scope.lng,
        data: {
          customProperty: 'custom value'
        }
      }).then(function (result) {
        console.log('Notification error');
      })
    }, 10000);*/

    $ionicPlatform.ready(function() {
      pollCurrentLocation();
    });

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
