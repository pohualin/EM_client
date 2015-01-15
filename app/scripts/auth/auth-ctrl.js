'use strict';

angular.module('emmiManager')
    .controller('LoginCtrl', function ($scope, $location, AuthSharedService, API) {
        $scope.credentials = {
            rememberMe: true
        };
        $scope.login = function (credentials) {
            AuthSharedService.login(credentials, API.authenticate);
        };
    })

    .controller('LogoutCtrl', function ($location, AuthSharedService, API) {
        AuthSharedService.logout(API.logout);
    })
;

