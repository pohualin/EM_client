'use strict';

angular.module('emmiManager')

/**
 *   Manage Client Level users
 */
.controller('UsersClientEditorController', ['$alert', '$location', '$scope', 'Client', 'UsersClientService', 'UserClientUserClientRolesService',
        function ($alert, $location, $scope, Client, UsersClientService, UserClientUserClientRolesService) {

            $scope.client = Client.getClient();
            $scope.selectedUserClient = UsersClientService.getUserClient();
            $scope.page.setTitle('View User - ' + $scope.client.entity.name + ' | ClientManager');

            /**
             * Metadata has changed, reset the UserClient
             */
            $scope.metadataChanged = function(){
                $scope.selectedUserClient = UsersClientService.getUserClient();
            };

            /**
             * Called when 'Create Another User' is clicked
             */
            $scope.createAnotherUserClient = function () {
                UserClientUserClientRolesService.clearAllPermissions();
                $location.path('/clients/' + $scope.client.entity.id + '/users/new');
            };
        }
    ]);
