'use strict';
angular.module('emmiManager')

    .service('ManageUserRolesService', ['$filter', '$q', '$http', '$translate', 'UriTemplate', 'CommonService',
        function ($filter, $q, $http, $translate, UriTemplate, CommonService) {
            var referenceData;
            var existingClientRoles = [];
            return {
                /**
                 * Return true when there are existing client roles for a client
                 *
                 * @param clientResource the client
                 */
                hasExistingClientRoles: function (clientResource) {
                    var deferred = $q.defer();
                    var hasClientRoles = false;
                    this.loadClientRoles(clientResource).then(function(){
                        if(existingClientRoles.length > 0){
                            hasClientRoles = true;
                        }
                        deferred.resolve(hasClientRoles);
                    });
                    return deferred.promise;
                },
                /**
                 * Loads ALL roles for a client. It then copies over all possible
                 * role permissions on to that role shell.
                 *
                 * @param clientResource the client
                 * @returns a promise that resolves into the array of Role objects
                 */
                loadClientRoles: function (clientResource) {
                    var deferred = $q.defer();
                    var roles = [];
                    $http.get(UriTemplate.create(clientResource.link.roles).stringify())
                        .then(function load(response) {
                            var page = response.data;
                            CommonService.convertPageContentLinks(page);
                            angular.forEach(page.content, function (content) {
                                content.entity.userClientPermissions = (referenceData) ? angular.copy(referenceData.permission) : [];
                            });
                            roles.push.apply(roles, page.content);
                            if (page.link && page.link['page-next']) {
                                $http.get(page.link['page-next']).then(function (response) {
                                    load(response);
                                });
                            }
                            existingClientRoles = roles;
                            deferred.resolve(roles);
                        });
                    return deferred.promise;
                },
                /**
                 * Loads ALL roles for a client with permissions
                 *
                 * @param clientResource the client
                 * @returns a promise that resolves into the array of Role objects
                 */
                loadClientRolesWithPermissions: function (clientResource) {
                    var deferred = $q.defer();
                    var roles = [];
                    $http.get(UriTemplate.create(clientResource.link.roles).stringify())
                        .then(function load(response) {
                            var page = response.data;
                            CommonService.convertPageContentLinks(page);
                            angular.forEach(page.content, function (content) {
                            	$http.get(UriTemplate.create(content.link.permissions).stringify()).then(function(permissions){
                            		content.entity.permissions = permissions.data;
                            	});
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
                 * the current state of the database is pushed onto the clientRoleResource.original
                 * property.
                 *
                 * @param clientRoleResource used to load permissions
                 * @returns a promise that resolves into the loaded permissions
                 */
                loadPermissions: function (clientRoleResource) {
                    return $http.get(UriTemplate.create(clientRoleResource.link.permissions).stringify())
                        .then(function (response) {
                            angular.forEach(response.data, function (savedPermission) {
                                // set 'active' on the template permission
                                angular.forEach(clientRoleResource.entity.userClientPermissions, function (templatePerm) {
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

                            angular.forEach(clientRoleResource.entity.userClientPermissions, function (group) {
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

                            clientRoleResource.original = angular.copy(clientRoleResource);
                            return response.data;
                        });
                },
                /**
                 * Saves a new client role entity object
                 *
                 * @param clientRoleEntity to be created
                 * @param clientResource the client
                 * @returns a promise that resolves into the saved role
                 */
                saveNewClientRole: function (clientRoleEntity, clientResource) {
                    var active = this.selectedPermissions(clientRoleEntity.userClientPermissions);
                    return $http.post(UriTemplate.create(clientResource.link.roles).stringify(), {
                        name: clientRoleEntity.name,
                        userClientPermissions: active
                    }).then(function (response) {
                        return response.data;
                    });
                },
                /**
                 * Save/updates an existing clientRoleResource object. When the response comes back
                 * the passed role is reset to the state it would be in after a loadClientRoles call
                 * but before a loadPermissions call.
                 *
                 * @param clientRoleResource to be updated
                 * @returns a promise that resolves to the passed in clientRoleResource
                 */
                saveExistingClientRole: function (clientRoleResource) {
                    var role = clientRoleResource.entity,
                        active = this.selectedPermissions(clientRoleResource.entity.userClientPermissions);
                    return $http.put(UriTemplate.create(clientRoleResource.link.self).stringify(), {
                        id: role.id,
                        version: role.version,
                        client: role.client,
                        name: role.name,
                        userClientPermissions: active
                    }).then(function (response) {
                        var savedClientRoleResource = response.data;
                        // reset permissions to possible
                        savedClientRoleResource.entity.userClientPermissions = (referenceData) ? angular.copy(referenceData.permission) : [];
                        angular.extend(clientRoleResource, savedClientRoleResource);
                        clientRoleResource.editName = false;
                        delete clientRoleResource.original;
                        return clientRoleResource;
                    });
                },
                /**
                 * Deletes an existing clientRoleResource
                 *
                 * @param clientRoleResource to be removed
                 * @returns a promise that resolves to void
                 */
                deleteExistingClientRole: function (clientRoleResource) {
                    return $http.delete(UriTemplate.create(clientRoleResource.link.self).stringify()).then(function (response) {
                        return response.data;
                    });
                },
                /**
                 * Loads reference data page and all library roles for a client. The reference
                 * data is also cached in this service.
                 *
                 * @param clientResource the client
                 * @returns a promise that resolves to the full reference data
                 */
                referenceData: function (clientResource) {
                    var deferred = $q.defer();
                    var external = this;
                    if (!referenceData) {
                        // load reference data
                        $http.get(UriTemplate.create(clientResource.link.rolesReferenceData).stringify()).then(function (response) {
                            referenceData = response.data;
                            external.composePermissionArray(referenceData.permission).then(function(perm){
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
                 * Creates a new clientRoleEntity object
                 *
                 * @returns a new clientRoleEntity
                 */
                newClientRoleEntity: function () {
                    return {
                        name: '',
                        userClientPermissions: (referenceData) ? angular.copy(referenceData.permission) : []
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
                                $http.post(UriTemplate.create(clientResource.link.roles).stringify(), {
                                    name: selection.entity.name,
                                    userClientPermissions: permissions,
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
                 * Disables a library role when it is already present in the savedClientRoles
                 *
                 * @param savedClientRoles what is already saved
                 * @param libraryRole to disable or not
                 * @returns libraryRole modified
                 */
                disableSelectedLibraries: function (savedClientRoles, libraryRole) {
                    var match = false;
                    angular.forEach(savedClientRoles, function (existingClientRole) {
                        var type = existingClientRole.entity ? existingClientRole.entity.type : null;
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
                selectedPermissions: function(userClientPermissions){
                    var perms = [];
                    angular.forEach(userClientPermissions, function(group){
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
