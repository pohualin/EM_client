'use strict';

angular.module('emmiManager')

    .service('TeamLocationCreate', function ($http, $q, Session, UriTemplate) {
        return {
             findTeamLocationTeamProviders: function (location) {
                return $http.get(UriTemplate.create(location.link.tptls).stringify()).then(function load(response) {
                    return response.data;
                });
             }
        };
    })

;