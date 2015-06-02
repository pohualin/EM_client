'use strict';

angular.module('emmiManager')

/**
 *   Manage Client Level roles for a client
 */
    .controller('ClientRoleAdminCtrl', ['$scope', '$alert', 'ManageUserRolesService', '$filter', 'focus',
        function ($scope, $alert, ManageUserRolesService, $filter, focus) {

            // these are loaded by the route/main controller
            $scope.clientReferenceData = $scope.clientResource.ref.clientRoleReferenceData;
            $scope.libraries = $scope.clientResource.ref.clientRoleLibraries;
            $scope.existingForms = {}; // necessary so we can find forms in the controller by itself

            /**
             * Loads existing roles for the current client
             */
            $scope.loadExisting = function () {
                ManageUserRolesService.loadClientRoles($scope.clientResource).then(function (rolesResources) {
                    $scope.existingClientRoles = rolesResources;
                    $scope.setHasExistingRoles();
                });
            };

            /**
             * Puts a role into a mode where the role name is editable
             * @param clientRoleResource to be put in edit name mode
             */
            $scope.startEditName = function (clientRoleResource) {
                clientRoleResource.activePanel = 0;
                clientRoleResource.editName = true;
                focus('focus-' + clientRoleResource.entity.id);
            };

            /**
             * Called when 'create new client role' is clicked
             */
            $scope.createNewClientRole = function () {
                $scope.newClientRole = ManageUserRolesService.newClientRoleEntity();
                focus('focus-new-role');
            };

            /**
             * Evaluates if a permission has been checked for a client role entity
             *
             * @param clientRoleEntity to check permissions on
             * @returns {boolean} true for at least one checked
             */
            $scope.hasAPermissionChecked = function (clientRoleEntity) {
                var ret = false;
                var activePermissions = ManageUserRolesService.selectedPermissions(clientRoleEntity.userClientPermissions);
                if (activePermissions && activePermissions.length > 0) {
                    ret = true;
                }
                return ret;
            };

            /**
             * Called when the save button is clicked on a new client role
             *
             * @param clientRoleEntity to be saved
             * @param form for unsaved changes
             */
            $scope.saveNewRole = function (clientRoleEntity, form) {
                form.$setPristine();
                $scope.newClientRoleFormSubmitted = true;
                if (form.$valid) {
                    ManageUserRolesService.saveNewClientRole(clientRoleEntity, $scope.clientResource).then(function () {
                        delete $scope.newClientRole;
                        $scope.newClientRoleFormSubmitted = false;
                        $scope.resetValidity(form);
                        $scope.loadExisting();
                        $scope.successAlert(clientRoleEntity);
                    }, function (error) {
                        if (error.status === 406) {
                            form.name.$setValidity('unique', false);
                        }
                    });
                }
            };

            /**
             * Called when 'cancel' is clicked on the create new client role panel
             *
             * @param form for unsaved changes
             */
            $scope.cancelNew = function (form) {
                form.$setPristine();
                $scope.resetValidity(form);
                $scope.newClientRoleFormSubmitted = false;
                delete $scope.newClientRole;
            };

            /**
             * Called when 'cancel' is clicked on an existing panel
             *
             * @param clientRoleResource
             * @param form for unsaved changes
             */
            $scope.cancelExisting = function (clientRoleResource, form) {
                form.$setPristine();
                clientRoleResource.editName = false;
                angular.extend(clientRoleResource, clientRoleResource.original);
                $scope.resetValidity(form);
                delete clientRoleResource.original;
            };

            /**
             * When a client role panel is opened or closed. Copy the original
             * resource into a .original property, then load permissions from
             * the back.
             *
             * @param clientRoleResource for the panel
             * @param form for unsaved changes
             */
            $scope.panelStateChange = function (clientRoleResource, form) {
                if (clientRoleResource.activePanel === 0 && !clientRoleResource.original) {
                    // load the permissions selected for this role
                    ManageUserRolesService.loadPermissions(clientRoleResource).then(function () {
                        angular.forEach(clientRoleResource.entity.userClientPermissions, function (group) {
                            // set the disabled
                            $scope.permissionSelectionChange(group, group.active,
                                clientRoleResource.entity.userClientPermissions, false);
                        });
                        // Set the form back to pristine after loading permissions from server
                        form.$setPristine();
                    });

                }
                // Set the form back to pristine after initialization
                form.$setPristine();
            };

            /**
             * Called when an existing role is changed.
             */
            $scope.permissionSelectionChange = function (changedOption, isSelected, all) {
                // process selection changes
                var form = $scope.existingForms[changedOption.parentRoleId];
                if (ManageUserRolesService.doesChangeNeedSave(changedOption, isSelected, all)){
                    // set the form dirty if there are any deltas
                    form.$setDirty(true);
                } else {
                    form.$setPristine(true);
                }

            };

            /**
             * This collapses a panel but does not 'cancel' the changes
             * @param clientRoleResource to perform this on
             */
            $scope.collapseButDontCancel = function (clientRoleResource) {
                // ensures double click on collapsed doesn't re-collapse
                if (!clientRoleResource.editName) {
                    clientRoleResource.activePanel = 1;
                }
            };

            /**
             * Called when a client role resource 'save' button is clicked for
             * an existing role
             *
             * @param clientRoleResource to be updated
             * @param form for unsaved changes
             */
            $scope.update = function (clientRoleResource, form) {
                form.$setPristine();
                ManageUserRolesService.saveExistingClientRole(clientRoleResource).then(function () {
                    clientRoleResource.activePanel = 1;
                    $alert({
                        content: 'The role <b>' + clientRoleResource.entity.name + '</b> has been updated successfully.'
                    });
                }, function (error) {
                    if (error.status === 406) {
                        form.$setValidity('unique', false);
                    }
                });
            };

            /**
             * Called when a client role resource 'remove' button is clicked
             *
             * @param clientRoleResource to delete
             */
            $scope.remove = function (clientRoleResource) {
                ManageUserRolesService.deleteExistingClientRole(clientRoleResource).then(function () {
                    $alert({
                        content: 'The role <b>' + clientRoleResource.entity.name + '</b> has been successfully removed.'
                    });
                    $scope.loadExisting();
                });
            };

            /**
             * called on click of the 'Add' button on the group library popup
             */
            $scope.addLibraries = function () {
                ManageUserRolesService.saveSelectedLibraries($scope.clientReferenceData.roleLibrary, $scope.clientResource)
                    .then(function () {
                        $scope.loadExisting();
                        var added = [];
                        angular.forEach($scope.clientReferenceData.roleLibrary, function (role) {
                            if (role.checked && !role.disabled) {
                                added.push(role.entity);
                            }
                        });

                        if (added.length === 1) {
                            $scope.successAlert(added[0]);
                        } else {
                            $alert({
                                content: 'The selected roles have been added successfully.'
                            });
                        }
                    });
            };

            /**
             * a filter function to set the checked and disabled properties of a library group
             */
            $scope.disableLibrary = function () {
                return function (libraryRole) {
                    return ManageUserRolesService.disableSelectedLibraries($scope.existingClientRoles, libraryRole);
                };
            };

            /**
             * when the library hides, uncheck everything
             */
            $scope.$on('tooltip.hide', function () {
                ManageUserRolesService.deselectAllLibraries($scope.clientReferenceData.roleLibrary);
            });

            /**
             * Success alert to show when a client role is added.
             */
            $scope.successAlert = function (clientRole) {
                $alert({
                    content: 'The role <b>' + clientRole.name + '</b> has been added successfully.'
                });
            };

            /**
             * Reset all validity
             */
            $scope.resetValidity = function (form) {
                form.$setValidity('unique', true);
                form.$setDirty(true);
            };

            // start by loading the currently saved roles
            $scope.loadExisting();
        }
    ])
;

