'use strict';
angular.module('emmiManager')
    .service('Client', function ($http, $q, Session, UriTemplate, $location) {
        var selectedClient;
        var referenceData;
        return {
            find: function (query, status, sort, pageSize) {
                return $http.get(UriTemplate.create(Session.link.clients).stringify({
                        name: query,
                        status: status,
                        sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : '',
                        size: pageSize
                    }
                )).then(function (response) {
                    return response.data;
                });
            },
            fetchPage: function (href) {
                return $http.get(href)
                    .then(function (response) {
                        return response.data;
                    });

            },
            insertClient: function (client) {
                return $http.post(UriTemplate.create(Session.link.clients).stringify(), client)
                    .success(function (response) {
                        // update the selected client with the response
                        angular.extend(selectedClient.entity, response.entity);
                        selectedClient.link = response.link;
                        return response;
                    });
            },
            updateClient: function (client) {
                return $http.put(UriTemplate.create(Session.link.clients).stringify(), client)
                    .success(function (response) {
                        angular.extend(selectedClient.entity, response.entity);
                        return response;
                    });
            },
            viewClient: function (clientEntity) {
                $location.path('/clients/' + clientEntity.id);
            },
            viewClientList: function () {
                $location.path('/clients');
            },
            getClient: function () {
                return selectedClient;
            },
            setClient: function (clientResource) {
                selectedClient = clientResource;
            },
            newClient: function () {
                selectedClient = {
                    entity: {
                        'name': null,
                        'type': null,
                        'active': true,
                        'contractOwner': null,
                        'contractStart': null,
                        'contractEnd': null,
                        'region': null,
                        'salesForceAccount': null
                    }
                };
                return selectedClient;
            },
            selectClient: function (clientId) {
                return $http.get(UriTemplate.create(Session.link.clientById).stringify({id: clientId}))
                    .then(function (response) {
                        selectedClient = response.data;
                        return selectedClient;
                    });
            },
            getReferenceData: function () {
                var deferred = $q.defer();
                if (!referenceData) {
                    $http.get(Session.link.clientsReferenceData).then(function (response) {
                        referenceData = response.data;
                        deferred.resolve(referenceData);
                    });
                } else {
                    deferred.resolve(referenceData);
                }
                return deferred.promise;
            },
            getOwnersReferenceDataList: function (href) {
                var owners = [];
                return $http.get(UriTemplate.create(href).stringify())
                    .then(function load(response) {
                        var page = response.data;
                        owners.push.apply(owners, page.content);
                        if (page.link && page.link['page-next']) {
                            $http.get(page.link['page-next']).then(function (response) {
                                load(response);
                            });
                        }
                        return owners;
                    });
            },
            findSalesForceAccount: function (href, searchString) {
                return $http.get(UriTemplate.create(href).stringify({q: searchString}))
                    .then(function (response) {
                        return response.data;
                    });
            },
            findNormalizedName: function (href, searchString) {
                return $http.get(UriTemplate.create(href).stringify({normalizedName: searchString}))
                    .then(function (response) {
                        return response.data;
                    });
            }
        };

    })

    .filter('contractOwnerFilter', function () {
        return function (contractOwner) {
            var name = '';
            if (contractOwner) {
                if (contractOwner.firstName && contractOwner.lastName) {
                    name = contractOwner.firstName + ' ' + contractOwner.lastName;
                }
                else if (contractOwner.firstName) {
                    name = contractOwner.firstName;
                }
                else if (contractOwner.lastName) {
                    name = contractOwner.lastName;
                }
            }
            return name;
        };
    })

;
