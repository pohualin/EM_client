'use strict';

angular.module('emmiManager')

/**
 * Controller for ClientRestrictConfiguration main page
 */
.controller('ClientRestrictConfigurationMainController', ['$alert', '$scope', '$controller', 'Client', 'ClientRestrictConfigurationsService',
    function ($alert, $scope, $controller, Client, ClientRestrictConfigurationsService) {

        /**
         * Save restrict configuration for the client
         */
        $scope.save = function(){
            ClientRestrictConfigurationsService.saveOrUpdate($scope.clientRestrictConfiguration).then(function(response){
                $scope.originalClientRestrictConfiguration = response;
                $scope.clientRestrictConfiguration = angular.copy($scope.originalClientRestrictConfiguration);
                $alert({
                    content: '<b>' + $scope.client.name + '</b> has been updated successfully.'
                });
            });
        };

        $scope.$on('requestEmailList', function(e) {
            $scope.$broadcast('refreshEmailList');
        });

        $scope.$on('requestIpList', function(e) {
            $scope.$broadcast('refreshIpList');
        });

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

