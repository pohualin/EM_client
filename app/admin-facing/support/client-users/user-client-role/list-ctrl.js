'use strict';

angular.module('emmiManager')

/**
 *   Manage Client Level users
 */
    .controller('UsersClientUserClientRolesSupportListController', ['$alert', '$location', '$scope', 'Client', 'ManageUserRolesService', 'UsersClientService', 'UserClientUserClientRolesService',
        function ($alert, $location, $scope, Client, ManageUserRolesService, UsersClientService, UserClientUserClientRolesService) {

            /**
             * Associate selected UserClientRole to selected UserClient
             */
            $scope.associateClientRole = function (form) {
                $scope.whenSaving = true;
                UserClientUserClientRolesService.associateUserClientUserClientRole($scope.selectedUserClient, form.selectedClientRole).then(function () {
                    $scope.$emit('client-roles-changed');
                }).finally(function () {
                    $scope.whenSaving = false;
                });
                _paq.push(['trackEvent', 'Form Action', 'User Client Role Edit', 'Add']);
            };

            /**
             * Called when 'remove' is clicked
             */
            $scope.removeUserClientRole = function (userClientUserClientRole) {
                $scope.whenSaving = true;
                UserClientUserClientRolesService.deleteUserClientUserClientRole(userClientUserClientRole)
                    .then(function () {
                        $scope.$emit('client-roles-changed');
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
                    if ($scope.clientTeamRoles && $scope.clientTeamRoles.length) {
                        angular.forEach($scope.clientTeamRoles, function (teamRole) {
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
    }]);
