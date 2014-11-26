'use strict';
angular.module('emmiManager')

    .service('ManageUserRolesService', ['$filter', '$q', '$http', 'UriTemplate', 'CommonService', 'Client',
        function ($filter, $q, $http, UriTemplate, CommonService, Client) {
            var referenceData;
            return {
                /**
                 * Loads ALL roles for a client. It then copies over all possible
                 * role permissions on to that role shell.
                 *
                 * @returns a promise that resolves into the array of Role objects
                 */
                loadClientRoles: function () {
                    var deferred = $q.defer();
                    var roles = [];
                    $http.get(UriTemplate.create(Client.getClient().link.roles).stringify())
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
                                    if (!templatePerm.active) {
                                        templatePerm.active = templatePerm.name === savedPermission.name;
                                    }
                                });
                            });
                            clientRoleResource.original = angular.copy(clientRoleResource);
                            return response.data;
                        });
                },
                /**
                 * Saves a new client role entity object
                 *
                 * @param clientRoleEntity to be created
                 * @returns a promise that resolves into the saved role
                 */
                saveNewClientRole: function (clientRoleEntity) {
                    var active = $filter('filter')(clientRoleEntity.userClientPermissions, {active: true}, true);
                    return $http.post(UriTemplate.create(Client.getClient().link.roles).stringify(), {
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
                        active = $filter('filter')(role.userClientPermissions, {active: true}, true);
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
                 * Loads ALL reference data pages for client role modification. The reference
                 * data is also cached in this service.
                 *
                 * @returns a promise that resolves to the full reference data
                 */
                referenceData: function () {
                    var deferred = $q.defer();
                    if (!referenceData) {
                        $http.get((Client.getClient().link.rolesReferenceData)).then(function (response) {
                            referenceData = response.data;
                            deferred.resolve(referenceData);
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
                }
            };
        }])
;
