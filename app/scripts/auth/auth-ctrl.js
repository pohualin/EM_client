'use strict';

angular.module('emmiManager')
    .controller('LoginCtrl', function ($scope, $location, AuthSharedService, api) {
        $scope.credentials = {
            username: 'super_admin',
            password: 'super_admin',
            rememberMe: false
        };
        $scope.login = function (credentials) {
            AuthSharedService.login(credentials, api['authenticate-link'].href);
        };
    })

    .controller('LogoutCtrl', function ($location, AuthSharedService, api) {
        AuthSharedService.logout(api['logout-link'].href);
    })
;

