'use strict';

angular.module('emmiManager')
    .controller('LoginCtrl', function ($scope, $location, AuthSharedService, API) {
        $scope.credentials = {
            username: 'super_admin',
            password: 'super_admin',
            rememberMe: false
        };
        $scope.login = function (credentials) {
            AuthSharedService.login(credentials, API.authenticate);
        };
    })

    .controller('LogoutCtrl', function ($location, AuthSharedService, API) {
        AuthSharedService.logout(API.logout);
    })
;

