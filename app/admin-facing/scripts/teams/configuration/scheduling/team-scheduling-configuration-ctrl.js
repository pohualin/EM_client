'use strict';

angular.module('emmiManager')

/**
 *   Team level scheduling configuration
 */
.controller('ClientTeamSchedulingConfigurationCtrl', ['$scope', '$alert', 'teamResource', 'ClientTeamSchedulingConfigurationService',
    function ($scope, $alert, teamResource, ClientTeamSchedulingConfigurationService) {
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
                            content: '<strong>' + $scope.team.entity.name + '</strong> has been updated successfully.'
                        });
                     }).finally(function () {
                      $scope.whenSaving = false;
                      $scope.clientTeamSchedulingConfigurationFormSubmitted = false;
                  });
    		  $scope.showSchedulingButton = false;
            }
        };

        $scope.onChange = function(){
        	$scope.showSchedulingButton  = true;
        };

        /**
         * Called when cancel is clicked.. takes the original
         * objects and copies them back into the bound objects.
         */
        $scope.cancel = function () {
            $scope.clientTeamSchedulingConfigurationFormSubmitted = false;
        	$scope.schedulingConfigs = angular.copy($scope.originalSchedulingConfigs);
        	$scope.showSchedulingButton = false;
        };

        /**
         * init method called when page is loading
         */
        function init() {
            $scope.showSchedulingButton = false;

            $scope.clientTeamSchedulingConfigurationFormSubmitted = false;
            $scope.client = teamResource.entity.client;
        	$scope.team = teamResource;
        	ClientTeamSchedulingConfigurationService.getTeamSchedulingConfiguration($scope.team).then(function (response) {
        		$scope.originalSchedulingConfigs = response;
        		$scope.schedulingConfigs = angular.copy($scope.originalSchedulingConfigs);
        		$scope.defaultClientTeamSchedulingConfiguration = response.entity.defaultClientTeamSchedulingConfiguration;
           	});
        }
        init();
}]);
