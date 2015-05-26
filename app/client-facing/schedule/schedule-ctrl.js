(function (angular) {
    'use strict';

    angular.module('emmiManager')

    /**
     * Controller for Patient-Program Scheduling
     */
        .controller('ScheduleController', ['$scope', 'team', 'client', 'ScheduledProgramFactory',
            '$alert', 'ScheduleService', '$location', 'UriTemplate',
            function ($scope, team, client, ScheduledProgramFactory, $alert, ScheduleService, $location, UriTemplate) {

                $scope.team = team;
                $scope.page.setTitle('Schedule Emmi Program - ' + team.entity.name);
                $scope.client = client;
                $scope.patient = team.patient.entity;
                ScheduledProgramFactory.patient = team.patient.entity;

                /**
                 * Broadcasts event so that Patient save and Program save are kicked off
                 */
                $scope.savePatientAndProgram = function () {
                    $scope.$broadcast('event:update-patient-and-programs');
                };

                /**
                 * Saves schedule for valid patient and program on click of 'Finish Scheduling'
                 */
                $scope.saveScheduledProgramForPatient = function () {
                    if (ScheduledProgramFactory.valid()) {

                        ScheduleService.schedule($scope.team, $scope.scheduledProgram)
                            .then(function (response) {
                                var scheduledProgramResource = response.data;

                                $location.path(UriTemplate
                                    .create('/teams/{teamId}/schedule/{scheduleId}/instructions')
                                    .stringify({
                                        teamId: scheduledProgramResource.entity.team.id,
                                        scheduleId: scheduledProgramResource.entity.id
                                    }));

                                $alert({
                                    title: '',
                                    content: 'Program has been scheduled successfully',
                                    type: 'success',
                                    placement: 'top',
                                    show: true,
                                    duration: 5,
                                    dismissable: true
                                });
                            });
                    }
                };

                $scope.scheduledProgram = ScheduledProgramFactory;
            }
        ])
    ;
})(window.angular);
