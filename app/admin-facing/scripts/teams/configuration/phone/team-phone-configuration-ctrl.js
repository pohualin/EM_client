'use strict';

angular.module('emmiManager')

/**
 *   Manage Team Level configuration a client
 */
    .controller('ClientTeamPhoneConfigurationCtrl', ['$scope', '$location', '$alert', 'focus', '$controller', '$routeParams', 'API', 'ClientTeamPhoneConfigurationService', 'ClientTeamConfigurationService',
        function ($scope, $location, $alert, focus, $controller, $routeParams, API, ClientTeamPhoneConfigurationService, ClientTeamConfigurationService) {
            $scope.showTeamConfig = 'yes';
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
                            	$scope.phoneConfigs = response;
                            	$alert({
                                    title: ' ',
                                    content: 'The team phone configuration have been updated successfully.',
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
                  }
            };


            /**
             * Check to see if user checks "Require phone"
             * If yes, "Collect phone" needs to automatically check.
             */
            $scope.onChange = function(){
            	if($scope.phoneConfigs.entity.requirePhone){
                    $scope.phoneConfigs.entity.collectPhone = true;
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
            	$scope.team = ClientTeamConfigurationService.getTeam();
            	ClientTeamPhoneConfigurationService.getTeamPhoneConfiguration($scope.team).then(function (response) {
            		$scope.phoneConfigs = response;
               	});
            }

            init();

    }])
;
