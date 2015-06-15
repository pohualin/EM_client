'use strict';

angular.module('emmiManager')
    .controller('PatientScheduleDetailsController', ['$scope', 'team', 'client', 'PatientScheduleDetailsService',
        function($scope, team, client, PatientScheduleDetailsService){

        $scope.team = team;

        PatientScheduleDetailsService.getPatientScheduleDetails(team, team.patient).then(function(response){
            $scope.scheduledProgs = response.data.content;
        });

    }
    ])
;
