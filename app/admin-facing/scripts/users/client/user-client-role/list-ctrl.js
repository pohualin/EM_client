'use strict';

angular.module('emmiManager')

/**
 *   Manage Client Level users
 */
    .controller('UsersClientUserClientRolesListController', ['$alert', '$location', '$scope', 'Client', 'ManageUserRolesService', 'UsersClientService', 'UserClientUserClientRolesService',
        function ($alert, $location, $scope, Client, ManageUserRolesService, UsersClientService, UserClientUserClientRolesService) {

            /**
             * Associate selected UserClientRole to selected UserClient
             */
            $scope.associateClientRole = function (form) {
                $scope.whenSaving = true;
                UserClientUserClientRolesService.associateUserClientUserClientRole($scope.selectedUserClient, form.selectedClientRole).then(function () {
                    $scope.clientRolesChanged();
                }).finally(function () {
                    $scope.whenSaving = false;
                });
                _paq.push(['trackEvent', 'Form Action', 'User Client Role Edit', 'Add']);
            };

            /**
             * Load existingUserClientUserClientRoles for the UserClient
             */
            $scope.loadExistingUserClientUserClientRoles = function () {
                UserClientUserClientRolesService.
                    getUserClientUserClientRoles($scope.selectedUserClient).then(function (response) {
                        // Set existingUserClientUserClientRoles if it exists
                        if (response.length > 0) {
                            UserClientUserClientRolesService
                                .loadPermissionsForUserClientUserClientRoles(response).then(function (response) {
                                    $scope.existingUserClientUserClientRoles = response;
                                    $scope.setIsSuperUser();
                                });
                            // update parent controller with roles
                            $scope.setClientRoles(response);
                        } else {
                            // Load existing UserClientRoles for the Client
                            $scope.existingUserClientUserClientRoles = null;
                            $scope.setClientRoles(null);
                            $scope.loadClientRoles();
                        }
                    });
            };

            /**
             * load all UserClientRoles for the client
             */
            $scope.loadClientRoles = function () {
                ManageUserRolesService.loadClientRolesWithPermissions(Client.getClient()).then(function (clientRoles) {
                    $scope.clientRoles = clientRoles;
                    $scope.setIsSuperUser();
                    $scope.setPossibleClientRoles(clientRoles);
                });
            };

            /**
             * Called when 'remove' is clicked
             */
            $scope.removeUserClientRole = function (userClientUserClientRole) {
                $scope.whenSaving = true;
                UserClientUserClientRolesService.deleteUserClientUserClientRole(userClientUserClientRole)
                    .then(function () {
                        $scope.clientRolesChanged();
                    }).finally(function () {
                        $scope.whenSaving = false;
                    });
                _paq.push(['trackEvent', 'Form Action', 'User Client Role Edit', 'Remove']);
            };

            /**
             * Called when UserClientUserClientRole panel is toggled
             */
            $scope.toggleUserClientUserClientRolePanel = function (userClientUserClientRole) {
                if (userClientUserClientRole.activePanel === 0) {
                    UserClientUserClientRolesService.loadPermissionsForExistingUserClientUserClientRole(userClientUserClientRole);
                }
            };

            /**
             * Called when a client role is selected. Set selectedRoleHasSuperPermission
             * if client role has PERM_CLIENT_SUPER_USER permission
             */
            $scope.setSelectedRoleHasSuperPermission = function (clientRole) {
                if (clientRole) {
                    var rolePermissions = [];
                    angular.forEach(clientRole.entity.permissions, function (permission) {
                        rolePermissions.push(permission.name);
                    });
                    var existingTeamRole = false;
                    if ($scope.teamRoles && $scope.teamRoles.length) {
                        angular.forEach($scope.teamRoles, function (teamRole) {
                            if (teamRole.existingTeams && teamRole.existingTeams.length) {
                                existingTeamRole = true;
                            }
                        });
                    }
                    $scope.selectedRoleHasSuperPermission = rolePermissions.indexOf('PERM_CLIENT_SUPER_USER') !== -1 && existingTeamRole;
                } else {
                    $scope.selectedRoleHasSuperPermission = false;
                }
            };

            /**
             * init method called when the page is loading
             */
            function init() {
                // Check if there is an existed UserClientUserClientRole
                $scope.loadExistingUserClientUserClientRoles();
                $scope.$on('client-roles-changed', function () {
                    $scope.loadExistingUserClientUserClientRoles();
                });
            }

            init();
        }
    ])
;
