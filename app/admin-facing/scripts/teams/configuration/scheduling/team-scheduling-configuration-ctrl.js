'use strict';

angular.module('emmiManager')

/**
 *   Manage Team Level configuration a client
 */
    .controller('ClientTeamSchedulingConfigurationCtrl', ['$scope', '$location', '$alert', 'focus', '$controller', '$routeParams', 'API', 'ClientTeamSchedulingConfigurationService', 'ClientTeamConfigurationService',
        function ($scope, $location, $alert, focus, $controller, $routeParams, API, ClientTeamSchedulingConfigurationService, ClientTeamConfigurationService) {
            $scope.showTeamConfig = 'yes';
            $scope.showSchedulingButton = false;
            $scope.$emit('showCardOutline', { value: false });
    	    /**
             * When the save button is clicked. Sends all updates
             * to the back, then re-binds the form objects with the
             * results
             */
            $scope.saveOrUpdateSchedulingConfig = function (valid) {
            	  if (valid) {
                      $scope.whenSaving = true;
            		  ClientTeamSchedulingConfigurationService
                          .saveOrUpdateTeamSchedulingConfiguration($scope.team, $scope.schedulingConfigs).then(function (response)
                             {
                        	  $scope.originalSchedulingConfigs = response;
                      		  $scope.schedulingConfigs = angular.copy($scope.originalSchedulingConfigs);
                            	$alert({
                                    title: '',
                                    content: '<strong>' + $scope.team.entity.name + '</strong> has been updated successfully.',
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
            		  $scope.showSchedulingButton = false;
                      $scope.$emit('showCardOutline', { value: false });
                  }
            };


            $scope.onChange = function(){
            	$scope.showSchedulingButton  = true;
                $scope.$emit('showCardOutline', { value: true });
            };

             /**
             * Called when cancel is clicked.. takes the original
             * objects and copies them back into the bound objects.
             */
            $scope.cancel = function () {
            	$scope.schedulingConfigs = angular.copy($scope.originalSchedulingConfigs);
            	$scope.showSchedulingButton = false;
                $scope.$emit('showCardOutline', { value: false });
            };


            /**
             * init method called when page is loading
             */
            function init() {
            	$scope.team = ClientTeamConfigurationService.getTeam();
            	ClientTeamSchedulingConfigurationService.getTeamSchedulingConfiguration($scope.team).then(function (response) {
            		$scope.originalSchedulingConfigs = response;
            		$scope.schedulingConfigs = angular.copy($scope.originalSchedulingConfigs);
               	});
            }

            init();

    }])
;
