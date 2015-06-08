'use strict';

angular.module('emmiManager')
    .controller('ViewPatientController', ['$scope', 'team', 'client', 'ViewPatientService', function ($scope, team, client, ViewPatientService) {
        $scope.getAllClientPatients = function (team) {
            ViewPatientService.allClientPatients(team).then(function(response){
                $scope.patients = response;
            });
        };
    }
    ])
;
