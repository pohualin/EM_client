'use strict';

angular.module('emmiManager')
    .service('TeamPrintInstructionConfigurationService', ['$http', 'UriTemplate', 'CommonService',
        function ($http, UriTemplate, CommonService) {
            return {

                /**
                 * Calls the back end to get all email configuration for a client-team
                 *
                 * @param teamResource
                 * @returns all questions and responses for a client user
                 */
                getTeamPrintInstructionConfiguration: function (team) {
                    return $http.get(UriTemplate.create(team.link.printInstructionConfiguration).stringify())
                        .then(function (response) {
                        CommonService.convertPageContentLinks(response.data);
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
                save: function(team, configuration) {
                    return $http.post(UriTemplate.create(team.link.printInstructionConfiguration).stringify(), configuration.entity)
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                },
                
                update: function(configuration) {
                    return $http.put(UriTemplate.create(configuration.link.self).stringify(), configuration.entity)
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                }
            };
        }
    ]);
