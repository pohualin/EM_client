'use strict';

angular.module('emmiRouter')
    .controller('MainCtrl', function ($scope) {
        $scope.today = new Date();
    })
;
