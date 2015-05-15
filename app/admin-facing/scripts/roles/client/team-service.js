'use strict';
angular.module('emmiManager')

    .service('ManageUserTeamRolesService', ['$filter', '$q', '$http', '$translate', 'UriTemplate', 'CommonService',
        function ($filter, $q, $http, $translate, UriTemplate, CommonService) {
            var referenceData;
            var existingClientTeamRoles = [];
            return {
                /**
                 * Return true when there are existing client team roles for a client
                 *
                 * @param clientResource the client
                 */
                hasExistingClientTeamRoles: function (clientResource) {
                    var deferred = $q.defer();
                    var hasClientTeamRoles = false;
                    this.loadClientTeamRoles(clientResource).then(function(){
                        if(existingClientTeamRoles.length > 0){
                            hasClientTeamRoles = true;
                        }
                        deferred.resolve(hasClientTeamRoles);
                    });
                    return deferred.promise;
                },
                /**
                 * Loads ALL roles for a team. It then copies over all possible
                 * role permissions on to that role shell.
                 *
                 * @param clientResource the client
                 * @returns a promise that resolves into the array of Role objects
                 */
                loadClientTeamRoles: function (clientResource) {
                    var deferred = $q.defer();
                    var roles = [];
                    $http.get(UriTemplate.create(clientResource.link.teamRoles).stringify())
                        .then(function load(response) {
                            var page = response.data;
                            CommonService.convertPageContentLinks(page);
                            angular.forEach(page.content, function (content) {
                                content.entity.userClientTeamPermissions = (referenceData) ? angular.copy(referenceData.permission) : [];
                            });
                            roles.push.apply(roles, page.content);
                            if (page.link && page.link['page-next']) {
                                return $http.get(page.link['page-next']).then(function (response) {
                                    return load(response);
                                });
                            }
                            existingClientTeamRoles = roles;
                            deferred.resolve(roles);
                        });
                    return deferred.promise;
                },
                /**
                 * Loads ALL permissions for a client team role.
                 *
                 * @param clientTeamRoleResource used to load permissions
                 * @returns a promise that resolves into the loaded permissions
                 */
                loadAllPermissions: function (clientTeamRoleResource) {
                	var deferred = $q.defer();
                	if(!clientTeamRoleResource.entity.permissions){
                		$http.get(UriTemplate.create(clientTeamRoleResource.link.permissions).stringify())
	                    .then(function (response) {
	                    	clientTeamRoleResource.entity.permissions = response.data;
	                    });
                		deferred.resolve(clientTeamRoleResource);
                	} else {
                		deferred.resolve(clientTeamRoleResource);
                	}
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
                                    if(!templatePerm.children){
                                        if(!templatePerm.selected){
                                            templatePerm.selected = templatePerm.name === savedPermission.name;
                                        }
                                    } else {
                                        angular.forEach(templatePerm.children, function(child){
                                            if(!child.selected){
                                                child.selected = child.name === savedPermission.name;
                                            }
                                        });
                                    }
                                });
                            });

                            angular.forEach(clientTeamRoleResource.entity.userClientTeamPermissions, function (group) {
                                var selectedChildren = 0;
                                angular.forEach(group.children, function(child){
                                    if(child.selected){
                                        selectedChildren++;
                                    }
                                });
                                // Half check or check on group checkbox
                                if(selectedChildren !== 0 && group.children.length !== selectedChildren){
                                    group.__ivhTreeviewIndeterminate = true;
                                } else if(selectedChildren !== 0 && group.children.length === selectedChildren) {
                                    group.selected = true;
                                }
                            });

                            clientTeamRoleResource.original = angular.copy(clientTeamRoleResource);
                            return response.data;
                        });
                },
                /**
                 * Saves a new client role entity object
                 *
                 * @param clientTeamRoleEntity to be created
                 * @param clientResource the client
                 * @returns a promise that resolves into the saved role
                 */
                saveNewClientTeamRole: function (clientTeamRoleEntity, clientResource) {
                    var active = this.selectedPermissions(clientTeamRoleEntity.userClientTeamPermissions);
                    return $http.post(UriTemplate.create(clientResource.link.teamRoles).stringify(), {
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
                        active = this.selectedPermissions(clientTeamRoleResource.entity.userClientTeamPermissions);
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
                 * @param clientResource the client
                 * @returns a promise that resolves to the full reference data
                 */
                referenceData: function (clientResource) {
                    var deferred = $q.defer();
                    var self = this;
                    if (!referenceData) {
                        $http.get((clientResource.link.teamRolesReferenceData)).then(function (response) {
                            referenceData = response.data;
                            self.composePermissionArray(referenceData.permission).then(function(perm){
                                referenceData.permission = perm;
                            });
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
                 * @returns {*} a new clientTeamRoleEntity
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
                 * @param clientResource the client
                 * @returns the clean roleLibrary
                 */
                saveSelectedLibraries: function (roleLibrary, clientResource) {
                    var deferred = $q.defer();
                    var selections = $filter('filter')(roleLibrary, {checked: true, disabled: false});
                    if (selections.length > 0) {
                        var saveFunctions = [];
                        // save each selection
                        angular.forEach(selections, function (selection) {
                            var permissions = [];
                            angular.forEach(selection.entity.permission, function(p){
                                permissions.push(p.permission);
                            });
                            saveFunctions.push(
                                $http.post(UriTemplate.create(clientResource.link.teamRoles).stringify(), {
                                    name: selection.entity.name,
                                    userClientTeamPermissions: permissions,
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
                    libraryRole.disableNameMatch = false;
                    libraryRole.disabled = false;
                    angular.forEach(savedClientTeamRoles, function (existingClientTeamRole) {
                        var type = existingClientTeamRole.entity ? existingClientTeamRole.entity.type : null;
                        if (type && libraryRole.entity.type.id === type.id) {
                            libraryRole.disabled = true;
                        } else if(libraryRole.entity.normalizedName === existingClientTeamRole.entity.normalizedName){
                            libraryRole.disableNameMatch = true;
                            libraryRole.disabled = true;
                        }
                    });
                    // if there were a match, disable and select the library group
                    if (libraryRole.disabled && !libraryRole.disableNameMatch) {
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
                },
                /**
                 * This method will compose permission tree from an array of permissions with group
                 * It will translate permission name and sort the return array by group rank.
                 */
                composePermissionArray: function(permissions){
                    var deferred = $q.defer();
                    var promises = [];
                    var map = {};
                    angular.forEach(permissions, function(aPermission){
                        var group = aPermission.group;
                        var deferred = $q.defer();
                        delete aPermission.group;
                        if(!map[group.rank]){
                            // Ensure children are sorted by rank
                            group.childrenMap = {};
                            group.childrenMap[aPermission.rank] = aPermission;
                            map[group.rank] = group;
                            // translate group name calls
                            $translate(group.name).then(function(translated){
                                group.displayName = translated;
                                deferred.resolve(group);
                            }, function(error){
                                group.displayName = group.name;
                                deferred.resolve(group);
                            });
                            promises.push(deferred.promise);
                        } else {
                            map[group.rank].childrenMap[aPermission.rank] = aPermission;
                        }
                        // translate permission name calls
                        $translate(aPermission.name).then(function(translated){
                            aPermission.displayName = translated;
                            deferred.resolve(aPermission);
                        }, function(error){
                            aPermission.displayName = aPermission.name;
                            deferred.resolve(aPermission);
                        });
                        promises.push(deferred.promise);
                    });

                    $q.all(promises).then(function(){
                        var perm = [];

                        // Turn children map to children
                        angular.forEach(map, function(group){
                            angular.forEach(group.childrenMap, function(child){
                                if(!group.children){
                                    group.children = [];
                                }
                                group.children.push(child);
                            });
                        });

                        angular.forEach(map, function(group){
                            // Promote the only child to group
                            if(group.children.length === 1){
                                perm.push(group.children[0]);
                            } else if(group.children.length > 1) {
                                perm.push(group);
                            }
                        });
                        deferred.resolve(perm);
                    });

                    return deferred.promise;
                },
                /**
                 * Collect all selected permissions
                 */
                selectedPermissions: function(userClientTeamPermissions){
                    var perms = [];
                    angular.forEach(userClientTeamPermissions, function(group){
                        if (!group.children){
                            perms.push(group);
                        } else {
                            angular.forEach(group.children, function(child){
                                perms.push(child);
                            });
                        }
                    });
                    return $filter('filter')(perms, {selected: true}, true);
                }
            };
        }])
;
