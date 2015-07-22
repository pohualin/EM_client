'use strict';

angular.module('emmiManager')

/**
 *   Manage Team Level configuration a client
 */
    .controller('ClientTeamConfigurationCtrl', ['$scope', '$location', '$alert', 'focus', '$controller', 'teamResource', '$routeParams', 'arrays','$rootScope', 'API', 'ClientTeamConfigurationService',
        function ($scope, $location, $alert, focus, $controller, teamResource,  $routeParams, arrays, $rootScope, API, ClientTeamConfigurationService) {
    	    $scope.showTeamConfig = 'yes';
    	    $scope.phoneClick = 'phone';
    	    $scope.emailClick = 'email';
    	    $scope.schedulingClick = 'scheduling';
    	    $scope.showEmailConfig = true;
    	    $scope.showPhoneConfig = false;
    	    $scope.showSchedulingConfig = false;
            $scope.page.setTitle('Team Configurations - '+ teamResource.entity.name +' | ClientManager');
            $scope.showSelfRegistrationConfig = false;

            /**
             * Called when cancel is clicked.. takes the original
             * objects and copies them back into the bound objects.
             */
            $scope.cancel = function () {
                $location.path('/');
            };

            $scope.onClick = function(configType) {
                $scope.showOutline = false;
            	if(configType === 'phone'){
            		$scope.showEmailConfig = false;
            		$scope.showPhoneConfig = true;
            		$scope.showSelfRegistrationConfig = false;
            		$scope.showSchedulingConfig = false;
               	}else if(configType === 'scheduling'){
               		$scope.showEmailConfig = false;
            		$scope.showPhoneConfig = false;
            		$scope.showSchedulingConfig = true;
            		$scope.showSelfRegistrationConfig = false;
               	}
            	else{
            		$scope.showEmailConfig = true;
            	    $scope.showPhoneConfig = false;
            	    $scope.showSchedulingConfig = false;
            	    $scope.showSelfRegistrationConfig = false;
            	}
            };

            $scope.showSelfRegSection = function () {
                $scope.showSelfRegistrationConfig = true;
                $scope.showEmailConfig = false;
                $scope.showPhoneConfig = false;
                $scope.showSchedulingConfig = false;
            };

            $scope.$on('showCardOutline', function (event, args) {
                $scope.showOutline = args.value;
            });

            /**
             * init method called when page is loading
             */
            function init() {
                ClientTeamConfigurationService.setTeam(teamResource);
                $scope.client = teamResource.entity.client;
                $scope.team = teamResource;
            }

            init();

        }])
;
