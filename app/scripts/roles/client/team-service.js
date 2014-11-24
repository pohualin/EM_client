'use strict';
angular.module('emmiManager')

    .service('ManageUserTeamRolesService', ['$filter', '$q', '$http', 'UriTemplate', 'CommonService', 'Client',
        function ($filter, $q, $http, UriTemplate, CommonService, Client) {
            var referenceData;
            return {
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
                loadPermissions: function (roleResource) {
                    return $http.get(UriTemplate.create(roleResource.link.permissions).stringify())
                        .then(function (response) {
                            roleResource.savedPermissions = response.data;
                            return response.data;
                        });
                },
                saveNewClientTeamRole: function (role) {
                    var active = $filter('filter')(role.userClientTeamPermissions, {active: true}, true);
                    return $http.post(UriTemplate.create(Client.getClient().link.teamRoles).stringify(), {
                        name: role.name,
                        userClientTeamPermissions: active
                    }).then(function (response) {
                        return response.data;
                    });
                },
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
                        response.data.entity.userClientTeamPermissions = (referenceData) ? angular.copy(referenceData.permission) : [];
                        return response.data;
                    });
                },
                deleteExistingClientTeamRole: function (clientTeamRoleResource) {
                    return $http.delete(UriTemplate.create(clientTeamRoleResource.link.self).stringify()).then(function (response) {
                        return response.data;
                    });
                },
                referenceData: function () {
                    var deferred = $q.defer();
                    if (!referenceData) {
                        $http.get((Client.getClient().link.teamRolesReferenceData)).then(function (response) {
                            referenceData = response.data;
                            deferred.resolve(referenceData);
                        });
                    } else {
                        deferred.resolve(referenceData);
                    }
                    return deferred.promise;
                },
                newClientTeamRole: function () {
                    return {
                        name: '',
                        userClientTeamPermissions: (referenceData) ? angular.copy(referenceData.permission) : []
                    };
                }
            };
        }])
;
