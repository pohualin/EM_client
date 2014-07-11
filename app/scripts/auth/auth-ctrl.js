'use strict';

emmiManager.controller('LoginCtrl', function ($scope, $location, AuthSharedService, api) {
    $scope.credentials = {
        username: '',
        password: ''
    };
    $scope.login = function (credentials) {
        AuthSharedService.login(credentials, api);
    };
});

emmiManager.controller('LogoutCtrl', function ($location, AuthSharedService) {
    AuthSharedService.logout();
});
