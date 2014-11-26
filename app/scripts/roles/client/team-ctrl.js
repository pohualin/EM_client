'use strict';

angular.module('emmiManager')

/**
 *   Manage Team Level roles for a client
 */
    .controller('ClientTeamRoleAdminCtrl', ['$scope', 'ManageUserTeamRolesService', '$filter', 'focus',
        function ($scope, ManageUserTeamRolesService, $filter, focus) {

            /**
             * Loads existing roles for the current client
             */
            $scope.loadExisting = function () {
                ManageUserTeamRolesService.loadClientTeamRoles().then(function (rolesResources) {
                    $scope.existingClientTeamRoles = rolesResources;
                });
            };

            /**
             * Puts a role into a mode where the role name is editable
             * @param clientTeamRoleResource to be put in edit name mode
             */
            $scope.startEditName = function (clientTeamRoleResource) {
                clientTeamRoleResource.editName = true;
                focus('focus-' + clientTeamRoleResource.entity.id);
            };

            /**
             * Called when 'create new client role' is clicked
             */
            $scope.createNewClientTeamRole = function () {
                $scope.newClientTeamRole = ManageUserTeamRolesService.newClientTeamRoleEntity();
                focus('focus-new-role');
            };

            /**
             * Evaluates if a permission has been checked for a client role entity
             *
             * @param clientTeamRoleEntity to check permissions on
             * @returns {boolean} true for at least one checked
             */
            $scope.hasAPermissionChecked = function (clientTeamRoleEntity) {
                var ret = false;
                var activePermissions = $filter('filter')(clientTeamRoleEntity.userClientTeamPermissions, {active: true}, true);
                if (activePermissions && activePermissions.length > 0) {
                    ret = true;
                }
                return ret;
            };

            /**
             * Evaluates if an existing client role resource has changed
             *
             * @param clientTeamRoleResource to check permissions on
             * @returns {boolean} true for at least one checked
             */
            $scope.existingHasChanged = function (clientTeamRoleResource) {
                var ret = false;
                if (clientTeamRoleResource) {
                    var original = clientTeamRoleResource.original ? clientTeamRoleResource.original : clientTeamRoleResource;
                    ret = !angular.equals(clientTeamRoleResource.entity, original.entity, true);
                }
                return ret;
            };

            /**
             * Called when the save button is clicked on a new client role
             *
             * @param clientTeamRoleEntity to be saved
             */
            $scope.saveNewRole = function (clientTeamRoleEntity) {
                ManageUserTeamRolesService.saveNewClientTeamRole(clientTeamRoleEntity).then(function () {
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
                clientTeamRoleResource.editName = false;
                angular.extend(clientTeamRoleResource, clientTeamRoleResource.original);
                delete clientTeamRoleResource.original;
            };

            /**
             * When a client role panel is opened or closed. Copy the original
             * resource into a .original property, then load permissions from
             * the back.
             *
             * @param clientTeamRoleResource for the panel
             */
            $scope.panelStateChange = function (clientTeamRoleResource) {
                if (clientTeamRoleResource.activePanel === 0 && !clientTeamRoleResource.original) {
                    ManageUserTeamRolesService.loadPermissions(clientTeamRoleResource);
                }
            };

            /**
             * This collapses a panel but does not 'cancel' the changes
             * @param clientTeamRoleResource to perform this on
             */
            $scope.collapseButDontCancel = function (clientTeamRoleResource) {
                // ensures double click on collapsed doesn't re-collapse
                if (!clientTeamRoleResource.editName) {
                    clientTeamRoleResource.activePanel = 1;
                }
            };

            /**
             * Called when a client role resource 'save' button is clicked for
             * an existing role
             *
             * @param clientTeamRoleResource to be updated
             */
            $scope.update = function (clientTeamRoleResource) {
                ManageUserTeamRolesService.saveExistingClientTeamRole(clientTeamRoleResource);
            };

            /**
             * Called when a client role resource 'remove' button is clicked
             *
             * @param clientTeamRoleResource to delete
             */
            $scope.delete = function (clientTeamRoleResource) {
                ManageUserTeamRolesService.deleteExistingClientTeamRole(clientTeamRoleResource).then(function () {
                    $scope.loadExisting();
                });
            };

            // start by loading the currently saved roles
            $scope.loadExisting();
        }
    ])
;
