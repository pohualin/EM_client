'use strict';
angular.module('emmiManager')

    .service('ManageUserRolesService', ['$filter', '$q', '$http', 'UriTemplate', 'CommonService', 'Client',
        function ($filter, $q, $http, UriTemplate, CommonService, Client) {
            var referenceData;
            return {
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
                loadPermissions: function (roleResource) {
                    return $http.get(UriTemplate.create(roleResource.link.permissions).stringify())
                        .then(function (response) {
                            roleResource.savedPermissions = response.data;
                            return response.data;
                        });
                },
                saveNewClientRole: function (role) {
                    var active = $filter('filter')(role.userClientPermissions, {active: true}, true);
                    return $http.post(UriTemplate.create(Client.getClient().link.roles).stringify(), {
                        name: role.name,
                        userClientPermissions: active
                    }).then(function (response) {
                        return response.data;
                    });
                },
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
                        response.data.entity.userClientPermissions = (referenceData) ? angular.copy(referenceData.permission) : [];
                        return response.data;
                    });
                },
                deleteExistingClientRole: function (clientRoleResource) {
                    return $http.delete(UriTemplate.create(clientRoleResource.link.self).stringify()).then(function (response) {
                        return response.data;
                    });
                },
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
                newClientRole: function () {
                    return {
                        name: '',
                        userClientPermissions: (referenceData) ? angular.copy(referenceData.permission) : []
                    };
                }
            };
        }])
;
