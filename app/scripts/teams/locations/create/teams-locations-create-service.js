'use strict';

angular.module('emmiManager')

    .service('TeamLocationCreate', function ($http, $q, Session, UriTemplate) {
        return {
             findTeamLocationTeamProviders: function (url) {
                return $http.get(UriTemplate.create(url).stringify()).then(function load(response) {
                    return response.data;
                });
             }
        };
    })

;