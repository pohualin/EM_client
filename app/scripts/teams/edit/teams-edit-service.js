'use strict';

angular.module('emmiManager')

    .service('EditTeam', function ($http, $q, Session, UriTemplate) {
        return {
            save: function (teamResource) {
                return $http.put(UriTemplate.create(teamResource.link.self).stringify(), teamResource.entity).
                    then(function (response) {
                        return response;
                    });
            }
        };
    })

;