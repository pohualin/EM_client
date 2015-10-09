'use strict';

angular.module('emmiManager')

/**
 *   Manage Client Level roles for a client
 */
    .controller('ClientRoleAdminCtrl', ['$scope', '$alert', 'ManageUserRolesService', '$filter', 'focus', 'RolesFactory',
        function ($scope, $alert, ManageUserRolesService, $filter, focus, RolesFactory) {

            // these are loaded by the route/main controller
            $scope.clientReferenceData = $scope.clientResource.ref.clientRoleReferenceData;
            $scope.libraries = $scope.clientResource.ref.clientRoleLibraries;
            $scope.existingForms = {}; // necessary so we can find forms in the controller by itself

            /**
             * Loads existing roles for the current client
             */
            $scope.loadExisting = function () {
                ManageUserRolesService.loadClientRoles($scope.clientResource).then(function (rolesResources) {
                    angular.forEach(rolesResources, function (clientRoleResource) {
                        $scope.addWatch(clientRoleResource);
                    });
                    $scope.existingClientRoles = rolesResources;

                    RolesFactory.setClientRoles(rolesResources);
                    $scope.setHasExistingRoles();
                });
            };

            /**
             * Happens from single click of role name
             * @param clientRoleResource clicked
             */
            $scope.singleClick = function (clientRoleResource) {
                if (!clientRoleResource.editName) {
                    // only toggle when not in edit mode
                    if (clientRoleResource.activePanel === 0) {
                        clientRoleResource.activePanel = -1;
                    } else {
                        clientRoleResource.activePanel = 0;
                    }
                }
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
                focus('focus-new-client-role');
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
                $scope.newClientRoleFormSubmitted = true;
                if (form.$valid) {
                    $scope.whenSaving = true;
                    ManageUserRolesService.saveNewClientRole(clientRoleEntity, $scope.clientResource).then(function () {
                        delete $scope.newClientRole;
                        $scope.newClientRoleFormSubmitted = false;
                        $scope.resetValidity(form);
                        $scope.loadExisting();
                        form.$setPristine();
                        $scope.successAlert(clientRoleEntity);
                    }, function (error) {
                        if (error.status === 406) {
                            form.$setValidity('unique', false);
                        }
                    }).finally(function () {
                        $scope.whenSaving = false;
                    });
                }
            };

            /**
             * Called when 'cancel' is clicked on the create new client role panel
             *
             * @param form for unsaved changes
             */
            $scope.cancelNew = function (form) {
                $scope.resetValidity(form);
                form.$setPristine();
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
                angular.extend(clientRoleResource, clientRoleResource.original);
                clientRoleResource.editName = false;
                $scope.resetValidity(form);
                form.$setPristine();
                delete clientRoleResource.original;
            };

            /**
             * Called when an existing role is changed.
             */
            $scope.permissionSelectionChange = function (changedOption, isSelected, all, init) {
                // process selection changes
                var form = $scope.existingForms[changedOption.parentRoleId];
                if (form) {
                    if (ManageUserRolesService.doesChangeNeedSave(changedOption, isSelected, all, init)) {
                        // set the form dirty if there are any deltas
                        form.$setDirty();
                    } else {
                        form.$setPristine();
                    }
                }
            };

            /**
             * Called when an new role is changed, sets the admin vs. other permissions
             */
            $scope.newRolePermissionSelectionChange = function (changedOption, isSelected, all) {
                // process selection changes
                ManageUserRolesService.doesChangeNeedSave(changedOption, isSelected, all);
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
                $scope.whenSaving = true;
                ManageUserRolesService.saveExistingClientRole(clientRoleResource).then(function () {
                    clientRoleResource.activePanel = -1;
                    $alert({
                        content: 'The role <b>' + clientRoleResource.entity.name + '</b> has been updated successfully.'
                    });
                }, function (error) {
                    if (error.status === 406) {
                        form.$setValidity('unique', false);
                    }
                }).finally(function () {
                    $scope.whenSaving = false;
                });
            };

            /**
             * Called when a client role resource 'remove' button is clicked
             *
             * @param clientRoleResource to delete
             */
            $scope.remove = function (clientRoleResource) {
                $scope.whenSaving = true;
                ManageUserRolesService.deleteExistingClientRole(clientRoleResource).then(function () {
                    $alert({
                        content: 'The role <b>' + clientRoleResource.entity.name + '</b> has been successfully removed.'
                    });
                    $scope.loadExisting();
                }).finally(function () {
                    $scope.whenSaving = false;
                });
            };
            
            /**
             * Check and see if any selectable roles has been checked
             */
            $scope.toggleAddButton = function () {
                $scope.disableLibraries();
                $scope.libraries.forEach(function (library) {
                   if (library.disabled === false && library.checked === true){
                       $scope.libraries.disabled = false;
                   }
                });
            };
            
            $scope.disableLibraries = function () {
                $scope.libraries.disabled = true;
            };

            /**
             * called on click of the 'Add' button on the group library popup
             */
            $scope.addLibraries = function () {
                $scope.whenSaving = true;
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
                    }).finally(function () {
                        $scope.whenSaving = false;
                    });
            };

            /**
             * a filter function to set the checked and disabled properties of a library group
             */
            $scope.disableLibrary = function () {
                return function (libraryRole) {
                    return ManageUserRolesService.disableSelectedLibraries(libraryRole);
                };
            };

            /**
             * before the library shows, uncheck everything
             */
            $scope.$on('tooltip.show.before', function () {
                ManageUserRolesService.deselectAllLibraries($scope.libraries);
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

            /**
             * Add an attribute activePanel with a change listener
             * @param clientRoleResource
             */
            $scope.addWatch = function (clientRoleResource) {
                clientRoleResource.activePanel = -1; // 0 means expanded
                // adding a $watch instead of using ng-change so we can programmatically change the value
                $scope.$watch(function () {
                    return clientRoleResource.activePanel;
                }, function (newVal, oldVal, scope) {
                    if (newVal !== oldVal) {
                        var form = scope.existingForms[clientRoleResource.entity.id];
                        if (clientRoleResource.activePanel === 0 && !clientRoleResource.original) {
                            // load the permissions selected for this role, if they haven't been loaded already
                            ManageUserRolesService.loadPermissions(clientRoleResource).then(function () {
                                angular.forEach(clientRoleResource.entity.userClientPermissions, function (group) {
                                    // set the disabled
                                    scope.permissionSelectionChange(group, group.active,
                                        clientRoleResource.entity.userClientPermissions, true);
                                });
                                // Set the form back to pristine after loading permissions from server
                                if (form) {
                                    form.$setPristine();
                                }
                            });
                        }
                        // Set the form back to pristine after initialization
                        if (form) {
                            form.$setPristine();
                        }
                    }
                });
            };

            // start by loading the currently saved roles
            $scope.loadExisting();
        }
    ])
;

