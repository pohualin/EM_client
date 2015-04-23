'use strict';

angular.module('emmiManager')
    .controller('loginInterruption', ['$scope', '$alert', '$location', 'locationBeforeLogin', 'account', 'userClientReqdResource',
        function ($scope, $alert, $location, locationBeforeLogin, account, userClientReqdResource) {
            $scope.account = account;
            $scope.userClientReqdResource = userClientReqdResource;
            $scope.locationBeforeLogin = locationBeforeLogin;
        }])
;

