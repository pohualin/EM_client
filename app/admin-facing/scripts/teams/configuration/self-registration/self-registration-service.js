'use strict';

angular.module('emmiManager')
    .service('SelfRegistrationService', ['$http', 'UriTemplate', function ($http, UriTemplate) {
        return {
            /**
             * Calls the back end to get the self registration configuration for a client-team
             *
             * @param teamResource
             * @returns self registration code
             */
            getSelfRegCode: function (team) {
                return $http.get(UriTemplate.create(team.link.teamSelfRegConfig).stringify())
                    .then(function (response) {
                        return response.data;
                    });
            },
            /**
             * Calls the back end to save or update a client-team self registration configuration.
             * @param team
             * @param config the self reg configuration for a team
             * @returns selfRegConfig
             */
            saveOrUpdateSelfRegCode: function (team, config) {
                return $http.post(UriTemplate.create(team.link.teamSelfRegConfig).stringify(), config, {override500: true})
                    .success(function (response) {
                        return response.data;
                    });
            }
        }
    }])
;
