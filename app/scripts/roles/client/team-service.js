'use strict';
angular.module('emmiManager')

    .service('ManageUserTeamRolesService', ['$filter', '$q', '$http', 'UriTemplate', 'CommonService', 'Client',
        function ($filter, $q, $http, UriTemplate, CommonService, Client) {
            var referenceData;
            return {
                /**
                 * Loads ALL roles for a team. It then copies over all possible
                 * role permissions on to that role shell.
                 *
                 * @returns a promise that resolves into the array of Role objects
                 */
                loadClientTeamRoles: function () {
                    var deferred = $q.defer();
                    var roles = [];
                    $http.get(UriTemplate.create(Client.getClient().link.teamRoles).stringify())
                        .then(function load(response) {
                            var page = response.data;
                            CommonService.convertPageContentLinks(page);
                            angular.forEach(page.content, function (content) {
                                content.entity.userClientTeamPermissions = (referenceData) ? angular.copy(referenceData.permission) : [];
                            });
                            roles.push.apply(roles, page.content);
                            if (page.link && page.link['page-next']) {
                                $http.get(page.link['page-next']).then(function (response) {
                                    load(response);
                                });
                            }
                            deferred.resolve(roles);
                        });
                    return deferred.promise;
                },
                /**
                 * Loads ALL permissions for a client role. Once loaded, the possible role permissions
                 * on the role resource are changed to 'active' (if they come back). Also a copy of
                 * the current state of the database is pushed onto the clientTeamRoleResource.original
                 * property.
                 *
                 * @param clientTeamRoleResource used to load permissions
                 * @returns a promise that resolves into the loaded permissions
                 */
                loadPermissions: function (clientTeamRoleResource) {
                    return $http.get(UriTemplate.create(clientTeamRoleResource.link.permissions).stringify())
                        .then(function (response) {
                            angular.forEach(response.data, function (savedPermission) {
                                // set 'active' on the template permission
                                angular.forEach(clientTeamRoleResource.entity.userClientTeamPermissions, function (templatePerm) {
                                    if (!templatePerm.active) {
                                        templatePerm.active = templatePerm.name === savedPermission.name;
                                    }
                                });
                            });
                            clientTeamRoleResource.original = angular.copy(clientTeamRoleResource);
                            return response.data;
                        });
                },
                /**
                 * Saves a new client role entity object
                 *
                 * @param clientTeamRoleEntity to be created
                 * @returns a promise that resolves into the saved role
                 */
                saveNewClientTeamRole: function (clientTeamRoleEntity) {
                    var active = $filter('filter')(clientTeamRoleEntity.userClientTeamPermissions, {active: true}, true);
                    return $http.post(UriTemplate.create(Client.getClient().link.teamRoles).stringify(), {
                        name: clientTeamRoleEntity.name,
                        userClientTeamPermissions: active
                    }).then(function (response) {
                        return response.data;
                    });
                },
                /**
                 * Save/updates an existing clientTeamRoleResource object. When the response comes back
                 * the passed role is reset to the state it would be in after a loadClientTeamRoles call
                 * but before a loadPermissions call.
                 *
                 * @param clientTeamRoleResource to be updated
                 * @returns a promise that resolves to the passed in clientTeamRoleResource
                 */
                saveExistingClientTeamRole: function (clientTeamRoleResource) {
                    var role = clientTeamRoleResource.entity,
                        active = $filter('filter')(role.userClientTeamPermissions, {active: true}, true);
                    return $http.put(UriTemplate.create(clientTeamRoleResource.link.self).stringify(), {
                        id: role.id,
                        version: role.version,
                        client: role.client,
                        name: role.name,
                        userClientTeamPermissions: active
                    }).then(function (response) {
                        var savedClientTeamRoleResource = response.data;
                        // reset permissions to possible
                        savedClientTeamRoleResource.entity.userClientTeamPermissions = (referenceData) ? angular.copy(referenceData.permission) : [];
                        angular.extend(clientTeamRoleResource, savedClientTeamRoleResource);
                        clientTeamRoleResource.editName = false;
                        delete clientTeamRoleResource.original;
                        return clientTeamRoleResource;
                    });
                },
                /**
                 * Deletes an existing clientTeamRoleResource
                 *
                 * @param clientTeamRoleResource to be removed
                 * @returns a promise that resolves to void
                 */
                deleteExistingClientTeamRole: function (clientTeamRoleResource) {
                    return $http.delete(UriTemplate.create(clientTeamRoleResource.link.self).stringify()).then(function (response) {
                        return response.data;
                    });
                },
                /**
                 * Loads ALL reference data pages for client role modification. The reference
                 * data is also cached in this service.
                 *
                 * @returns a promise that resolves to the full reference data
                 */
                referenceData: function () {
                    var deferred = $q.defer();
                    if (!referenceData) {
                        $http.get((Client.getClient().link.teamRolesReferenceData)).then(function (response) {
                            referenceData = response.data;
                            referenceData.roleLibrary = [];
                            // load library roles for reference data
                            $http.get(UriTemplate.create(referenceData.link.roles).stringify()).then(function load(roleResponse) {
                                var rolePage = roleResponse.data;
                                referenceData.roleLibrary.push.apply(referenceData.roleLibrary, rolePage.content);
                                if (rolePage.link && rolePage.link['page-next']) {
                                    $http.get(rolePage.link['page-next']).then(function (nextPage) {
                                        load(nextPage);
                                    });
                                }
                                deferred.resolve(referenceData);
                            });
                        });
                    } else {
                        deferred.resolve(referenceData);
                    }
                    return deferred.promise;
                },
                /**
                 * Creates a new clientTeamRoleEntity object
                 *
                 * @returns a new clientTeamRoleEntity
                 */
                newClientTeamRoleEntity: function () {
                    return {
                        name: '',
                        userClientTeamPermissions: (referenceData) ? angular.copy(referenceData.permission) : []
                    };
                },
                /**
                 * Save all selected roles within the role library
                 *
                 * @param roleLibrary that has the mods
                 * @returns the clean roleLibrary
                 */
                saveSelectedLibraries: function (roleLibrary) {
                    var deferred = $q.defer();
                    var selections = $filter('filter')(roleLibrary, {checked: true, disabled: false});
                    if (selections.length > 0) {
                        var saveFunctions = [];
                        // save each selection
                        angular.forEach(selections, function (selection) {
                            saveFunctions.push(
                                $http.post(UriTemplate.create(Client.getClient().link.teamRoles).stringify(), {
                                    name: selection.entity.name,
                                    userClientTeamPermissions: selection.entity.permission,
                                    type: {
                                        id: selection.entity.type.id
                                    }
                                })
                            );
                        });
                        // wait till they all come back
                        $q.all(saveFunctions).then(function allDone() {
                            deferred.resolve(roleLibrary);
                        });
                    }
                    return deferred.promise;
                },
                /**
                 * Disables a library role when it is already present in the savedClientTeamRoles
                 *
                 * @param savedClientTeamRoles what is already saved
                 * @param libraryRole to disable or not
                 * @returns libraryRole modified
                 */
                disableSelectedLibraries: function (savedClientTeamRoles, libraryRole) {
                    var match = false;
                    angular.forEach(savedClientTeamRoles, function (existingClientTeamRole) {
                        var type = existingClientTeamRole.entity ? existingClientTeamRole.entity.type : null;
                        if (type && libraryRole.entity.type.id === type.id) {
                            match = true;
                        }
                    });
                    // if there were a match, disable and select the library group
                    libraryRole.disabled = match;
                    if (libraryRole.disabled) {
                        libraryRole.checked = true;
                    }
                    return libraryRole;
                },
                /**
                 * Deselect all of the role libraries
                 *
                 * @param libraries to deselect
                 */
                deselectAllLibraries: function (libraries) {
                    angular.forEach(libraries, function (library) {
                        library.checked = false;
                    });
                }
            };
        }])
;
