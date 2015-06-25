'use strict';
angular.module('emmiManager')

    .service('ClientTeamSchedulingConfigurationService', ['$q', '$http', 'UriTemplate',
        function ($q, $http, UriTemplate) {
    	      return {
    	    	  
    	    	 /**
                 * Calls the back end to get all scheduling configuration for a client-team
                 *
                 * @param teamResource
                 * @returns team scheduling configuration for the team
                 */
                getTeamSchedulingConfiguration: function (team) {
                    return $http.get(UriTemplate.create(team.link.teamSchedulingConfig).stringify())
                        .then(function (response) {
                        	return response.data;
                        });
                },
                
                /**
                 * Calls the back end to save or update a client-team scheduling configuration.
                 * @param team
                 * @param schedulingConfigs all the scheduling configuration for a team 
                 * @returns teamschedulingConfig
                 */
                saveOrUpdateTeamSchedulingConfiguration: function (team,
                		                                      schedulingConfigs){
                	return $http.post(UriTemplate.create(team.link.teamSchedulingConfig).stringify(), schedulingConfigs.entity)
                    .then(function (response) {
                    	return response.data;
                    });
                }
              };
          }
      ])
  ;