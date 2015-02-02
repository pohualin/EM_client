'use strict';

angular.module('emmiManager')
    .controller('LoginCtrl', function ($scope, $location, AuthSharedService, API, $rootScope) {
        $scope.credentials = {
            rememberMe: true
        };

        $rootScope.authenticationError = false;

        $scope.login = function (credentials) {
            $scope.loginForm.submitted = true;
            if ($scope.loginForm.$valid) {
                AuthSharedService.login(credentials, API.authenticate);
            }
        };
    })

    .controller('LogoutCtrl', function ($location, AuthSharedService, API) {
        AuthSharedService.logout(API.logout);
    })
;

