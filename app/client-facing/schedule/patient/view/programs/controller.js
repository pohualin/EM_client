'use strict';

angular.module('emmiManager')
    .controller('PatientScheduleProgramsController', ['PatientScheduleDetailsService',
        function(team, client, PatientScheduleDetailsService) {
            var that = this;

            this.toggleScheduledProgramPanel = function (scheduledProgramResource, form) {
                if (scheduledProgramResource.showDetails && !form.$dirty) {
                    scheduledProgramResource.showDetails = false;
                } else {
                    scheduledProgramResource.showDetails = true;
                }
            };

        }
]);
