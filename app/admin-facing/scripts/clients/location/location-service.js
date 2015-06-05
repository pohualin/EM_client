'use strict';
angular.module('emmiManager')
    .service('Location', function ($http, $q, Session, UriTemplate, arrays) {
        var referenceData;

        function addSortIndex(entityPage, sort) {
            sort = sort || 0;
            if (entityPage && entityPage.content) {
                for (var size = entityPage.content.length; sort < size; sort++) {
                    var content = entityPage.content[sort];
                    content.sortIdx = sort;
                }
            }
            return sort;
        }
        function convertPageContentLinks(page){
            if (page) {
                angular.forEach(page, function (clientProviderResource) {
                    clientProviderResource.link = arrays.convertToObject('rel', 'href', clientProviderResource.link);
                });
            }
        }
        return {
            find: function (clientResource, query, status, sort, pageSize) {
                var uri = clientResource ? clientResource.link.possibleLocations : Session.link.locations,
                    sortToUse = sort && sort.property ? sort.property : null;
                if (sortToUse === 'city') {
                    sortToUse = [
                        sort.ascending ? 'city' : 'city,desc',
                        'state'
                    ];
                } else if (sortToUse) {
                    sortToUse += ',' + (sort.ascending ? 'asc' : 'desc');
                }
                return $http.get(UriTemplate.create(uri).stringify({
                        name: query,
                        status: status,
                        sort: sortToUse,
                        size: pageSize
                    }
                )).then(function (response) {
                    addSortIndex(response.data);
                    convertPageContentLinks(response.data.content);
                    return response.data;
                });
            },
            findWithoutCL: function (clientResource, query, status, sort, pageSize) {
                var uri = clientResource.link.possibleLocationsWithoutCL;
                return $http.get(UriTemplate.create(uri).stringify({
                        name: query,
                        status: status,
                        sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : '',
                        size: pageSize
                    }
                )).then(function (response) {
                    addSortIndex(response.data);
                    convertPageContentLinks(response.data.content);
                    return response.data;
                });
            },
            fetchPageLink: function (href) {
                return $http.get(href)
                    .then(function (response) {
                    	convertPageContentLinks(response.data.content);
                        return response.data;
                    });

            },
            newLocation: function () {
                return {
                    name: null,
                    phone: null,
                    city: null,
                    state: null,
                    active: true,
                    belongsToMutable: true,
                    belongsToCheckbox: true,
                    belongsTo: null,
                    usingThisLocation: []
                };
            },
            create: function (clientResource, location) {
                if (location.belongsToCheckbox){
                    location.belongsTo = {
                        id: clientResource.entity.id,
                        version: clientResource.entity.version
                    };
                }
                return $http.post(UriTemplate.create(clientResource.link.locations).stringify(), location)
                    .success(function (response) {
                        return response;
                    });
            },
            update: function (clientResource, location) {
                if (location.belongsToCheckbox){
                    location.belongsTo = {
                        id: clientResource.entity.id,
                        version: clientResource.entity.version
                    };
                } else {
                    // make sure un-checking works as well
                    delete location.belongsTo;
                }
                return $http.put(UriTemplate.create(clientResource.link.locations).stringify(), location)
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
            findForClient: function (clientResource, pageSize, sort) {
                return $http.get(UriTemplate.create(clientResource.link.locations).stringify({size: pageSize,
                    sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : ''
                }))
                    .then(function pageResponse(response) {
                        convertPageContentLinks(response.data.content);
                        return response.data;
                    });
            },
            removeLocation: function (locationResource) {
                return $http.delete(UriTemplate.create(locationResource.link.self).stringify())
                    .then(function (response) {
                        return response.data;
                    });
            },
            addLocationsToClient: function(clientResource, locations){
                return $http.post(UriTemplate.create(clientResource.link.possibleLocations).stringify(), locations)
                    .then(function (response) {
                        return response.data;
                    });
            }
        };
    })
;
