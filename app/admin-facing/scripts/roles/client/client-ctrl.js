'use strict';

angular.module('emmiManager')

/**
 *   Manage Client Level roles for a client
 */
    .controller('ClientRoleAdminCtrl', ['$scope', '$alert', 'ManageUserRolesService', '$filter', 'focus',
        function ($scope, $alert, ManageUserRolesService, $filter, focus) {

            ManageUserRolesService.referenceData($scope.clientResource).then(function (referenceData) {
                $scope.clientReferenceData = referenceData;
                $scope.libraries = referenceData.roleLibrary;
            });

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
             * Evaluates if an existing client role resource has changed
             *
             * @param clientRoleResource to check permissions on
             * @returns {boolean} true for at least one checked
             */
            $scope.existingHasChanged = function (clientRoleResource) {
                var ret = false;
                if (clientRoleResource) {
                    var original = clientRoleResource.original ? clientRoleResource.original : clientRoleResource;
                    ret = !angular.equals(clientRoleResource.entity, original.entity, true);
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
                ManageUserRolesService.saveNewClientRole(clientRoleEntity, $scope.clientResource).then(function () {
                    delete $scope.newClientRole;
                    $scope.loadExisting();
                    $scope.successAlert(clientRoleEntity);
                });
            };

            /**
             * Called when 'cancel' is clicked on the create new client role panel
             *
             * @param form for unsaved changes
             */
            $scope.cancelNew = function (form) {
                form.$setPristine();
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
                    ManageUserRolesService.loadPermissions(clientRoleResource);
                    // Set the form back to pristine after loading permissions from server
                    form.$setPristine();
                } else {
                    // Set the form back to pristine after initialization
                    form.$setPristine();
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
                ManageUserRolesService.saveExistingClientRole(clientRoleResource);
            };

            /**
             * Called when a client role resource 'remove' button is clicked
             *
             * @param clientRoleResource to delete
             */
            $scope.remove = function (clientRoleResource) {
                ManageUserRolesService.deleteExistingClientRole(clientRoleResource).then(function () {
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
                        window.roles = $scope.clientReferenceData.roleLibrary;
                        angular.forEach($scope.clientReferenceData.roleLibrary, function(role){
                            if(role.checked && !role.disabled){
                                $scope.successAlert(role.entity);
                            }
                        });
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
            $scope.successAlert = function(clientRole){
                $alert({
                    content: '<b>' + clientRole.name + '</b> has been added successfully.',
                    container: '#messages-container',
                    type: 'success',
                    placement: 'top',
                    show: true,
                    duration: 5,
                    dismissable: true
                });
            };

            // start by loading the currently saved roles
            $scope.loadExisting();
        }
    ]).config(['ivhTreeviewOptionsProvider', function (ivhTreeviewOptionsProvider) {
        ivhTreeviewOptionsProvider.set({
            idAttribute: 'name',
            labelAttribute: 'displayName',
            childrenAttribute: 'children',
            selectedAttribute: 'selected',
            useCheckboxes: true,
            expandToDepth: 1,
            indeterminateAttribute: '__ivhTreeviewIndeterminate',
            defaultSelectedState: false,
            validate: true,
            twistieExpandedTpl: '',
            twistieCollapsedTpl: '',
            twistieLeafTpl: ''
        });
    }]);

