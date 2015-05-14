'use strict';

angular.module('emmiManager')
/**
 * Controller for Patient-Program Scheduling
 */
    .controller('ScheduleController', ['$scope', '$controller', 'team', 'client','ScheduledProgramFactory','$alert',
        function ($scope, $controller, team, client, ScheduledProgramFactory, $alert) {
            $scope.team = team;
            $scope.page.setTitle('Schedule Emmi Program - ' + team.entity.name);
            $scope.client = client;

            /**
             * Broadcasts event so that Patient save and Program save are kicked off
             */
            $scope.savePatientAndProgram = function () {
                $scope.$broadcast('event:update-patient-and-programs');
            };

            /**
             * Saves schedule for valid patient and program on click of 'Finish Scheduling'
             */
            $scope.saveScheduledProgramForPatient = function (){
                if (ScheduledProgramFactory.valid()){
                    $alert({
                        title: ' ',
                        content: 'Program has been scheduled for patient' + $scope.scheduledProgram.patient.firstName + ' ' + $scope.scheduledProgram.patient.lastName,
                        container: '#modal-messages-container',
                        type: 'success',
                        placement: 'top',
                        show: true,
                        duration: 5,
                        dismissable: true
                    });
                }
            };

            $scope.scheduledProgram = ScheduledProgramFactory;
        }
    ])
;
