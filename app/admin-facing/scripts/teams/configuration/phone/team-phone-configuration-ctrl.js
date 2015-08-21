'use strict';

angular.module('emmiManager')

/**
 *   Manage Team Level configuration a client
 */
    .controller('ClientTeamPhoneConfigurationCtrl', ['$scope', '$alert', 'teamResource', 'ClientTeamPhoneConfigurationService',
        function ($scope, $alert, teamResource, ClientTeamPhoneConfigurationService) {

            /**
             * When the save button is clicked. Sends all updates
             * to the back, then re-binds the form objects with the
             * results
             */
            $scope.saveOrUpdatePhoneConfig = function (valid) {
            	  if (valid) {
                      $scope.whenSaving = true;
            		  ClientTeamPhoneConfigurationService
                          .saveOrUpdateTeamPhoneConfiguration($scope.team, $scope.phoneConfigs).then(function (response)
                             {
                        	  $scope.originalPhoneConfigs = response;
                      		  $scope.phoneConfigs = angular.copy($scope.originalPhoneConfigs);
                            	$alert({
                                    content: '<strong>' + $scope.team.entity.name + '</strong> has been updated successfully.'
                                });
                             }).finally(function () {
                              $scope.whenSaving = false;
                          });
            		  $scope.showPhoneButton = false;
                  }
            };


            /**
             * If user un-checks "Collect phone"
             * "require phone" needs to automatically un-check.
             */
            $scope.onChangeCollect = function(){
            	$scope.showPhoneButton  = true;
            	if(!$scope.phoneConfigs.entity.collectPhone){
                    $scope.phoneConfigs.entity.requirePhone = false;
            	}
           };

           /**
            * If user checks "Require phone"
            * If yes, "Collect phone" needs to automatically check.
            */
           $scope.onChangeRequire = function(){
        	   $scope.showPhoneButton  = true;
           	   if($scope.phoneConfigs.entity.requirePhone){
                   $scope.phoneConfigs.entity.collectPhone = true;
           	   }
          };

            /**
             * Called when cancel is clicked.. takes the original
             * objects and copies them back into the bound objects.
             */
            $scope.cancel = function () {
            	$scope.phoneConfigs = angular.copy($scope.originalPhoneConfigs);
            	$scope.showPhoneButton = false;
            };


            /**
             * init method called when page is loading
             */
            function init() {
                $scope.showPhoneButton = false;

                $scope.client = teamResource.entity.client;
            	$scope.team = teamResource;
            	ClientTeamPhoneConfigurationService.getTeamPhoneConfiguration($scope.team).then(function (response) {
            		$scope.originalPhoneConfigs = response;
            		$scope.phoneConfigs = angular.copy($scope.originalPhoneConfigs);
               	});
            }

            init();

    }])
;
