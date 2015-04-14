'use strict';

angular.module('emmiManager')

/**
 *   Manage Team Level roles for a client
 */
    .controller('ClientTeamRoleAdminCtrl', ['$scope', 'ManageUserTeamRolesService', '$filter', 'focus',
        function ($scope, ManageUserTeamRolesService, $filter, focus) {

            ManageUserTeamRolesService.referenceData($scope.clientResource).then(function (referenceData) {
                $scope.clientTeamReferenceData = referenceData;
                $scope.libraries = referenceData.roleLibrary;
            });

            /**
             * Loads existing roles for the current client
             */
            $scope.loadExisting = function () {
                ManageUserTeamRolesService.loadClientTeamRoles($scope.clientResource).then(function (rolesResources) {
                    $scope.existingClientTeamRoles = rolesResources;
                    $scope.setHasExistingRoles();
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
             * @param form for unsaved changes
             */
            $scope.saveNewRole = function (clientTeamRoleEntity, form) {
                form.$setPristine();
                ManageUserTeamRolesService.saveNewClientTeamRole(clientTeamRoleEntity, $scope.clientResource)
                    .then(function () {
                        delete $scope.newClientTeamRole;
                        $scope.loadExisting();
                    });
            };

            /**
             * Called when 'cancel' is clicked on the create new client role panel
             *
             * @param form for unsaved changes
             */
            $scope.cancelNew = function (form) {
                form.$setPristine();
                delete $scope.newClientTeamRole;
            };

            /**
             * Called when 'cancel' is clicked on an existing panel
             *
             * @param clientTeamRoleResource
             * @param form for unsaved changes
             */
            $scope.cancelExisting = function (clientTeamRoleResource, form) {
                form.$setPristine();
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
             * @param form for unsaved changes
             */
            $scope.panelStateChange = function (clientTeamRoleResource, form) {
                if (clientTeamRoleResource.activePanel === 0 && !clientTeamRoleResource.original) {
                    ManageUserTeamRolesService.loadPermissions(clientTeamRoleResource);
                    // Set the form back to pristine after loading permissions from server
                    form.$setPristine();
                } else {
                    // Set the form back to pristine after initialization
                    form.$setPristine();
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
             * @param form for unsaved changes
             */
            $scope.update = function (clientTeamRoleResource, form) {
                form.$setPristine();
                ManageUserTeamRolesService.saveExistingClientTeamRole(clientTeamRoleResource);
            };

            /**
             * Called when a client role resource 'remove' button is clicked
             *
             * @param clientTeamRoleResource to delete
             */
            $scope.remove = function (clientTeamRoleResource) {
                ManageUserTeamRolesService.deleteExistingClientTeamRole(clientTeamRoleResource).then(function () {
                    $scope.loadExisting();
                });
            };

            /**
             * called on click of the 'Add' button on the group library popup
             */
            $scope.addLibraries = function () {
                ManageUserTeamRolesService.saveSelectedLibraries($scope.libraries, $scope.clientResource)
                    .then(function () {
                        $scope.loadExisting();
                    });
            };

            /**
             * a filter function to set the checked and disabled properties of a library group
             */
            $scope.disableLibrary = function () {
                return function (libraryRole) {
                    return ManageUserTeamRolesService.disableSelectedLibraries($scope.existingClientTeamRoles, libraryRole);
                };
            };

            /**
             * when the library hides, uncheck everything
             */
            $scope.$on('tooltip.hide', function () {
                ManageUserTeamRolesService.deselectAllLibraries($scope.libraries);
            });

            // start by loading the currently saved roles
            $scope.loadExisting();
        }
    ])
;
