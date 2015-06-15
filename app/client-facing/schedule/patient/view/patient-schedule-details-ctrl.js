'use strict';

angular.module('emmiManager')
    .controller('PatientScheduleDetailsController', ['$scope', 'team', 'client', 'PatientScheduleDetailsService', function($scope, team, client, PatientScheduleDetailsService){
        $scope.team = team;

        PatientScheduleDetailsService.getPatientScheduleDetails(team.patient).then(function(response){
            console.log(response);
        });
    }
    ])
;
