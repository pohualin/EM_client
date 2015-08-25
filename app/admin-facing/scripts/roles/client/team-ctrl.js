'use strict';

angular.module('emmiManager')

/**
 *   Manage Team Level roles for a client
 */
    .controller('ClientTeamRoleAdminCtrl', ['$scope', '$alert', 'ManageUserTeamRolesService', 'focus', 'RolesFactory',
        function ($scope, $alert, ManageUserTeamRolesService, focus, RolesFactory) {

            // these are loaded by the route/main controller
            $scope.clientTeamReferenceData = $scope.clientResource.ref.clientTeamReferenceData;
            $scope.libraries = $scope.clientResource.ref.clientTeamRoleLibraries;

            /**
             * Loads existing roles for the current client
             */
            $scope.loadExisting = function () {
                ManageUserTeamRolesService.loadClientTeamRoles($scope.clientResource).then(function (rolesResources) {
                    $scope.existingClientTeamRoles = rolesResources;
                    RolesFactory.setClientTeamRoles(rolesResources);
                    $scope.setHasExistingRoles();
                });
            };

            /**
             * Puts a role into a mode where the role name is editable
             *
             * @param form to be edited
             * @param clientTeamRoleResource to be put in edit name mode
             */
            $scope.startEditName = function (clientTeamRoleResource, form) {
                clientTeamRoleResource.activePanel = 0;
                clientTeamRoleResource.editName = true;
                focus('focus-' + clientTeamRoleResource.entity.id);
                $scope.panelStateChange(clientTeamRoleResource, form);
            };

            /**
             * Happens from single click of role name
             *
             * @param clientTeamRoleResource clicked
             * @param form to be edited
             */
            $scope.singleClick = function (clientTeamRoleResource, form) {
                if (!clientTeamRoleResource.editName) {
                    // only toggle when not in edit mode
                    if (clientTeamRoleResource.activePanel === 0) {
                        clientTeamRoleResource.activePanel = -1;
                    } else {
                        clientTeamRoleResource.activePanel = 0;
                    }
                }
                $scope.panelStateChange(clientTeamRoleResource, form);
            };

            /**
             * Called when 'create new client role' is clicked
             */
            $scope.createNewClientTeamRole = function () {
                $scope.newClientTeamRole = ManageUserTeamRolesService.newClientTeamRoleEntity();
                focus('focus-new-team-role');
            };

            /**
             * Evaluates if a permission has been checked for a client role entity
             *
             * @param clientTeamRoleEntity to check permissions on
             * @returns {boolean} true for at least one checked
             */
            $scope.hasAPermissionChecked = function (clientTeamRoleEntity) {
                var ret = false;
                var activePermissions = ManageUserTeamRolesService.selectedPermissions(clientTeamRoleEntity.userClientTeamPermissions);
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
                $scope.newClientTeamRoleFormSubmitted = true;
                if(form.$valid){
                    ManageUserTeamRolesService.saveNewClientTeamRole(clientTeamRoleEntity, $scope.clientResource)
                        .then(function () {
                            delete $scope.newClientTeamRole;
                            $scope.newClientTeamRoleFormSubmitted = false;
                            $scope.loadExisting();
                            $scope.successAlert(clientTeamRoleEntity);
                            form.$setPristine();
                        }, function(error){
                            if (error.status === 406) {
                                form.$setValidity('unique', false);
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
                $scope.resetValidity(form);
                form.$setPristine();
                $scope.newClientTeamRoleFormSubmitted = false;
                delete $scope.newClientTeamRole;
            };

            /**
             * Called when 'cancel' is clicked on an existing panel
             *
             * @param clientTeamRoleResource
             * @param form for unsaved changes
             */
            $scope.cancelExisting = function (clientTeamRoleResource, form) {
                angular.extend(clientTeamRoleResource, clientTeamRoleResource.original);
                clientTeamRoleResource.editName = false;
                $scope.resetValidity(form);
                form.$setPristine();
                delete clientTeamRoleResource.original;
                $scope.panelStateChange(clientTeamRoleResource, form);
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
                    ManageUserTeamRolesService.loadPermissions(clientTeamRoleResource).then(function (){
                        // Set the form back to pristine after loading permissions from server
                        if (form) {
                            form.$setPristine();
                        }
                    });
                } else {
                    // Set the form back to pristine after initialization
                    if (form) {
                        form.$setPristine();
                    }
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
                ManageUserTeamRolesService.saveExistingClientTeamRole(clientTeamRoleResource).then(function(){
                    clientTeamRoleResource.activePanel = 1;
                    $alert({
                        content: 'The role <b>' + clientTeamRoleResource.entity.name + '</b> has been updated successfully.'
                    });
                }, function(error){
                    if (error.status === 406) {
                        form.$setValidity('unique', false);
                    }
                });
            };

            /**
             * Called when a client role resource 'remove' button is clicked
             *
             * @param clientTeamRoleResource to delete
             */
            $scope.remove = function (clientTeamRoleResource) {
                ManageUserTeamRolesService.deleteExistingClientTeamRole(clientTeamRoleResource).then(function () {
                    $alert({
                        content: 'The role <b>' + clientTeamRoleResource.entity.name + '</b> has been successfully removed.'
                    });
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
                        var added = [];
                        angular.forEach($scope.libraries, function(role){
                            if(role.checked && !role.disabled){
                                added.push(role.entity);
                            }
                        });

                        if(added.length === 1){
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
                    return ManageUserTeamRolesService.disableSelectedLibraries(libraryRole);
                };
            };

            /**
             * before the library shows, uncheck everything
             */
            $scope.$on('tooltip.show.before', function () {
                ManageUserTeamRolesService.deselectAllLibraries($scope.libraries);
            });

            /**
             * Success alert to show when a team role is added.
             */
            $scope.successAlert = function(clientRole){
                $alert({
                    content: 'The role <b>' + clientRole.name + '</b> has been added successfully.'
                });
            };

            /**
             * Reset all validity
             */
            $scope.resetValidity = function(form){
                form.$setValidity('unique', true);
                form.$setDirty(true);
            };

            // start by loading the currently saved roles
            $scope.loadExisting();
        }
    ])
;
