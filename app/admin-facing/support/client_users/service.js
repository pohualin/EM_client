'use strict';
angular.module('emmiManager')

/**
 * This service is responsible fetch operations for UserClient resources across clients
 */
.service('ClientUsersSupportService', ['$filter', '$q', '$http', 'UriTemplate', 'CommonService', 'Session',
    function ($filter, $q, $http, UriTemplate, CommonService, Session) {
        var referenceData;
        
        return {
            /**
             * Get reference data for UserClient
             */
            getReferenceData: function () {
                var deferred = $q.defer();
                if (!referenceData) {
                    $http.get(Session.link.userClientReferenceData).then(function (response) {
                        referenceData = response.data;
                        deferred.resolve(referenceData);
                    });
                } else {
                    deferred.resolve(referenceData);
                }
                return deferred.promise;
            },
            
            /**
             * Call server to get a list of UserClient
             */
            list: function (query, sort, status) {
                return $http.get(UriTemplate.create(Session.link.clientUsers).stringify({
                        term: query,
                        status: status,
                        sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : ''
                    })).then(function (response) {
                        CommonService.convertPageContentLinks(response.data);
                        return response.data;
                    });
            },
            
            /**
             * Call server to fetch next batch of UserClient
             */
            fetchPage: function (href) {
                return $http.get(UriTemplate.create(href).stringify())
                    .then(function (response) {
                        CommonService.convertPageContentLinks(response);
                        return response.data;
                    });
            }
        };
    }]);
