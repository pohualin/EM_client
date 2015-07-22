'use strict';

angular.module('emmiManager')
    .service('SelfRegistrationService', ['$http', 'UriTemplate', '$q', 'API', function ($http, UriTemplate, $q, API) {
        return {
            /**
             * Calls the back end to get the self registration configuration for a client-team
             *
             * @param teamResource
             * @returns self registration code
             */
            get: function (team) {
                return $http.get(UriTemplate.create(team.link.selfRegConfig).stringify())
                    .then(function (response) {
                        return response.data;
                    });
            },
            /**
             * Calls the back end to save a client-team self registration configuration.
             * @param team
             * @param config the self reg configuration for a team
             * @returns selfRegConfig
             */
            create: function (team, config) {
                return $http.post(UriTemplate.create(team.link.selfRegConfig).stringify(), config)
                    .success(function (response) {
                        return response.data;
                    });
            },
            /**
             * Calls the back end to update a client-team self registration configuration.
             * @param team
             * @param config the self reg configuration for a team
             * @returns selfRegConfig
             */
            update: function (team, config) {
                return $http.put(UriTemplate.create(team.link.selfRegConfig).stringify(), config)
                    .success(function (response) {
                        return response.data;
                    });
            },
            getLanguages: function() {
                var deferred = $q.defer();
                var languages = [];
                $http.get(UriTemplate.create(API.languages).stringify()).then(function addToLanguages(response) {
                    var page = response.data;
                    angular.forEach(page.content, function(language){
                        languages.push(language);
                    });
                    if(page.link && page.link['page-next']){
                        $http.get(page.link['page-next']).then(function(response){
                            addToLanguages(response);
                        });
                    } else {
                        deferred.resolve(languages);
                    }
                });
                return deferred.promise;
            }
        };
    }])
;
