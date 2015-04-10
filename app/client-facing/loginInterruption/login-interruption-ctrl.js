'use strict';

angular.module('emmiManager')
    .controller('loginInterruption', ['$scope', '$alert', '$location', 'locationBeforeLogin', 'account', '$controller','$q',
        function ($scope, $alert, $location, locationBeforeLogin, account, $controller, $q) {
            $scope.account = account;
            $scope.locationBeforeLogin = locationBeforeLogin;
        }])
;

