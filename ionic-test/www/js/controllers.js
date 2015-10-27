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
      var site = new google.maps.LatLng(55.9879314,-4.3042387);
      var hospital = new google.maps.LatLng(55.8934378,-4.2201905);

      var mapOptions = {
        streetViewControl:true,
        center: site,
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.TERRAIN
      };
      var map = new google.maps.Map(document.getElementById("map"),
        mapOptions);

      //Marker + infowindow + angularjs compiled ng-click
      var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
      var compiled = $compile(contentString)($scope);

      var infowindow = new google.maps.InfoWindow({
        content: compiled[0]
      });

      var marker = new google.maps.Marker({
        position: site,
        map: map,
        title: 'Strathblane (Job Location)'
      });

      var hospitalRoute = new google.maps.Marker({
        position: hospital,
        map: map,
        title: 'Hospital (Stobhill)'
      });

      var infowindow = new google.maps.InfoWindow({
        content:"Project Location"
      });

      infowindow.open(map,marker);

      var hospitalwindow = new google.maps.InfoWindow({
        content:"Nearest Hospital"
      });

      hospitalwindow.open(map,hospitalRoute);

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
      });

      $scope.map = map;

      var directionsService = new google.maps.DirectionsService();
      var directionsDisplay = new google.maps.DirectionsRenderer();

      var request = {
        origin : site,
        destination : hospital,
        travelMode : google.maps.TravelMode.DRIVING
      };
      directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        }
      });

      directionsDisplay.setMap(map);

    }

    google.maps.event.addDomListener(window, 'load', initialize);

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



