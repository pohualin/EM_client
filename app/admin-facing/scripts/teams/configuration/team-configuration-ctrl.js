'use strict';

angular.module('emmiManager')

/**
 *   Manage Team Level configuration a client
 */
    .controller('ClientTeamConfigurationCtrl', ['$scope', '$location', '$alert', 'focus', '$controller', 'teamResource', '$routeParams', 'API', 'ClientTeamConfigurationService',
        function ($scope, $location, $alert, focus, $controller, teamResource, $routeParams, API, ClientTeamConfigurationService) {
            $scope.showTeamConfig = 'yes';
            $scope.phoneClick = 'phone';
            $scope.emailClick = 'email';
            $scope.showEmailConfig = true;
            $scope.showPhoneConfig = false;
            $scope.page.setTitle('Team Configuration - ' + teamResource.entity.name + ' | ClientManager');
            $scope.showSelfRegistrationConfig = false;

            /**
             * Called when cancel is clicked.. takes the original
             * objects and copies them back into the bound objects.
             */
            $scope.cancel = function () {
                $location.path('/');
            };

            $scope.onClick = function (configType) {
                if (configType === 'phone') {
                    $scope.showEmailConfig = false;
                    $scope.showPhoneConfig = true;
                    $scope.showSelfRegistrationConfig = false;
                } else {
                    $scope.showEmailConfig = true;
                    $scope.showPhoneConfig = false;
                    $scope.showSelfRegistrationConfig = false;
                }

            };

            $scope.showSelfRegSection = function () {
                $scope.showSelfRegistrationConfig = true;
                $scope.showEmailConfig = false;
                $scope.showPhoneConfig = false;
            };

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
