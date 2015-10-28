angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $cordovaLocalNotification, $cordovaGeolocation, $cordovaBluetoothSerial, $interval) {

    $scope.lastSyncArduino = "Never";
    $scope.lastSyncServer = "Never";
    $scope.getDatetime = function () {
      return (new Date).getTime();
    };

    /*navigator.geolocation.getCurrentPosition(function (position) {
      $scope.lat = position.coords.latitude;
      $scope.lng = position.coords.longitude;
    });*/

    var watchOptions = {
      frequency : 1000,
      timeout : 5*60*1000,
      enableHighAccuracy: true
    };

    var watch = $cordovaGeolocation.watchPosition(watchOptions);
    watch.then(
      null,
      function(err) {
        alert("GPS Localization failed: "+JSON.stringify(err));
      },
      function(position) {
        $scope.lat = position.coords.latitude;
        $scope.lng = position.coords.longitude;
      });
      $scope.devices = "null";
      $scope.listBluetoothDevices = function() {
        bluetoothSerial.discoverUnpaired(
          function(undevices) {
            angular.forEach(undevices, function(device){
              $scope.devices.push(device);
            });
          },
          function(){
            console.log("Err");
          });
      }

    $interval(
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
    }, 10000);

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



