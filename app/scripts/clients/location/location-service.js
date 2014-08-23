'use strict';
angular.module('emmiManager')
    .service('Location', function ($http, $q, Session, UriTemplate) {
        var referenceData;
        return {
            find: function (query, status, pageSize) {
                return $http.get(UriTemplate.create(Session.link.locations).stringify({
                        name: query,
                        status: status,
                        size: pageSize
                    }
                )).then(function (response) {
                    return response.data;
                });
            },
            fetchPageLink: function (href) {
                return $http.get(href)
                    .then(function (response) {
                        return response.data;
                    });

            },
            create: function (location) {
                return $http.post(UriTemplate.create(Session.link.locations).stringify(), location)
                    .success(function (response) {
                        return response;
                    });
            },
            update: function (location) {
                return $http.put(UriTemplate.create(Session.link.locations).stringify(), location)
                    .success(function (response) {
                        location.version = response.entity.version;
                        return response;
                    });
            },
            getReferenceData: function () {
                var deferred = $q.defer();
                if (!referenceData) {
                    $http.get(Session.link.locationReferenceData).then(function (response) {
                        referenceData = response.data;
                        deferred.resolve(referenceData);
                    });
                } else {
                    deferred.resolve(referenceData);
                }
                return deferred.promise;
            },
            findForClient: function (client, pageSize) {
                var deferred = $q.defer();
                if (client && client.entity && client.entity.id) {
                    $http.get(UriTemplate.create(client.link.locations).stringify({size: pageSize}))
                        .then(function (response) {
                            deferred.resolve(response.data);
                        });
                } else {
                    deferred.resolve(null);
                }
                return deferred.promise;
            },
            findAllIdsForClient: function (client) {
                var deferred = $q.defer();
                if (client && client.entity && client.entity.id) {
                    $http.get(UriTemplate.create(client.link.allLocationIds).stringify())
                        .then(function (response) {
                            deferred.resolve(response.data);
                        });
                } else {
                    deferred.resolve([]);
                }
                return deferred.promise;
            },
            updateForClient: function (clientResource) {
                var added = [],
                    removed = [],
                    belongsTo = [];
                angular.forEach(clientResource.addedLocations, function (location) {
                    added.push(location);
                });
                angular.forEach(clientResource.removedLocations, function (location) {
                    removed.push(location);
                });
                angular.forEach(clientResource.belongsToChanged, function (location) {
                    if (location.belongsToCheckbox) {
                        location.belongsTo = clientResource.entity;
                    } else {
                        location.belongsTo = null;
                    }
                    belongsTo.push(location);
                });
                return $http.put(UriTemplate.create(clientResource.link.locations).stringify(), {
                    added: added,
                    deleted: removed,
                    belongsToUpdated: belongsTo
                }).then(function (response) {
                    return response.data;
                });
            }
        };
    })
;
