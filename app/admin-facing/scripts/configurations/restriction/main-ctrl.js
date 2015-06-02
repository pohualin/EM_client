'use strict';

angular.module('emmiManager')

/**
 * Controller for ClientRestrictConfiguration main page
 */
.controller('ClientRestrictConfigurationMainController', ['$alert', '$scope', '$controller', 'clientResource', 'Client', 'ClientRestrictConfigurationsService', 'ManageUserRolesService', 'ManageUserTeamRolesService',
    function ($alert, $scope, $controller, clientResource, Client, ClientRestrictConfigurationsService, ManageUserRolesService, ManageUserTeamRolesService) {

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
            //need to have at this point if the client has roles in order to define the correct redirect for users links at the bottom page
            ManageUserRolesService.loadClientRoles(clientResource).then(function (rolesResources) {
                $scope.existingClientRoles = rolesResources;
            });
            ManageUserTeamRolesService.loadClientTeamRoles(clientResource).then(function (rolesResources) {
                $scope.existingClientTeamRoles = rolesResources;
            });
            ClientRestrictConfigurationsService.getClientRestrictConfiguration().then(function(response){
                $scope.originalClientRestrictConfiguration = response;
                $scope.clientRestrictConfiguration = angular.copy($scope.originalClientRestrictConfiguration);
            });
        }

        init();
    }]);

