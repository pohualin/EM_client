'use strict';

angular.module('emmiManager')

/**
 *   Manage Client Level users
 */
    .controller('UsersClientEditorController', ['focus', '$popover', '$alert', '$location', '$scope', 'Client', 'ManageUserRolesService', 'UsersClientService', 'UserClientUserClientRolesService',
        function ($focus, $popover, $alert, $location, $scope, Client, ManageUserRolesService, UsersClientService, UserClientUserClientRolesService) {

            /**
             * Associate selected UserClientRole to selected UserClient
             */
            $scope.associateClientRole = function (form) {
                UserClientUserClientRolesService.associateUserClientUserClientRole($scope.selectedUserClient, form.selectedClientRole).then(function () {
                    $scope.loadExistingUserClientUserClientRoles();
                });
            };

            /**
             * Load existingUserClientUserClientRoles for the UserClient
             */
            $scope.loadExistingUserClientUserClientRoles = function () {
                UserClientUserClientRolesService.
                    getUserClientUserClientRoles($scope.selectedUserClient).then(function (response) {
                        // Set existingUserClientUserClientRoles if it exists
                        if (response.length > 0) {
                            $scope.existingUserClientUserClientRoles = response;
                        } else {
                            // Load existing UserClientRoles for the Client
                            $scope.loadClientRoles();
                        }
                    });
            };

            /**
             * load all UserClientRoles for the client
             */
            $scope.loadClientRoles = function () {
                ManageUserRolesService.loadClientRolesWithPermissions().then(function (clientRoles) {
                    $scope.clientRoles = clientRoles;
                });
            };

            /**
             * Called when 'remove' is clicked
             */
            $scope.removeUserClientRole = function (userClientUserClientRole) {
                UserClientUserClientRolesService.deleteUserClientUserClientRole(userClientUserClientRole)
                    .then(function (response) {
                        $scope.existingUserClientUserClientRoles = null;
                        $scope.loadClientRoles();
                    });
            };

            /**
             * Called when UserClientUserClientRole panel is toggled
             */
            $scope.toggleUserClientUserClienRolePanel = function (userClientUserClientRole) {
                UserClientUserClientRolesService.loadPermissionsForExistingUserClientUserClientRole(userClientUserClientRole);
            };

            /**
             * Called if the user confirms they want to navigate away from the page when clicking the clink link-back
             */
            $scope.confirmExit = function() {
                $location.path('/clients/'+$scope.client.entity.id);
            };

            /**
             * init method called when the page is loading
             */
            function init() {
                $scope.client = Client.getClient();
                if (UsersClientService.getUserClient()) {
                    // In this case UserClient is already created
                    // Get the existing UserClient
                    $scope.selectedUserClient = UsersClientService.getUserClient();
                    $scope.page.setTitle('View User - ' + $scope.client.entity.name);
                    // Check if there is an existed UserClientUserClientRole
                    $scope.loadExistingUserClientUserClientRoles();
                }
            }

            init();
        }
    ])
;
