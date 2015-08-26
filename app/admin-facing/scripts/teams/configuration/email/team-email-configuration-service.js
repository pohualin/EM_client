'use strict';

angular.module('emmiManager')
    .service('ClientTeamEmailConfigurationService', ['$http', 'UriTemplate',
        function ($http, UriTemplate) {
            return {

                /**
                 * Calls the back end to get all email configuration for a client-team
                 *
                 * @param teamResource
                 * @returns all questions and responses for a client user
                 */
                getTeamEmailConfiguration: function (team) {
                    return $http.get(UriTemplate.create(team.link.teamEmailConfig).stringify())
                        .then(function (response) {
                        return response.data;
                    });
                },

                /**
                 * Calls the back end to save or update a client-team email configuration.
                 *
                 * @param team The corresponding team
                 * @param emailConfigs The email configuration settings
                 * @returns Server status and updated email config entity
                 */
                saveOrUpdateTeamEmailConfiguration: function(team, emailConfigs) {
                    return $http.post(UriTemplate.create(team.link.teamEmailConfig).stringify(), emailConfigs.entity)
                        .then(function (response) {
                            return response.data;
                        });
                }
            };
        }
    ]);
