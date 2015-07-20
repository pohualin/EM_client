'use strict';

angular.module('emmiManager')

/**
 * Controller for Configuration main page
 */
    .controller('ClientPasswordConfigurationMainController', ['$alert', '$scope', '$rootScope', '$controller', 'clientResource', 'Client', 'ClientPasswordConfigurationsService', 'ManageUserRolesService', 'ManageUserTeamRolesService',
        function ($alert, $scope, $rootScope, $controller, clientResource, Client, ClientPasswordConfigurationsService, ManageUserRolesService, ManageUserTeamRolesService) {

            /**
             * Cancel any changes
             */
            $scope.cancel = function (clientPasswordConfigurationForm) {
                clientPasswordConfigurationForm.$setPristine();
                $scope.clientPasswordConfigurationFormSubmitted = false;
                $scope.clientPasswordConfiguration = angular.copy($scope.originalClientPasswordConfiguration);
            };

            /**
             * Reset to default password configuration for the client
             */
            $scope.reset = function (clientPasswordConfigurationForm) {
                $scope.loading = true;
                $scope.whenSaving = true;
                ClientPasswordConfigurationsService.remove($scope.clientPasswordConfiguration).then(function () {
                    ClientPasswordConfigurationsService.getClientPasswordConfiguration().then(function (response) {
                        $scope.originalClientPasswordConfiguration = response;
                        $scope.clientPasswordConfiguration = angular.copy($scope.originalClientPasswordConfiguration);
                        $scope.defaultPasswordConfiguration = response.entity.defaultPasswordConfiguration;
                        $scope.loading = false;
                        $alert({
                            content: '<b>' + $scope.client.name + '</b> has been updated successfully.'
                        });
                        clientPasswordConfigurationForm.$setPristine();
                    });
                }).finally(function () {
                    $scope.whenSaving = false;
                });
            };

            /**
             * Save password configuration for the client
             */
            $scope.save = function (clientPasswordConfigurationForm) {
                $scope.clientPasswordConfigurationFormSubmitted = true;
                if (clientPasswordConfigurationForm.$valid) {
                    clientPasswordConfigurationForm.$setPristine();
                    $scope.whenSaving = true;
                    ClientPasswordConfigurationsService.save($scope.clientPasswordConfiguration).then(function (response) {
                        $scope.originalClientPasswordConfiguration = response;
                        $scope.clientPasswordConfiguration = angular.copy($scope.originalClientPasswordConfiguration);
                        $scope.defaultPasswordConfiguration = response.entity.defaultPasswordConfiguration;
                        $scope.clientPasswordConfigurationFormSubmitted = false;
                        $alert({
                            content: '<b>' + $scope.client.name + '</b> has been updated successfully.'
                        });
                    }).finally(function () {
                        $scope.whenSaving = false;
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
                $scope.page.setTitle('Client Configurations - ' + $scope.client.name + ' | ClientManager');
                //need to have at this point if the client has roles in order to define the correct redirect for users links at the bottom page
                ManageUserRolesService.loadClientRoles(clientResource).then(function (rolesResources) {
                    $scope.existingClientRoles = rolesResources;
                });
                ManageUserTeamRolesService.loadClientTeamRoles(clientResource).then(function (rolesResources) {
                    $scope.existingClientTeamRoles = rolesResources;
                });
                ClientPasswordConfigurationsService.getClientPasswordConfiguration().then(function (response) {
                    $scope.originalClientPasswordConfiguration = response;
                    $scope.clientPasswordConfiguration = angular.copy($scope.originalClientPasswordConfiguration);
                    $scope.defaultPasswordConfiguration = response.entity.defaultPasswordConfiguration;
                });
            }

            init();
        }]);
