'use strict';
angular.module('emmiManager')
    .service('Location', function ($http, $q, Session, UriTemplate, arrays) {
        var referenceData, query;
        function addSortIndex(entityPage){
            if (entityPage && entityPage.content) {
                for (var sort = 0, size = entityPage.content.length; sort < size; sort++) {
                    var content = entityPage.content[sort];
                    content.sortIdx = sort;
                }
            }
        }
        return {
            find: function (query, status, sort, pageSize) {
                return $http.get(UriTemplate.create(Session.link.locations).stringify({
                        name: query,
                        status: status,
                        sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : '',
                        size: pageSize
                    }
                )).then(function (response) {
                    addSortIndex(response.data);
                    return response.data;
                });
            },
            fetchPageLink: function (href) {
                return $http.get(href)
                    .then(function (response) {
                        addSortIndex(response.data);
                        return response.data;
                    });

            },
            newLocation: function () {
                return {
                    name: null,
                    phone: null,
                    city: null,
                    state: null,
                    belongsToMutable: true,
                    belongsToCheckbox: true,
                    belongsTo: null,
                    usingThisLocation: []
                };
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
                            addSortIndex(response.data);
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
            hasLocationModifications: function (clientResource) {
                return  !(angular.equals({}, clientResource.addedLocations) &&
                    angular.equals({}, clientResource.removedLocations) &&
                    angular.equals({}, clientResource.belongsToChanged));
            },
            removeLocation: function (locationResource) {
                locationResource.links = arrays.convertToObject('rel', 'href', locationResource.link);
                return $http.delete(UriTemplate.create(locationResource.links.self).stringify())
                    .then(function (response) {
                        return response.data;
                    });
            },
            updateForClient: function (clientResource) {
                var added = [],
                    belongsTo = [];
                angular.forEach(clientResource.addedLocations, function (location) {
                    added.push(location);
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
                    belongsToUpdated: belongsTo
                }).then(function (response) {
                    return response.data;
                });
            }
        };
    })
;
