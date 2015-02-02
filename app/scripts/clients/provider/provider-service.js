'use strict';
angular.module('emmiManager')
    .service('ClientProviderService', function ($http, $q, Session, UriTemplate, arrays) {
        function convertPageContentLinks(page){
            if (page) {
                angular.forEach(page, function (clientProviderResource) {
                    clientProviderResource.link = arrays.convertToObject('rel', 'href', clientProviderResource.link);
                });
            }
        }
        return {
            find: function (clientResource, query, status, sort, pageSize) {
                return $http.get(UriTemplate.create(clientResource.link.possibleProviders).stringify({
                        name: query,
                        status: status,
                        sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : '',
                        size: pageSize
                    }
                )).then(function (response) {
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
            newClientProvider: function () {
                return {
                    externalId: '',
                    provider: {
                        entity: {
                            firstName: null,
                            middleName: null,
                            lastName: null,
                            email: null,
                            specialty: null,
                            active: true
                        }
                    }
                };
            },
            create: function (clientResource, clientProvider) {
                var toBeSaved = angular.copy(clientProvider);
                toBeSaved.provider = clientProvider.provider.entity;
                toBeSaved.client = clientProvider.entity;
                return $http.post(UriTemplate.create(clientResource.link.providers).stringify(), toBeSaved)
                    .success(function (response) {
                        return response;
                    });
            },
            update: function (clientResource, clientProviderResource) {
                var toBeSaved = angular.copy(clientProviderResource);
                toBeSaved.provider = clientProviderResource.provider.entity;
                toBeSaved.client = clientResource.entity;
                return $http.put(UriTemplate.create(toBeSaved.link.self).stringify(), toBeSaved)
                    .success(function (response) {
                        return response;
                    });
            },
            specialtyRefData: function (clientResource) {
                if (clientResource.link.providerReferenceData) {
                    var responseArray = [];
                    return $http.get(UriTemplate.create(clientResource.link.providerReferenceData).stringify()).then(function addToResponseArray(response) {
                        angular.forEach(response.data.content, function (specialty) {
                            responseArray.push(specialty.entity);
                        });
                        if (response.data.link && response.data.link['page-next']) {
                            $http.get(response.data.link['page-next']).then(function (response) {
                                addToResponseArray(response);
                            });
                        }
                        return responseArray;
                    });
                } else {
                    return null;
                }
            },
            findForClient: function (clientResource, pageSize) {
                return $http.get(UriTemplate.create(clientResource.link.providers).stringify({size: pageSize}))
                    .then(function (response) {
                        convertPageContentLinks(response.data.content);
                        return response.data;
                    });
            },
            removeProvider: function (providerResource) {
                return $http.delete(UriTemplate.create(providerResource.link.self).stringify())
                    .then(function (response) {
                        return response.data;
                    });
            },
            findTeamsUsing: function (clientProviderResource) {
                var responseArray = [];
                return $http.get(UriTemplate.create(clientProviderResource.link.teams).stringify())
                    .then(function addToResponseArray(response) {
                        angular.forEach(response.data.content, function (teamResource) {
                            responseArray.push(teamResource.entity);
                        });
                        if (response.data.link && response.data.link['page-next']) {
                            $http.get(response.data.link['page-next']).then(function (response) {
                                addToResponseArray(response);
                            });
                        }
                        return responseArray;
                    });
            },
            addProvidersToClient: function (clientResource, providers) {
                return $http.post(UriTemplate.create(clientResource.link.possibleProviders).stringify(), providers)
                    .then(function (response) {
                        return response.data;
                    });
            }
        };
    })
;
