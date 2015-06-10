'use strict';

angular.module('emmiManager')
    .controller('ViewPatientController', ['$scope', 'team', 'client', 'ViewPatientService', function ($scope, team, client, ViewPatientService) {

        $scope.team = team;

        ViewPatientService.loadAllScheduledPatients(team).then(function(response){
            $scope.patients = response;
        });
    }
    ])
;
