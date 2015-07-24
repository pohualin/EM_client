'use strict';

angular.module('emmiManager')
    .controller('loginInterruption', ['$scope', '$alert', '$location', 'locationBeforeLogin', 'account',
        function ($scope, $alert, $location, locationBeforeLogin, account) {
            $scope.account = account;
            $scope.userClientReqdResource = account;
            $scope.locationBeforeLogin = locationBeforeLogin;
        }])
;

