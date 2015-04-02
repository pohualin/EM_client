'use strict';

angular.module('emmiManager')

    .service('EditTeam', function ($http, $q, Session, UriTemplate) {
        return {
            save: function (team, uri) {
                return $http.put(UriTemplate.create(uri).stringify(), team).
                    then(function (response) {
                        return response;
                    });
            }
        };
    })
;
