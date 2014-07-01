'use strict';

var emAuthControllers = angular.module('emAuthControllers', ['emAuthServices']);

emAuthControllers.controller('LoginCtrl', function($scope, $location, AuthSharedService) {
    $scope.credentials = {
        username: '',
        password: ''
    };
    $scope.login = function (credentials) {
       AuthSharedService.login(credentials);
    };
});

emAuthControllers.controller('LogoutCtrl', function($location, AuthSharedService) {
    AuthSharedService.logout();
});
