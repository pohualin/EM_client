'use strict';

angular.module('emmiManager')
    .controller('ScheduleController', ['$scope', '$controller', 'team', 'client','ScheduledProgramFactory','$alert',
        function ($scope, $controller, team, client, ScheduledProgramFactory, $alert) {
            $scope.team = team;
            $scope.page.setTitle('Schedule Emmi Program - ' + team.entity.name);
            $scope.client = client;
            $scope.savePatientAndProgram = function () {
                $scope.$emit('event:update-patient-and-programs');
            };

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
