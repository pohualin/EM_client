'use strict';
angular.module('emmiManager')
    .service('TeamLocation', function ($http, $q, Session, UriTemplate, arrays) {
        var referenceData;

        return {
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
            findClientsWithLocations: function (url) {
                var deferred = $q.defer();
                $http.get(UriTemplate.create(url).stringify())
                    .then(function (response) {
                        deferred.resolve(response.data);
                    });
                return deferred.promise;
            }            
        };
    })
;
