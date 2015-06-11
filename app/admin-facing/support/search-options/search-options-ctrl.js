'use strict';
angular.module('emmiManager')
    .controller('SupportSearchOptionsCtrl', function ($scope, $location) {

        $scope.searchOptions = ['Client Users', 'Patients'];

        if ($location.path() === '/support/client_users') {
            $scope.option = 'Client Users';
        }

        if ($location.path() === '/support/patients') {
            $scope.option = 'Patients';
        }

        $scope.changehref = function (option) {
            if (option === 'Client Users') {
                $location.path('/support/client_users');
            }
            if (option === 'Patients'){
                $location.path('/support/patients');
            }
        };

    });
