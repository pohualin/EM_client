'use strict';

var emClientControllers = angular.module('emClientControllers', []);

emClientControllers.controller('ClientCtrl', function($scope, $location, Client) {
    //$scope.phones = Phone.query();
    //$scope.orderProp = 'age';

    $scope.insertClient = function () {
        var name = $scope.newClient.name;
        var type = $scope.newClient.type;
        var region = $scope.newClient.region;
        Client.insertClient(name, type, region);
        $scope.newClient.name = '';
        $scope.newClient.type = '';
        $scope.newClient.region = '';
        $location.path('/clients');
    };

});

emClientControllers.controller('ClientListCtrl', function($scope, Client) {
    //$scope.phones = Phone.query();
    //$scope.orderProp = 'age';

    $scope.clients = Client.getClients();
});

emClientControllers.controller('ClientDetailCtrl', function($scope, $routeParams, Client) {
    // $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
    //   $scope.mainImageUrl = phone.images[0];
    // });

    // $scope.setImage = function(imageUrl) {
    //   $scope.mainImageUrl = imageUrl;
    // }
});
