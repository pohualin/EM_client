'use strict';

angular.module('emmiManager')
    .controller('loginInterruption', ['$scope', '$alert', '$location', 'locationBeforeLogin', 'account', 'userClientReqdResource','userData',
        function ($scope, $alert, $location, locationBeforeLogin, account, userClientReqdResource, userData) {
            $scope.account = account;
            $scope.userClientReqdResource = userClientReqdResource;
            $scope.locationBeforeLogin = locationBeforeLogin;
            $scope.userData = userData;
        }])
;

