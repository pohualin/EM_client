'use strict';

angular.module('emmiManager')

/**
 * Controller for ClientRestrictConfiguration main page
 */
.controller('ClientRestrictConfigurationMainController', ['$scope', '$controller', 'Client', 'ClientRestrictConfigurationsService',
    function ($scope, $controller, Client, ClientRestrictConfigurationsService) {

        /**
         * Cancel any changes
         */
        $scope.cancel = function(){
            $scope.clientRestrictConfigurationForm = false;
            $scope.clientRestrictConfiguration = angular.copy($scope.originalClientRestrictConfiguration);
        };
    
        /**
         * Save restrict configuration for the client
         */
        $scope.save = function(){
            ClientRestrictConfigurationsService.saveOrUpdate($scope.clientRestrictConfiguration).then(function(response){
                $scope.originalClientRestrictConfiguration = response;
                $scope.clientRestrictConfiguration = angular.copy($scope.originalClientRestrictConfiguration);
            });
        };
        
        /**
         * Show/hide cancel and save buttons
         */
        $scope.showButtons = function() {
            if (!$scope.originalClientRestrictConfiguration || !$scope.clientRestrictConfiguration) {
                return false;
            }
            return !angular.equals(
                            $scope.originalClientRestrictConfiguration.entity,
                            $scope.clientRestrictConfiguration.entity);
        };

        /**
         * init method called when page is loading
         */
        function init() {
            $scope.client = Client.getClient().entity;
            ClientRestrictConfigurationsService.getClientRestrictConfiguration().then(function(response){
                $scope.originalClientRestrictConfiguration = response;
                $scope.clientRestrictConfiguration = angular.copy($scope.originalClientRestrictConfiguration);
            });
        }

        init();
    }]);
 