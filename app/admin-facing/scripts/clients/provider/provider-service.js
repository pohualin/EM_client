'use strict';
angular.module('emmiManager')
    .service('ClientProviderService', ['$http', '$q', 'Session', 'UriTemplate', 'arrays', 'CommonService',
       function ($http, $q, Session, UriTemplate, arrays, CommonService) {
        return {
            
            /**
             * Find all Providers by given query
             */
            find: function (clientResource, query, status, sort, pageSize) {
                return $http.get(UriTemplate.create(clientResource.link.possibleProviders).stringify({
                        name: query,
                        status: status,
                        sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : '',
                        size: pageSize
                    }
                )).then(function (response) {
                    CommonService.convertPageContentLinks(response.data);
                    return response.data;
                });
            },
            
            /**
             * From Team - Add Providers - Search all providers tab
             * Return a list of Providers that are not using given Client
             */
            findPossibleProvidersNotUsingClient: function (allTeamLocations, clientResource, query, status, sort, pageSize) {
                var teams = angular.copy(allTeamLocations);
                return $http.get(UriTemplate.create(clientResource.link.possibleProvidersNotUsingClient).stringify({
                        name: query,
                        status: status,
                        sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : '',
                        size: pageSize
                    }
                )).then(function (response) {
                    CommonService.convertPageContentLinks(response.data);
                    angular.forEach(response.data.content, function (provider) {
                        provider.provider.entity.selectedTeamLocations = angular.copy(teams);
                    });
                    return response.data;
                });
            },
            
            /**
             * Fetch another page of ClientProvider by given href
             */
            fetchPageLink: function (href) {
                return $http.get(href)
                    .then(function (response) {
                        CommonService.convertPageContentLinks(response.data);
                        return response.data;
                    });

            },
            
            /**
             * Create a new ClientProvider holder
             */
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
            
            /**
             * Create a ClientProvider
             */
            create: function (clientResource, clientProvider) {
                var toBeSaved = angular.copy(clientProvider);
                toBeSaved.provider = clientProvider.provider.entity;
                toBeSaved.client = clientProvider.entity;
                return $http.post(UriTemplate.create(clientResource.link.providers).stringify(), toBeSaved)
                    .success(function (response) {
                        return response;
                    });
            },
            
            /**
             * Update an existing ClientProvider
             */
            update: function (clientResource, clientProviderResource) {
                var toBeSaved = angular.copy(clientProviderResource);
                toBeSaved.provider = clientProviderResource.provider.entity;
                toBeSaved.client = clientResource.entity;
                return $http.put(UriTemplate.create(toBeSaved.link.self).stringify(), toBeSaved)
                    .success(function (response) {
                        return response;
                    });
            },
            
            /**
             * Fetch all specialties
             */
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
            
            /**
             * Return all ClientProviders by given Client 
             */
            findForClient: function (clientResource, sort) {
                return $http.get(UriTemplate.create(clientResource.link.providers).stringify({
                    sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : ''}))
                    .then(function (response) {
                        CommonService.convertPageContentLinks(response.data);
                        return response.data;
                    });
            },
            
            /**
             * Remove a ClientProvider relationship. Keep both Provider and Client
             */
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
            
            /**
             * Assiciate one or more providers to a given client
             */
            addProvidersToClient: function (clientResource, providers) {
                return $http.post(UriTemplate.create(clientResource.link.possibleProviders).stringify(), providers)
                    .then(function (response) {
                        return response.data;
                    });
            }
        };
    }])
;
