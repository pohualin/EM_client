'use strict';
angular.module('emmiManager')
.controller('SearchOptionDropDownCtrl', function ($scope, $location) {
        $scope.changehref = function (option) {
            if(option==='Clients'){
                $location.path('/clients');
            }
            if(option==='Teams'){
                $location.path('/teams');
            }
        };
    });