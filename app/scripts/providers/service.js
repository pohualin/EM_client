'use strict';

angular.module('emmiManager').service(
    'ProviderService',
    function($http, arrays, Session, UriTemplate) {
        return {
            // ProvidersResource.getById(Long id)
            getProviderById: function(id) {
        		return $http.get(
                    UriTemplate.create(Session.link.providerById)
                    .stringify({
                        id: id
                    })).then(function(response) {
                    return response.data;
                });            		
            },

            // ProvidersResource.currentClients(Long id)
            getCurrentClientsByProvider: function(provider, pageSize) {
                return $http.get(
                    UriTemplate.create(provider.link.clients)
                    .stringify({
                        size: pageSize
                    })).then(function(response) {
                    return response.data;
                });
            },

            // ProvidersResource.update(Provider provider)
            updateProvider: function(providerToUpdate) {
                return $http.put(UriTemplate.create(Session.link.providers).stringify(), providerToUpdate)
                    .success(function(response) {
                        return response.data;
                    });
            },

            // ProvidersResource.getRefData()
            specialtyRefData: function(providerResource) {
                if (providerResource.link.providerReferenceData) {
                    var responseArray = [];
                    return $http.get(UriTemplate.create(providerResource.link.providerReferenceData).stringify()).then(function addToResponseArray(response) {
                        angular.forEach(response.data.content, function(specialty) {
                            responseArray.push(specialty.entity);
                        });
                        if (response.data.link && response.data.link['page-next']) {
                            $http.get(response.data.link['page-next']).then(function(response) {
                                addToResponseArray(response);
                            });
                        }
                        return responseArray;
                    });
                } else {
                    return null;
                }
            }
        };
    });
