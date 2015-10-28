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

.controller('DataDetailCtrl', function($scope, $stateParams, Datas) {
   $scope.data = Datas.get($stateParams.dataId);
})

.controller('SettingsCtrl', function($scope) {
  $scope.settings = {
    enableDebugMode: true
  };
})

.controller('MapCtrl', function($scope, $ionicLoading, $compile) {
  function initialize() {

    var geocoder = new google.maps.Geocoder();
    var location = "114 rue Lucien Faure Bordeaux";
    geocoder.geocode( { 'address': location }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        posEpsi = results[0].geometry.location;
        map.setCenter(results[0].geometry.location);
      } else {
        alert("Could not find location: " + location);
      }
    });


    var mapOptions = {
      streetViewControl:true,
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

  //Marker + infowindow + angularjs compiled ng-click
    var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
    var compiled = $compile(contentString)($scope);

    var infowindow = new google.maps.InfoWindow({
      content: compiled[0]
    });

    var marker = new google.maps.Marker({
      position: posEpsi,
      map: map,
      title: 'Je suis ICI !!!'
    });


    var infowindow = new google.maps.InfoWindow({
      content:"Project Location"
    });

    infowindow.open(map,marker);

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map,marker);
    });

    $scope.map = map;

  }

  initialize();

  //google.maps.event.addDomListener(window, 'load', initialize);

  $scope.centerOnMe = function() {
    if(!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });
    navigator.geolocation.getCurrentPosition(function(pos) {
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $scope.loading.hide();
    }, function(error) {
      alert('Unable to get location: ' + error.message);
    });
  };

  $scope.clickTest = function() {
    alert('Example of infowindow with ng-click')
  };

});



