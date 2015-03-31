'use strict';

angular.module('emmiManager')
    .controller('loginInterruptService', ['$scope', '$alert', '$location', 'account', 'locationBeforeLogin',
        function ($scope, $alert, $location, account, locationBeforeLogin) {
            /**
             * functionality if user clicks not now
             */
            $scope.notNow = function () {
                $location.path(locationBeforeLogin).replace();
            };
        }]);