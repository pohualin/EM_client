'use strict';

angular.module('emmiManager')

/**
 * Controller for Configuration main page
 */
    .controller('ClientPasswordConfigurationMainController', ['$alert', '$scope', '$controller', 'Client', 'ClientPasswordConfigurationsService',
        function ($alert, $scope, $controller, Client, ClientPasswordConfigurationsService) {

            /**
             * Cancel any changes
             */
            $scope.cancel = function (clientPasswordConfigurationForm) {
                $scope.clientPasswordConfigurationFormSubmitted = false;
                $scope.clientPasswordConfiguration = angular.copy($scope.originalClientPasswordConfiguration);
            };

            /**
             * Reset to default password configuration for the client
             */
            $scope.reset = function (clientPasswordConfigurationForm) {
                $scope.loading = true;
                ClientPasswordConfigurationsService.remove($scope.clientPasswordConfiguration).then(function () {
                    ClientPasswordConfigurationsService.getClientPasswordConfiguration().then(function (response) {
                        $scope.originalClientPasswordConfiguration = response;
                        $scope.clientPasswordConfiguration = angular.copy($scope.originalClientPasswordConfiguration);
                        $scope.defaultPasswordConfiguration = response.entity.defaultPasswordConfiguration;
                        $scope.loading = false;
                        $alert({
                            content: '<b>' + $scope.client.name + '</b> has been updated successfully.',
                            type: 'success',
                            placement: 'top',
                            show: true,
                            duration: 5,
                            dismissable: true
                        });
                    });
                });
            };

            /**
             * Save password configuration for the client
             */
            $scope.save = function (clientPasswordConfigurationForm) {
                $scope.clientPasswordConfigurationFormSubmitted = true;
                if (clientPasswordConfigurationForm.$valid) {
                    ClientPasswordConfigurationsService.save($scope.clientPasswordConfiguration).then(function (response) {
                        $scope.originalClientPasswordConfiguration = response;
                        $scope.clientPasswordConfiguration = angular.copy($scope.originalClientPasswordConfiguration);
                        $scope.defaultPasswordConfiguration = response.entity.defaultPasswordConfiguration;
                        $scope.clientPasswordConfigurationFormSubmitted = false;
                        $alert({
                            content: '<b>' + $scope.client.name + '</b> has been updated successfully.',
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
             * Show/hide cancel and save buttons
             */
            $scope.showButtons = function () {
                if (!$scope.originalClientPasswordConfiguration || !$scope.clientPasswordConfiguration) {
                    return false;
                }
                return !angular
                        .equals(
                                $scope.originalClientPasswordConfiguration.entity,
                                $scope.clientPasswordConfiguration.entity);
            };

            /**
             * init method called when page is loading
             */
            function init() {
                $scope.client = Client.getClient().entity;
                ClientPasswordConfigurationsService.getClientPasswordConfiguration().then(function (response) {
                    $scope.originalClientPasswordConfiguration = response;
                    $scope.clientPasswordConfiguration = angular.copy($scope.originalClientPasswordConfiguration);
                    $scope.defaultPasswordConfiguration = response.entity.defaultPasswordConfiguration;
                });
            }

            init();
        }]);
