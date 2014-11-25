'use strict';

angular.module('emmiManager')

/**
 * Manage Team level roles for a client
 */
.controller('ClientTeamRoleAdminCtrl', ['$scope', 'ManageUserTeamRolesService', '$filter', 'focus',
    function ($scope, ManageUserTeamRolesService, $filter, focus) {

        /**
         * Loads existing team roles for the current client
         */
        $scope.loadExisting = function () {
            ManageUserTeamRolesService.loadClientTeamRoles().then(function (rolesResources) {
                $scope.existingClientTeamRoles = rolesResources;
            });
        };

        /**
         * Called when 'create new client team role' is clicked
         */
        $scope.createNewClientTeamRole = function () {
            $scope.newClientTeamRole = ManageUserTeamRolesService.newClientTeamRole();
            focus('focus-new-team-role');
        };

        /**
         * Takes a permission name and translates it
         *
         * @param permission to translate
         * @returns the translated text
         */
        $scope.translated = function (permission) {
            return $filter('translate')(permission.name);
        };

        /**
         * Evaluates if a permission has been checked for a client role
         *
         * @param clientTeamRole to check permissions on
         * @returns {boolean} true for at least one checked
         */
        $scope.hasAPermissionChecked = function (clientTeamRole) {
            var ret = false;
            if (clientTeamRole) {
                angular.forEach(clientTeamRole.userClientTeamPermissions, function (permission) {
                    if (permission.active) {
                        ret = true;
                    }
                });
            }
            return ret;
        };

        /**
         * Called when the save button is clicked on a new client role
         *
         * @param clientTeamRole to be saved
         */
        $scope.saveNewRole = function (clientTeamRole) {
            ManageUserTeamRolesService.saveNewClientTeamRole(clientTeamRole).then(function () {
                delete $scope.newClientTeamRole;
                $scope.loadExisting();
            });
        };

        /**
         * Called when 'cancel' is clicked on the create new client role panel
         */
        $scope.cancelNew = function () {
            delete $scope.newClientTeamRole;
        };

        /**
         * Called when 'cancel' is clicked on an existing panel
         *
         * @param clientTeamRoleResource
         */
        $scope.cancelExisting = function (clientTeamRoleResource) {
            angular.extend(clientTeamRoleResource, clientTeamRoleResource.original);
        };

        /**
         * When a client team role panel is opened or closed. Copy the original
         * resource into a .original property, then load permissions from
         * the back and check the boxes as necessary.
         *
         * @param clientTeamRoleResource for the panel
         */
        $scope.panelStateChange = function (clientTeamRoleResource) {
            if (clientTeamRoleResource.activePanel === 0) {
                focus('focus-' + clientTeamRoleResource.entity.id);
                clientTeamRoleResource.original = angular.copy(clientTeamRoleResource);
                ManageUserTeamRolesService.loadPermissions(clientTeamRoleResource).then(function (permissions) {
                    angular.forEach(permissions, function (savedPermission) {
                        // find the checkbox for each of the saved permissions
                        var checkboxPermission =
                            $filter('filter')(clientTeamRoleResource.entity.userClientTeamPermissions, {name: savedPermission.name}, true);
                        // check it
                        checkboxPermission[0].active = true;
                    });
                });
            }
        };

        /**
         * Called when a client role resource 'save' button is clicked for
         * an existing role
         *
         * @param clientTeamRoleResource to be updated
         */
        $scope.update = function (clientTeamRoleResource) {
            ManageUserTeamRolesService.saveExistingClientTeamRole(clientTeamRoleResource).then(function(savedClientTeamRoleResource){
                angular.extend(clientTeamRoleResource, savedClientTeamRoleResource);
            });
        };

        /**
         * Called when a client role resource 'remove' button is clicked
         *
         * @param clientTeamRoleResource to delete
         */
        $scope.delete = function (clientTeamRoleResource) {
            ManageUserTeamRolesService.deleteExistingClientTeamRole(clientTeamRoleResource).then(function(){
                $scope.loadExisting();
            });
        };

        // start by loading the currently saved roles
        $scope.loadExisting();
    }
])
;
