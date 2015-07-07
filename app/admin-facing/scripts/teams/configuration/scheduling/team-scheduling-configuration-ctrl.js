'use strict';

angular.module('emmiManager')

/**
 *   Manage Team Level configuration a client
 */
    .controller('ClientTeamSchedulingConfigurationCtrl', ['$scope', '$location', '$alert', 'focus', '$controller', '$routeParams', 'API', 'ClientTeamSchedulingConfigurationService', 'ClientTeamConfigurationService',
        function ($scope, $location, $alert, focus, $controller, $routeParams, API, ClientTeamSchedulingConfigurationService, ClientTeamConfigurationService) {
            $scope.showTeamConfig = 'yes';
    	    /**
             * When the save button is clicked. Sends all updates
             * to the back, then re-binds the form objects with the
             * results
             */
            $scope.saveOrUpdateSchedulingConfig = function (valid) {
                $scope.clientTeamSchedulingConfigurationFormSubmitted = true;
                if (valid) {
                  $scope.whenSaving = true;
        		  ClientTeamSchedulingConfigurationService
                      .saveOrUpdateTeamSchedulingConfiguration($scope.team, $scope.schedulingConfigs).then(function (response)
                         {
                    	  $scope.originalSchedulingConfigs = response;
                  		  $scope.schedulingConfigs = angular.copy($scope.originalSchedulingConfigs);
                        	$alert({
                                title: ' ',
                                content: 'The team scheduling configuration have been updated successfully.',
                                container: 'body',
                                type: 'success',
                                placement: 'top',
                                show: true,
                                duration: 5,
                                dismissable: true
                            });
                         }).finally(function () {
                          $scope.whenSaving = false;
                          $scope.clientTeamSchedulingConfigurationFormSubmitted = false;
                      });
                }
            };

            /**
             * Method to check if anything has changed in schedulingConfigs
             */
            $scope.configurationChanged = function () {
                if (!$scope.originalSchedulingConfigs || !$scope.schedulingConfigs) {
                    $scope.$emit('showCardOutline', { value: true });
                    return false;
                }
                
                if(angular.equals(
                        $scope.originalSchedulingConfigs.entity,
                        $scope.schedulingConfigs.entity)){
                    $scope.$emit('showCardOutline', { value: false });
                } else {
                    $scope.$emit('showCardOutline', { value: true });
                }
                
                return !angular.equals(
                                $scope.originalSchedulingConfigs.entity,
                                $scope.schedulingConfigs.entity);
            };
            
            /**
             * Called when cancel is clicked.. takes the original
             * objects and copies them back into the bound objects.
             */
            $scope.cancel = function () {
                $scope.clientTeamSchedulingConfigurationFormSubmitted = false;
            	$scope.schedulingConfigs = angular.copy($scope.originalSchedulingConfigs);
            	// $scope.showSchedulingButton = false;
                // $scope.$emit('showCardOutline', { value: false });
            };


            /**
             * init method called when page is loading
             */
            function init() {
                $scope.clientTeamSchedulingConfigurationFormSubmitted = false;
            	$scope.team = ClientTeamConfigurationService.getTeam();
            	ClientTeamSchedulingConfigurationService.getTeamSchedulingConfiguration($scope.team).then(function (response) {
            		$scope.originalSchedulingConfigs = response;
            		$scope.schedulingConfigs = angular.copy($scope.originalSchedulingConfigs);
            		$scope.defaultClientTeamSchedulingConfiguration = response.entity.defaultClientTeamSchedulingConfiguration;
               	});
            }

            init();

    }])
;
