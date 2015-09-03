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
                        .saveOrUpdateTeamPhoneConfiguration($scope.team, $scope.phoneConfigs).then(function (response) {
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
            * Called when cancel is clicked.. takes the original
            * objects and copies them back into the bound objects.
            */
            $scope.cancel = function() {
                $scope.phoneConfigs = angular.copy($scope.originalPhoneConfigs);
                $scope.showPhoneButton = false;
                $scope.setPhoneOption();
            };

            $scope.update = function() {
                if ($scope.phoneOptions.selected === $scope.phoneOptions[0]) {
                    $scope.phoneConfigs.entity.collectPhone = true;
                    $scope.phoneConfigs.entity.requirePhone = false;
                } else if ($scope.phoneOptions.selected === $scope.phoneOptions[1]) {
                    $scope.phoneConfigs.entity.collectPhone = true;
                    $scope.phoneConfigs.entity.requirePhone = true;
                } else if ($scope.phoneOptions.selected === $scope.phoneOptions[2]) {
                    $scope.phoneConfigs.entity.collectPhone = false;
                    $scope.phoneConfigs.entity.requirePhone = false;
                }

                $scope.showPhoneButton = true;
            };

            $scope.setPhoneOption = function() {
                if ($scope.phoneConfigs.entity.collectPhone === true) {
                    if ($scope.phoneConfigs.entity.requirePhone === true) {
                        $scope.phoneOptions.selected = $scope.phoneOptions[1];
                    } else {
                        $scope.phoneOptions.selected = $scope.phoneOptions[0];
                    }
                } else {
                    $scope.phoneOptions.selected = $scope.phoneOptions[2];
                }
            }

            /**
            * init method called when page is loading
            */
            function init() {
                $scope.showPhoneButton = false;

                $scope.phoneOptions = [
                    { id: 'phoneExposed', displayText: 'Phone exposed', rank: 0 },
                    { id: 'phoneExposedRequired', displayText: 'Phone exposed and required', rank: 1 },
                    { id: 'dontCollectPhone', displayText: 'Don\'t collect phone number', rank: 2 }
                ];
                $scope.phoneOptions.selected = $scope.phoneOptions[0];

                $scope.client = teamResource.entity.client;
                $scope.team = teamResource;

                ClientTeamPhoneConfigurationService.getTeamPhoneConfiguration($scope.team).then(function (response) {
                    $scope.originalPhoneConfigs = response;
                    $scope.phoneConfigs = angular.copy($scope.originalPhoneConfigs);

                    $scope.setPhoneOption();
                });
            }

            init();
    }])
;
