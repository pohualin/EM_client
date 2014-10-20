'use strict';
angular.module('emmiManager')
    .service('TeamSearchLocation', function ($http, $q, Session, UriTemplate) {
        var referenceData;

        return {
            save: function (url, locations) {
                return $http.post(UriTemplate.create(url).stringify(), locations).
                    then(function (response) {
                        return response;
                    });
            }
        };
    })
;
