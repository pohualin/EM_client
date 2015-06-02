(function (angular) {
    'use strict';

    angular.module('emmiManager')

    /**
     * Controller for Patient-Program Scheduling
     */
        .controller('ScheduleController', ['$scope', 'team', 'client', 'ScheduledProgramFactory',
            '$alert', 'ScheduleService', '$location', 'UriTemplate', 'PatientEmailService',
            function ($scope, team, client, ScheduledProgramFactory, $alert, ScheduleService, $location, UriTemplate, PatientEmailService) {
        	       	
                $scope.team = team;
                $scope.page.setTitle('Schedule Emmi Program - ' + team.entity.name);
                $scope.client = client;
                $scope.patient = team.patient.entity;
                ScheduledProgramFactory.patient = team.patient.entity;
                
                /**
                 * Retrieve team email configuration for scheduling
                 */
                function getConfiguration(){
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
                }
                getConfiguration();
                
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
