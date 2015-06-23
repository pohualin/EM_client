'use strict';

angular.module('emmiManager')

/**
 *   Manage Team Level configuration a client
 */
    .controller('ClientTeamEmailConfigurationCtrl', ['$scope', '$location', '$alert', 'focus', '$controller', 'ClientTeamConfigurationService', '$routeParams', 'API', 'ClientTeamEmailConfigurationService',
        function ($scope, $location, $alert, focus, $controller, ClientTeamConfigurationService,  $routeParams, API, ClientTeamEmailConfigurationService) {
            $scope.showTeamConfig = 'yes';
            $scope.showEmailButton = false;
            /**
             * When the save button is clicked. Sends all updates
             * to the back, then re-binds the form objects with the
             * results
             */
            $scope.saveOrUpdateEmailConfig = function (valid) {
            	if (valid) {
                    $scope.whenSaving = true;
            		  ClientTeamEmailConfigurationService
                          .saveOrUpdateTeamEmailConfiguration($scope.team, $scope.emailConfigs).then(function (response)
                             {
                        	    $scope.originalEmailConfigs = response;
                        	    $scope.emailConfigs = angular.copy($scope.originalEmailConfigs);
                            	$alert({
                                    title: ' ',
                                    content: 'The team email configuration have been updated successfully.',
                                    container: 'body',
                                    type: 'success',
                                    placement: 'top',
                                    show: true,
                                    duration: 5,
                                    dismissable: true
                                });
                             }).finally(function () {
                              $scope.whenSaving = false;
                          });
            		  $scope.showEmailButton = false;
                }
            };
            
            /**
             * If user checks "Require email"
             * "Collect email" needs to automatically check.
             * If user un-check "Collect email"
             * "Require email" needs to un-check
             */
            $scope.onChange = function(emailConfig){
            	$scope.showEmailButton = true;
            	//If the type is REQUIRE_EMAIL and it is true
            	if(angular.equals(emailConfig.entity.type, 'REQUIRE_EMAIL')&&
		                 (emailConfig.entity.emailConfig)){
            	   //Loop thru the emailConfigs again and find the COLLECT_EMAIL type and set it to true
            		angular.forEach($scope.emailConfigs, function (email){
            			if(angular.equals(email.entity.type, 'COLLECT_EMAIL')){
            				email.entity.emailConfig = true;
            			}
            		});
                }
            	else if(angular.equals(emailConfig.entity.type, 'COLLECT_EMAIL')&&
		                 (!emailConfig.entity.emailConfig)){
             	   //Loop thru the emailConfigs again and find the REQUIRE_EMAIL type and set it to false
             		angular.forEach($scope.emailConfigs, function (email){
             			if(angular.equals(email.entity.type, 'REQUIRE_EMAIL')){
             				email.entity.emailConfig = false;
             			}
             		});
                 }
                     	
           };

            /**
             * Called when cancel is clicked.. takes the original
             * objects and copies them back into the bound objects.
             */
           $scope.cancel = function () {
        	  $scope.emailConfigs = angular.copy($scope.originalEmailConfigs);
        	  $scope.showEmailButton = false;
           };
                     
             /**
             * init method called when page is loading
             */
            function init() {
            	$scope.team = ClientTeamConfigurationService.getTeam();
            	ClientTeamEmailConfigurationService.getTeamEmailConfiguration($scope.team).then(function (response) {
                		$scope.originalEmailConfigs = response;
                		$scope.emailConfigs = angular.copy($scope.originalEmailConfigs);
               });

            }

            init();

    }])
;
