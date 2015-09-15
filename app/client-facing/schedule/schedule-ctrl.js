(function (angular) {
    'use strict';

    angular.module('emmiManager')

    /**
     * Controller for Patient-Program Scheduling
     */
        .controller('ScheduleController', ['$scope', 'team', 'client', 'ScheduledProgramFactory',
            '$alert', 'ScheduleService', '$location', 'UriTemplate', 'PatientEmailService', 'PatientPhoneService', 
            function ($scope, team, client, ScheduledProgramFactory, $alert, ScheduleService, $location, UriTemplate, PatientEmailService, PatientPhoneService) {
                $scope.team = team;
                $scope.page.setTitle('Schedule Emmi Program - ' + team.entity.name);
                $scope.client = client;
                $scope.patient = team.patient.entity;
                ScheduledProgramFactory.team = team;
                ScheduledProgramFactory.patient = team.patient.entity;
                
                ScheduleService.loadTeamSchedulingConfiguration(team).then(function (teamSchedulingConfiguration) {
                    ScheduledProgramFactory.teamSchedulingConfiguration = teamSchedulingConfiguration;
                });
                                
                /**
                 * Retrieve team email configuration for scheduling
                 */
                PatientEmailService.getTeamEmailConfiguration(team).then(function(emailConfigsResponse){
                      angular.forEach(emailConfigsResponse, function (emailConfig){
                		if(angular.equals(emailConfig.entity.type, 'COLLECT_EMAIL')){
                			$scope.showEmail = emailConfig.entity.emailConfig;
                		}
                		else if(angular.equals(emailConfig.entity.type, 'REQUIRE_EMAIL')){
                			$scope.isEmailRequired = emailConfig.entity.emailConfig;
                   		}
                	 });
                });
               
                /**
                 * Retrieve team phone configuration for scheduling
                 */
               PatientPhoneService.getTeamPhoneConfiguration(team).then(function(response){
                    	$scope.showPhone = (response.collectPhone) ? true : false;
                    	$scope.isPhoneRequired = (response.requirePhone) ? true : false;
               });
               
                
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
                    if (ScheduledProgramFactory.allValid()) {
                        $scope.whenSaving = true;
                        ScheduleService.scheduleBulk($scope.team)
                            .then(function (response) {
                                var scheduledProgramResource = response[0];

                                $location.path(UriTemplate
                                    .create('/teams/{teamId}/encounter/{encounterId}/instructions')
                                    .stringify({
                                        teamId: scheduledProgramResource.entity.team.id,
                                        encounterId: scheduledProgramResource.entity.encounter.id
                                    }));

                                $alert({
                                    content: 'Program has been scheduled successfully'
                                });
                            }).finally(function () {
                                $scope.whenSaving = false;
                                ScheduledProgramFactory.selectedPrograms = null;
                            });
                    }
                };
                
                $scope.scheduledProgram = ScheduledProgramFactory;
            }
        ])
    ;
})(window.angular);
