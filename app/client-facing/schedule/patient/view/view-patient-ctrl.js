'use strict';

angular.module('emmiManager')
    .controller('ViewPatientController', ['$scope', 'team', 'client', 'ViewPatientService', function ($scope, team, client, ViewPatientService) {
        ViewPatientService.allClientPatients(team).then(function(response){
            $scope.patients = response;
        });
    }
    ])
;
