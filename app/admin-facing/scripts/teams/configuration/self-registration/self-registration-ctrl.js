'use strict';

angular.module('emmiManager')
    .controller('SelfRegistrationController',['$scope', function($scope){


        console.log($scope.team);
        $scope.saveSelfRegistrationCode = function(valid){

          console.log('saveSelfRegistrationCode');
            //$scope.showSelfRegistrationConfig = true;
            console.log(valid);
        };


    }])
;
