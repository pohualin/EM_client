'use strict';
angular.module('emmiManager')
    .service('Client', function ($http, $q, Session, UriTemplate) {
        var selectedClient;
        var referenceData;
        return {
            getClients: function (href) {
                return $http.get(href)
                    .then(function (response) {
                        return response.data;
                    });

            },
            insertClient: function (client) {
                return $http.post(UriTemplate.create(Session.link.clients).stringify(), client)
                    .success(function (response, status) {
                    	console.log(response);
                        return response;
                    });
            },
            updateClient: function (client) {
                return $http.put(UriTemplate.create(Session.link.clients).stringify(), client)
                    .success(function (response, status) {
                        return response;
                    });
            },
            deleteClient: function (id) {

            },
            getClient: function () {
                return selectedClient;
            },
            selectClient: function (href) {
                return $http.get(href)
                    .then(function (response) {
                        selectedClient = response.data.entity;
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
                return $http.get(UriTemplate.create(href).stringify({size: 100}))
                    .then(function (response) {
                        return response.data;
                    });
            },
            findSalesForceAccount: function(href, searchString){
                return $http.get(UriTemplate.create(href).stringify({q: searchString}))
                    .then(function (response) {
                        return response.data;
                    });
            }
        };

    })
;
