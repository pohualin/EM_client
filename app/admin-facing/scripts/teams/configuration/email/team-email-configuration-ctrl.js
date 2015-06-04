'use strict';

angular.module('emmiManager')

/**
 *   Manage Team Level configuration a client
 */
    .controller('ClientTeamEmailConfigurationCtrl', ['$scope', '$location', '$alert', 'focus', '$controller', 'ClientTeamConfigurationService', '$routeParams', 'API', 'ClientTeamEmailConfigurationService',
        function ($scope, $location, $alert, focus, $controller, ClientTeamConfigurationService,  $routeParams, API, ClientTeamEmailConfigurationService) {
    	    $scope.showTeamConfig = 'yes';                 
            /**
             * When the save button is clicked. Sends all updates
             * to the back, then re-binds the form objects with the
             * results
             */
            $scope.saveOrUpdateEmailConfig = function (valid) {
            	console.log($scope.emailConfigs );
            	  if (valid) {
            		  ClientTeamEmailConfigurationService
                            .saveOrUpdateTeamEmailConfiguration($scope.team, $scope.emailConfigs).then(function (response) 
                             {
                            	$scope.emailConfigs = response;
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
                            });
                       } 
            };
                
            
            /**
             * Check to see if user checks "Require email"
             * If yes, "Collect email" needs to automatically check.
             */
            $scope.onChange = function(){
            	angular.forEach($scope.emailConfigs, function (emailConfig) {
            		//If the type is REQUIRE_EMAIL and it is true
            		if(angular.equals(emailConfig.entity.type, 'REQUIRE_EMAIL')&&
            		                 (emailConfig.entity.emailConfig)){
            		    //Loop thru the email config again and find the COLLECT_EMAIL type and set it to true
            			angular.forEach($scope.emailConfigs, function (emailConfig){
            				if(angular.equals(emailConfig.entity.type, 'COLLECT_EMAIL')){
            					emailConfig.entity.emailConfig = true;
            				}
            			});
            		
            		}
            	});
           };
            
            /**
             * Called when cancel is clicked.. takes the original
             * objects and copies them back into the bound objects.
             */
            $scope.cancel = function () {
                $location.path('/');
            };
            
             /**
             * init method called when page is loading
             */
            function init() {
            	$scope.team = ClientTeamConfigurationService.getTeam();
            	$scope.client = $scope.team.entity.client;
                ClientTeamEmailConfigurationService.getTeamEmailConfiguration($scope.team).then(function (response) {
                		$scope.emailConfigs = response;
                });
            	
            }
                 
            init();

    }])
;
