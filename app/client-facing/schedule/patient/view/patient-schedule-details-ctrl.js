'use strict';

angular.module('emmiManager')
    .controller('PatientScheduleDetailsController', ['team', 'client', 'PatientScheduleDetailsService',
        function(team, client, PatientScheduleDetailsService) {
            var that = this;

            this.team = team;
            this.client = client;
            this.encounters = PatientScheduleDetailsService.getEncounters();

            (function init() {
                PatientScheduleDetailsService.updateEncounters(team).then(function() {
                    that.encounters = PatientScheduleDetailsService.getEncounters();
                });
            })();
        }
]);
