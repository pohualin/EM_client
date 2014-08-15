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
            }
        };

    })
;
