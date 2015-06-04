'use strict';
angular.module('emmiManager')
    .controller('SupportSearchOptionsCtrl', function ($scope, $location) {
        
        $scope.searchOptions = ['Client Users'];
        
        if ($location.path() === '/support/client_users'){
            $scope.option = 'Client Users';
        }
        
        $scope.changehref = function (option) {
            if (option === 'Client Users') {
                $location.path('/support/client_users');
            }
        };

    });