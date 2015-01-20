'use strict';

angular.module('emmiManager')

/**
 * Controller for Configuration main page
 */
.controller('ClientPasswordConfigurationsMainController', ['$scope', '$controller', 'Client', 'ClientPasswordConfigurationsService',
    function ($scope, $controller, Client, ClientPasswordConfigurationsService) {

        /**
         * Cancel any changes
         */
        $scope.cancel = function(clientPasswordConfigurationForm){
            $scope.clientPasswordConfigurationFormSubmitted = false;
            $scope.clientPasswordConfiguration = angular.copy($scope.originalClientPasswordConfiguration);
        };
    
        /**
         * Reset to default password configuration for the client
         */
        $scope.reset = function(clientPasswordConfigurationForm){
            $scope.loading = true;
            ClientPasswordConfigurationsService.remove($scope.clientPasswordConfiguration).then(function(){
                ClientPasswordConfigurationsService.getClientPasswordConfiguration().then(function(response){
                    $scope.originalClientPasswordConfiguration = response;
                    $scope.clientPasswordConfiguration = angular.copy($scope.originalClientPasswordConfiguration);
                    $scope.defaultPasswordConfiguration = response.entity.defaultPasswordConfiguration;
                    $scope.loading = false;
                });
            });
        };

        /**
         * Save password configuration for the client
         */
        $scope.save = function(clientPasswordConfigurationForm){
            $scope.clientPasswordConfigurationFormSubmitted = true;
            if(clientPasswordConfigurationForm.$valid){
                ClientPasswordConfigurationsService.save($scope.clientPasswordConfiguration).then(function(response){
                    $scope.originalClientPasswordConfiguration = response;
                    $scope.clientPasswordConfiguration = angular.copy($scope.originalClientPasswordConfiguration);
                    $scope.defaultPasswordConfiguration = response.entity.defaultPasswordConfiguration;
                    $scope.clientPasswordConfigurationFormSubmitted = false;
                });
            }
        };
        
        /**
         * Show/hide cancel and save buttons
         */
        $scope.showButtons = function() {
            console.log('dirty?' + $scope.clientPasswordConfigurationForm.$dirty);
            window.paul = $scope.clientPasswordConfigurationForm;
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
            ClientPasswordConfigurationsService.getClientPasswordConfiguration().then(function(response){
                $scope.originalClientPasswordConfiguration = response;
                $scope.clientPasswordConfiguration = angular.copy($scope.originalClientPasswordConfiguration);
                $scope.defaultPasswordConfiguration = response.entity.defaultPasswordConfiguration;
            });
        }

        init();
    }]);
 