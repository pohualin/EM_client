'use strict';

angular.module('emmiManager')
    .controller('loginInterruption', ['$scope', '$alert', '$location', 'locationBeforeLogin', 'account', 'userClientReqdResource', 'ValidationService',
        function ($scope, $alert, $location, locationBeforeLogin, account, userClientReqdResource,ValidationService) {
            $scope.account = account;
            $scope.userClientReqdResource = userClientReqdResource;
            $scope.locationBeforeLogin = locationBeforeLogin;

            ValidationService.get($scope.userClientReqdResource).then(function (accountWithOriginalEmail) {
                $scope.account.originalUserClientEmail = accountWithOriginalEmail.originalUserClientEmail;
            });
        }])
;

