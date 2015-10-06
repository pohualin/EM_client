'use strict';

angular.module('emmiManager')

/**
 * Controller to handle Team level email notifications configuration
 */
    .controller('ClientTeamEmailConfigurationCtrl', ['$scope', 'ClientTeamEmailConfigurationService',
        function ($scope, ClientTeamEmailConfigurationService) {

            /**
             * Save or update email notification configuration.
             * Fire an event to update print instruction configuration.
             */
            $scope.$on('event:save-or-update-email-notification-configration', function () {
                ClientTeamEmailConfigurationService
                    .saveOrUpdateTeamEmailConfiguration($scope.team, $scope.emailConfigs).then(function (response) {
                        $scope.originalEmailConfigs = response;
                        $scope.emailConfigs = angular.copy($scope.originalEmailConfigs);
                        $scope.$broadcast('event:save-or-update-print-instruction-configuration');
                    });
            });
        
            /**
             * Reset email notification configuration to it's initial copy when cancel button is clicked
             */
            $scope.$on('event:reset-email-notification-configuration', function () {
                $scope.emailConfigs = angular.copy($scope.originalEmailConfigs);
                $scope.setEmailOption();
            });
            
            /**
             * Calls when radio button is selected
             */
            $scope.update = function() {
                if ($scope.emailOptions.selected === $scope.emailOptions[0]) {
                    $scope.emailConfigs.entity.collectEmail = true;
                    $scope.emailConfigs.entity.requireEmail = false;
                } else if ($scope.emailOptions.selected === $scope.emailOptions[1]) {
                    $scope.emailConfigs.entity.collectEmail = true;
                    $scope.emailConfigs.entity.requireEmail = true;
                } else if ($scope.emailOptions.selected === $scope.emailOptions[2]) {
                    $scope.emailConfigs.entity.collectEmail = false;
                    $scope.emailConfigs.entity.requireEmail = false;
                }
                $scope.showButton();
            };

            /**
             * Select one of three options based on collectEmail and requireEmail
             */
            $scope.setEmailOption = function() {
                if ($scope.emailConfigs.entity.collectEmail === true) {
                    if ($scope.emailConfigs.entity.requireEmail === true) {
                        $scope.emailOptions.selected = $scope.emailOptions[1];
                    } else {
                        $scope.emailOptions.selected = $scope.emailOptions[0];
                    }
                } else {
                    $scope.emailOptions.selected = $scope.emailOptions[2];
                }
            };
            
            function init() {
                $scope.emailOptions = [
                    { id: 'emailExposed', displayText: 'Email exposed', rank: 0 },
                    { id: 'emailExposedRequired', displayText: 'Email exposed and required', rank: 1 },
                    { id: 'dontCollectEmail', displayText: 'Don\'t collect email', rank: 2 }
                ];
                $scope.emailOptions.selected = $scope.emailOptions[0];
   
                ClientTeamEmailConfigurationService.getTeamEmailConfiguration($scope.team).then(function (response) {
                    $scope.originalEmailConfigs = response;
                    $scope.emailConfigs = angular.copy($scope.originalEmailConfigs);
                    $scope.setEmailOption();
                });
            }
            
            init();
    }]);
