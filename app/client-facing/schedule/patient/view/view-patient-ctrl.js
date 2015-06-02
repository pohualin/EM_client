'use strict';

angular.module('emmiManager')
    .controller('ViewPatientController', ['$scope', 'team', 'client', 'ViewPatientService', function ($scope, team, client, ViewPatientService) {
console.log(client);
        $scope.a = team;
        console.log($scope.a);

        $scope.getAllClientPatients = function (team) {
            ViewPatientService.allClientPatients(team).then(function(response){
               console.log(response);
                $scope.patients = response;
            });
        };
    }
    ])
;
