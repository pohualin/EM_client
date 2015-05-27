'use strict';

angular.module('emmiManager')

/**
 *   Manage Team Level configuration a client
 */
    .controller('ClientTeamEmailConfigurationCtrl', ['$scope', '$location', '$alert', 'focus', '$controller', 'teamResource', '$routeParams', 'API', 'ClientTeamEmailConfigurationService',
        function ($scope, $location, $alert, focus, $controller, teamResource,  $routeParams, API, ClientTeamEmailConfigurationService) {
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
                            	//$scope.loadExisting();
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
             * Loads existing email configuration for the current team
             */
            $scope.loadExisting = function () {
            	ClientTeamEmailConfigurationService.getTeamEmailConfiguration($scope.team).then(function (response) {
                    $scope.emailConfigs = response;
                });
            };
            
            /**
             * Check to see if user checks "Require email"
             * If yes, "Collect email" needs to automatically check.
             */
            $scope.onChange = function(){
            	if(angular.equals($scope.emailConfigs[1].entity.type, 'REQUIRE_EMAIL')&&
            	   ($scope.emailConfigs[1].entity.emailConfig)){
            		$scope.emailConfigs[0].entity.emailConfig = true;
               }
       
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
            	$scope.team = teamResource;
            	$scope.client = teamResource.entity.client;
                ClientTeamEmailConfigurationService.getTeamEmailConfiguration($scope.team).then(function (response) {
                    $scope.emailConfigs = response;
                });
            }
                 
            init();

    }])
;
