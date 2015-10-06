'use strict';

angular.module('emmiManager')
    .service('TeamPrintInstructionConfigurationService', ['$http', 'UriTemplate', 'CommonService',
        function ($http, UriTemplate, CommonService) {
            return {

                /**
                 * Calls back end to get print instruction
                 * configuration for a team
                 * 
                 * @param team to use
                 * @returns PrintInstructionConfiguration for the team
                 */
                getTeamPrintInstructionConfiguration: function (team) {
                    return $http.get(UriTemplate.create(team.link.printInstructionConfiguration).stringify())
                        .then(function (response) {
                        CommonService.convertPageContentLinks(response.data);
                        return response.data;
                    });
                },

                /**
                 * Calls back end to create
                 * TeamPrintInstructionConfiguration for a team
                 * 
                 * @param team The corresponding team
                 * @param configuration The TeamPrintInstructionConfiguration settings
                 * @returns Server status and created TeamPrintInstructionConfigurationResource
                 * 
                 */
                save: function(team, configuration) {
                    return $http.post(UriTemplate.create(team.link.printInstructionConfiguration).stringify(), configuration.entity)
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                },
                

                /**
                 * Calls back end to update an
                 * existing
                 * TeamPrintInstructionConfiguration
                 * for a team
                 * 
                 * @param team The corresponding team
                 * @param configuration The TeamPrintInstructionConfiguration settings
                 * @returns Server status and updated TeamPrintInstructionConfigurationResource
                 * 
                 */
                update: function(configuration) {
                    return $http.put(UriTemplate.create(configuration.link.self).stringify(), configuration.entity)
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                },
                
                saveOrUpdate: function(team, configuration) {
                    if (configuration.link.self) {
                        return this.update(configuration);
                    } else {
                        return this.save(team, configuration);
                    }
                }
            };
        }
    ]);
