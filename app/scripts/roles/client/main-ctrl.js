'use strict';

angular.module('emmiManager')

/**
 *   Manage Client Level roles
 */
    .controller('ManageClientRolesMainCtrl', ['$scope', 'Client', 'ManageUserRolesService',
        function ($scope, Client, ManageUserRolesService) {
            $scope.client = Client.getClient().entity;
            $scope.page.setTitle('Manage User Roles - ' + $scope.client.name);
            ManageUserRolesService.referenceData().then(function (rolesReferenceData) {
                $scope.rolesReferenceData = rolesReferenceData;
            });
        }
    ])

    .controller('ClientRoleAdminCtrl', ['$scope', 'ManageUserRolesService', '$filter', 'focus',
        function ($scope, ManageUserRolesService, $filter, focus) {

            /**
             * Loads existing roles for the current client
             */
            $scope.loadExisting = function () {
                ManageUserRolesService.loadClientRoles().then(function (rolesResources) {
                    $scope.existingClientRoles = rolesResources;
                });
            };

            /**
             * Called when 'create new client role' is clicked
             */
            $scope.createNewClientRole = function () {
                $scope.newClientRole = ManageUserRolesService.newClientRole();
                focus('focus-new-role');
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
             * @param clientRole to check permissions on
             * @returns {boolean} true for at least one checked
             */
            $scope.hasAPermissionChecked = function (clientRole) {
                var ret = false;
                if (clientRole) {
                    angular.forEach(clientRole.userClientPermissions, function (permission) {
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
             * @param clientRole to be saved
             */
            $scope.saveNewRole = function (clientRole) {
                ManageUserRolesService.saveNewClientRole(clientRole).then(function () {
                    delete $scope.newClientRole;
                    $scope.loadExisting();
                });
            };

            /**
             * Called when 'cancel' is clicked on the create new client role panel
             */
            $scope.cancelNew = function () {
                delete $scope.newClientRole;
            };

            /**
             * Called when 'cancel' is clicked on an existing panel
             *
             * @param clientRoleResource
             */
            $scope.cancelExisting = function (clientRoleResource) {
                angular.extend(clientRoleResource, clientRoleResource.original);
            };

            /**
             * When a client role panel is opened or closed. Copy the original
             * resource into a .original property, then load permissions from
             * the back and check the boxes as necessary.
             *
             * @param clientRoleResource for the panel
             */
            $scope.panelStateChange = function (clientRoleResource) {
                if (clientRoleResource.activePanel === 0) {
                    focus('focus-' + clientRoleResource.entity.id);
                    clientRoleResource.original = angular.copy(clientRoleResource);
                    ManageUserRolesService.loadPermissions(clientRoleResource).then(function (permissions) {
                        angular.forEach(permissions, function (savedPermission) {
                            // find the checkbox for each of the saved permissions
                            var checkboxPermission =
                                $filter('filter')(clientRoleResource.entity.userClientPermissions, {name: savedPermission.name}, true);
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
             * @param clientRoleResource to be updated
             */
            $scope.update = function (clientRoleResource) {
                ManageUserRolesService.saveExistingClientRole(clientRoleResource).then(function(savedClientRoleResource){
                    angular.extend(clientRoleResource, savedClientRoleResource);
                });
            };

            /**
             * Called when a client role resource 'remove' button is clicked
             *
             * @param clientRoleResource to delete
             */
            $scope.delete = function (clientRoleResource) {
                ManageUserRolesService.deleteExistingClientRole(clientRoleResource).then(function(){
                    $scope.loadExisting();
                });
            };

            // start by loading the currently saved roles
            $scope.loadExisting();
        }
    ])
;
